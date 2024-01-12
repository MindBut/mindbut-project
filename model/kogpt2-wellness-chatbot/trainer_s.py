# -*- coding: utf-8 -*-
import argparse
import logging

import numpy as np
import pandas as pd
import torch

from pytorch_lightning.callbacks import ModelCheckpoint
from pytorch_lightning import LightningModule, Trainer
from torch.utils.data import DataLoader, Dataset
from transformers.optimization import AdamW, get_cosine_schedule_with_warmup
from transformers import PreTrainedTokenizerFast, GPT2LMHeadModel, GPT2TokenizerFast

import os

# 체크포인트를 저장할 디렉토리 생성 (존재하지 않을 경우)
checkpoint_dir = 'model_chp'
os.makedirs(checkpoint_dir, exist_ok=True)


parser = argparse.ArgumentParser(description='Simsimi based on KoGPT-2')

parser.add_argument('--chat',
                    action='store_true',
                    default=False,
                    help='response generation on given user input')

parser.add_argument('--sentiment',
                    type=str,
                    default='0',
                    help='sentiment for system. 0 is neutral, 1 is negative, 2 is positive.')

parser.add_argument('--model_params',
                    type=str,
                    default='model_chp/last.ckpt',
                    help='model binary for starting chat')

parser.add_argument('--train',
                    action='store_true',
                    default=False,
                    help='for training')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

U_TKN = '<usr>'
S_TKN = '<sys>'
BOS = '</s>'
EOS = '</s>'
MASK = '<unused0>'
SENT = '<unused1>'
PAD = '<pad>'

TOKENIZER = PreTrainedTokenizerFast.from_pretrained("skt/kogpt2-base-v2",
            bos_token=BOS, eos_token=EOS, unk_token='<unk>',
            pad_token=PAD, mask_token=MASK) 


class CharDataset(Dataset):
    def __init__(self, chats, max_len=512):
        self._data = chats
        self.first = True
        self.q_token = U_TKN
        self.a_token = S_TKN
        self.sent_token = SENT
        self.bos = BOS
        self.eos = EOS
        self.mask = MASK
        self.pad = PAD
        self.max_len = max_len
        self.tokenizer = TOKENIZER 

    def __len__(self):
        return len(self._data)

    def __getitem__(self, idx):
        turn = self._data.iloc[idx]
        q = turn['input']
        a = str(turn['output'])
        sentiment = str(turn['불안 수준'])
        q_toked = self.tokenizer.tokenize(self.q_token + q + self.sent_token + sentiment)
        q_len = len(q_toked)
        a_toked = self.tokenizer.tokenize(self.a_token + a + self.eos)
        a_len = len(a_toked)

        if q_len + a_len > self.max_len:
            a_len = self.max_len - q_len
            if a_len <= 0:
                q_toked = q_toked[-(int(self.max_len/2)):]
                q_len = len(q_toked)
                a_len = self.max_len - q_len
                assert a_len > 0
            a_toked = a_toked[:a_len]
            a_len = len(a_toked)
            assert a_len == len(a_toked), f'{a_len} ==? {len(a_toked)}'

        labels = [self.mask] * q_len + a_toked[1:]
        mask = [0] * q_len + [1] * a_len + [0] * (self.max_len - q_len - a_len)
        
        labels_ids = self.tokenizer.convert_tokens_to_ids(labels)
        token_ids = self.tokenizer.convert_tokens_to_ids(q_toked + a_toked)

        # 패딩 처리
        labels_ids += [self.tokenizer.pad_token_id] * (self.max_len - len(labels_ids))
        token_ids += [self.tokenizer.pad_token_id] * (self.max_len - len(token_ids))

        return (torch.LongTensor(token_ids), torch.LongTensor(mask), torch.LongTensor(labels_ids))

class KoGPT2Chat(LightningModule):
    def __init__(self, hparams, **kwargs):
        super(KoGPT2Chat, self).__init__()
        self.save_hyperparameters(hparams)
        self.neg = -1e18
        self.kogpt2 = GPT2LMHeadModel.from_pretrained('skt/kogpt2-base-v2')
        self.loss_function = torch.nn.CrossEntropyLoss(reduction='none')

    @staticmethod
    def add_model_specific_args(parent_parser):
        # add model specific args
        parser = argparse.ArgumentParser(parents=[parent_parser], add_help=False)
        parser.add_argument('--max-len',
                            type=int,
                            default=128,
                            help='max sentence length on input (default: 32)')

        parser.add_argument('--batch-size',
                            type=int,
                            default=64,
                            help='batch size for training (default: 96)')
        parser.add_argument('--lr',
                            type=float,
                            default=5e-5,
                            help='The initial learning rate')
        parser.add_argument('--warmup_ratio',
                            type=float,
                            default=0.1,
                            help='warmup ratio')
        return parser

    def forward(self, inputs, attention_mask=None):
        # inputs 및 attention_mask를 모델에 전달
        output = self.kogpt2(inputs, attention_mask=attention_mask, return_dict=True)
        return output.logits

    def training_step(self, batch, batch_idx):
        token_ids, mask, label = batch
        out = self(token_ids)
        mask_3d = mask.unsqueeze(dim=2).repeat_interleave(repeats=out.shape[2], dim=2)
        mask_out = torch.where(mask_3d == 1, out, self.neg * torch.ones_like(out))
        loss = self.loss_function(mask_out.transpose(2, 1), label)
        loss_avg = loss.sum() / mask.sum()
        self.log('train_loss', loss_avg)
        return loss_avg

    def configure_optimizers(self):
        # Prepare optimizer
        param_optimizer = list(self.named_parameters())
        no_decay = ['bias', 'LayerNorm.bias', 'LayerNorm.weight']
        optimizer_grouped_parameters = [
            {'params': [p for n, p in param_optimizer if not any(nd in n for nd in no_decay)], 'weight_decay': 0.01},
            {'params': [p for n, p in param_optimizer if any(nd in n for nd in no_decay)], 'weight_decay': 0.0}
        ]
        optimizer = AdamW(optimizer_grouped_parameters,
                          lr=self.hparams.lr, correct_bias=False)
        # warm up lr
        num_train_steps = len(self.train_dataloader()) * self.hparams.max_epochs
        num_warmup_steps = int(num_train_steps * self.hparams.warmup_ratio)
        scheduler = get_cosine_schedule_with_warmup(
            optimizer,
            num_warmup_steps=num_warmup_steps, num_training_steps=num_train_steps)
        lr_scheduler = {'scheduler': scheduler, 'name': 'cosine_schedule_with_warmup',
                        'monitor': 'loss', 'interval': 'step',
                        'frequency': 1}
        return [optimizer], [lr_scheduler]

    def _collate_fn(self, batch):
        data = [item[0] for item in batch]
        mask = [item[1] for item in batch]
        label = [item[2] for item in batch]

        data = torch.stack([torch.LongTensor(d) for d in data])
        mask = torch.stack([torch.LongTensor(m) for m in mask])
        label = torch.stack([torch.LongTensor(l) for l in label])

        return data, mask, label

    def train_dataloader(self):
        data = pd.read_csv('fill_counselor_2100exact.csv', encoding='utf-8')
        self.train_set = CharDataset(data, max_len=self.hparams.max_len)
        train_dataloader = DataLoader(
            self.train_set, 
            batch_size=self.hparams.batch_size, 
            num_workers=2,
            shuffle=True, 
            collate_fn=self._collate_fn)
        return train_dataloader


    def chat(self, sent='0'):
        device = next(self.parameters()).device
        tok = TOKENIZER
        sent_tokens = tok.tokenize(sent)
        with torch.no_grad():
            p = input('user > ')
            q = p.strip()
            a = ''
            while 1:
                input_ids = torch.LongTensor(tok.encode(U_TKN + q + SENT + sent + S_TKN + a)).unsqueeze(dim=0)
                attention_mask = torch.where(input_ids != tok.pad_token_id, 1, 0)
                input_ids = input_ids.to(device)
                attention_mask = attention_mask.to(device)

                pred = self(input_ids, attention_mask=attention_mask)
                pred = pred.cpu()
                gen = tok.convert_ids_to_tokens(torch.argmax(pred, dim=-1).squeeze().numpy().tolist())[-1]
                if gen == EOS:
                    break
                a += gen.replace('▁', ' ')
            print("Chatbot > {}".format(a.strip()))

# 기존 parser 정의
parser = argparse.ArgumentParser(description='Simsimi based on KoGPT-2')

# 기존 인자 추가
parser.add_argument('--chat', action='store_true', default=False, help='response generation on given user input')
parser.add_argument('--sentiment', type=str, default='2', help='sentiment for system. 0 is neutral, 1 is negative, 2 is positive.')
parser.add_argument('--model_params', type=str, default='model_chp/last.ckpt', help='model binary for starting chat')
parser.add_argument('--train', action='store_true', default=False, help='for training')
parser.add_argument('--lr', type=float, default=5e-5, help='The initial learning rate')
parser.add_argument('--max-len', type=int, default=128, help='max sentence length on input')
parser.add_argument('--batch-size', type=int, default=64, help='batch size for training')
parser.add_argument('--warmup_ratio', type=float, default=0.1, help='Warmup ratio for learning rate')

# PyTorch Lightning 관련 인자 추가
parser.add_argument('--max_epochs', type=int, default=5, help='Maximum number of training epochs')
parser.add_argument('--gpus', type=int, default=1, help='Number of GPUs to use')
parser.add_argument('--accelerator', type=str, default=None, help='Type of accelerator (e.g., "dp" for Data Parallel)')
# 추가적으로 필요한 PyTorch Lightning 인자들을 여기에 추가할 수 있습니다.
args = parser.parse_args()
logging.info(args)

if __name__ == "__main__":
    if args.train:
        checkpoint_callback = ModelCheckpoint(
            dirpath=checkpoint_dir,  # 절대 경로 또는 상대 경로
            filename='model-{epoch:02d}-{train_loss:.2f}',  # 파일명 형식 지정
            verbose=True,
            save_last=True,
            monitor='train_loss',
            mode='min'
        )
        # python train_torch.py --train --gpus 1 --max_epochs 3
        model = KoGPT2Chat(args)
        trainer = Trainer(
            max_epochs=args.max_epochs,
            log_every_n_steps=20,  # 예: 20으로 설정
            callbacks=[checkpoint_callback],
            gradient_clip_val=1.0
        )
        trainer.fit(model)
        logging.info('best model path {}'.format(checkpoint_callback.best_model_path))
    if args.chat:
        model = KoGPT2Chat.load_from_checkpoint(args.model_params)
        model.chat()
