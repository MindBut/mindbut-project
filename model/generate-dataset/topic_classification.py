import torch
import pandas as pd
from transformers import DistilBertTokenizer, DistilBertModel
from torch.utils.data import DataLoader, Dataset
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import torch.nn as nn
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
import numpy as np
import pickle

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 데이터 불러오기
data = pd.read_csv("C:/Users/may_2/Downloads/wellness_modified.csv")

# 데이터셋 나누기
train_data, test_data = train_test_split(data, test_size=0.2, random_state=42)

class WellnessDataset(Dataset):
    def __init__(self, data, tokenizer, max_len, label_encoders):
        self.data = data
        self.tokenizer = tokenizer
        self.max_len = max_len
        self.label_encoders = label_encoders

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        sentence = str(self.data.iloc[index]['유저'])
        labels = {
            '대분류': str(self.data.iloc[index]['대분류']),
            '중분류': str(self.data.iloc[index]['중분류']),
            '소분류': str(self.data.iloc[index]['소분류']),
            '세부분류': str(self.data.iloc[index]['세부분류'])
        }

        encoding = self.tokenizer(
            sentence,
            add_special_tokens=True,
            truncation=True,
            max_length=self.max_len,
            padding='max_length',
            return_tensors='pt'
        )

        # LabelEncoder를 사용하여 레이블을 정수로 인코딩
        for key, value in labels.items():
            if value not in self.label_encoders[key].classes_:
                self.label_encoders[key].classes_ = np.append(self.label_encoders[key].classes_, value)

        label_ids = {key: torch.tensor(self.label_encoders[key].transform([value])).item() for key, value in labels.items()}

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': label_ids
        }

# BERT 토크나이저 로드 (DistilKoBert 사용)
tokenizer = DistilBertTokenizer.from_pretrained('monologg/distilkobert')

# LabelEncoder 초기화
label_encoders = {key: LabelEncoder() for key in ['대분류', '중분류', '소분류', '세부분류']}
for key in label_encoders.keys():
    train_data[key] = label_encoders[key].fit_transform(train_data[key])
    test_data[key] = label_encoders[key].transform(test_data[key])

# 데이터셋 생성
max_len = 128
train_dataset = WellnessDataset(train_data, tokenizer, max_len, label_encoders)
test_dataset = WellnessDataset(test_data, tokenizer, max_len, label_encoders)

# DataLoader 생성
batch_size = 4  # 필요에 따라 조정
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)


# 사용자 정의 모델 생성
class CustomDistilBertForSequenceClassification(nn.Module):
    def __init__(self, distilbert_model, num_labels):
        super(CustomDistilBertForSequenceClassification, self).__init__()
        self.distilbert = distilbert_model
        self.dropout = nn.Dropout(0.1)
        self.classifier = nn.Linear(self.distilbert.config.dim, num_labels)

    def forward(self, input_ids, attention_mask=None, labels=None):
        outputs = self.distilbert(input_ids, attention_mask=attention_mask)
        pooled_output = outputs['last_hidden_state'][:, 0, :]
        pooled_output = self.dropout(pooled_output)
        logits = self.classifier(pooled_output)

        loss = None
        if labels is not None:
            loss_fct = nn.CrossEntropyLoss()
            loss = loss_fct(logits, labels)

        return {'logits': logits, 'loss': loss}

# 대분류 모델 생성 및 학습 설정
num_labels_large = len(label_encoders['대분류'].classes_)
model_large = CustomDistilBertForSequenceClassification(DistilBertModel.from_pretrained('monologg/distilkobert'), num_labels_large)
optimizer_large = torch.optim.AdamW(model_large.parameters(), lr=2e-5)

# 중분류 모델 생성 및 학습 설정
num_labels_medium = len(label_encoders['중분류'].classes_)
model_medium = CustomDistilBertForSequenceClassification(DistilBertModel.from_pretrained('monologg/distilkobert'), num_labels_large)  # 수정
optimizer_medium = torch.optim.AdamW(model_medium.parameters(), lr=2e-5)

# 소분류 모델 생성 및 학습 설정
num_labels_small = len(label_encoders['소분류'].classes_)
model_small = CustomDistilBertForSequenceClassification(DistilBertModel.from_pretrained('monologg/distilkobert'), num_labels_large)  # 수정
optimizer_small = torch.optim.AdamW(model_small.parameters(), lr=2e-5)

# 세부분류 모델 생성 및 학습 설정
num_labels_detail = len(label_encoders['세부분류'].classes_)
model_detail = CustomDistilBertForSequenceClassification(DistilBertModel.from_pretrained('monologg/distilkobert'), num_labels_large)  # 수정
optimizer_detail = torch.optim.AdamW(model_detail.parameters(), lr=2e-5)


epochs = 1

# 대분류 학습
for epoch in range(epochs):
    model_large.train()  # 수정: model_large로 변경
    for batch in tqdm(train_loader, desc=f'Epoch {epoch + 1}/{epochs} - 대분류'):
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['labels']['대분류'].squeeze().long().to(device)

        # 모델의 클래스 개수를 레이블 인코딩에 사용된 클래스 개수로 설정
        num_labels_large = len(label_encoders['대분류'].classes_)  # 수정: label_encoders로 변경
        model_large.classifier = nn.Linear(model_large.distilbert.config.dim, num_labels_large).to(device)

        outputs = model_large(input_ids, attention_mask=attention_mask, labels=labels)  # 수정: model_large로 변경

        loss = outputs['loss']
        loss.backward()
        optimizer_large.step()

# 중분류, 소분류, 세부분류 모델 학습 (각 모델에 해당하는 train_loader 사용)
for epoch in range(epochs):
    model_medium.train()
    for batch in tqdm(train_loader, desc=f'Epoch {epoch + 1}/{epochs} - 중분류'):
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['labels']['중분류'].squeeze().long().to(device)

        num_labels_medium = len(label_encoders['중분류'].classes_)
        model_medium.classifier = nn.Linear(model_medium.distilbert.config.dim, num_labels_medium).to(device)

        outputs = model_medium(input_ids, attention_mask=attention_mask, labels=labels)

        loss = outputs['loss']
        loss.backward()
        optimizer_medium.step()

# 소분류 학습 (동일한 방식으로 수정)
for epoch in range(epochs):
    model_small.train()
    for batch in tqdm(train_loader, desc=f'Epoch {epoch + 1}/{epochs} - 소분류'):
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['labels']['소분류'].squeeze().long().to(device)

        num_labels_small = len(label_encoders['소분류'].classes_)
        model_small.classifier = nn.Linear(model_small.distilbert.config.dim, num_labels_small).to(device)

        outputs = model_small(input_ids, attention_mask=attention_mask, labels=labels)

        loss = outputs['loss']
        loss.backward()
        optimizer_small.step()

# 세부분류 학습 (동일한 방식으로 수정)
for epoch in range(epochs):
    model_detail.train()
    for batch in tqdm(train_loader, desc=f'Epoch {epoch + 1}/{epochs} - 세부분류'):
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['labels']['세부분류'].squeeze().long().to(device)

        num_labels_detail = len(label_encoders['세부분류'].classes_)
        model_detail.classifier = nn.Linear(model_detail.distilbert.config.dim, num_labels_detail).to(device)

        outputs = model_detail(input_ids, attention_mask=attention_mask, labels=labels)

        loss = outputs['loss']
        loss.backward()
        optimizer_detail.step()

# 대분류 모델 및 옵티마이저 저장
torch.save({
    'epoch': epoch,
    'model_state_dict': model_large.state_dict(),
    'optimizer_state_dict': optimizer_large.state_dict(),
    'loss': loss,
}, 'model_checkpoint_large.pth')

# 중분류 모델 및 옵티마이저 저장
torch.save({
    'epoch': epoch,
    'model_state_dict': model_medium.state_dict(),
    'optimizer_state_dict': optimizer_medium.state_dict(),
    'loss': loss,
}, 'model_checkpoint_medium.pth')

# 소분류 모델 및 옵티마이저 저장
torch.save({
    'epoch': epoch,
    'model_state_dict': model_small.state_dict(),
    'optimizer_state_dict': optimizer_small.state_dict(),
    'loss': loss,
}, 'model_checkpoint_small.pth')

# 세부분류 모델 및 옵티마이저 저장
torch.save({
    'epoch': epoch,
    'model_state_dict': model_detail.state_dict(),
    'optimizer_state_dict': optimizer_detail.state_dict(),
    'loss': loss,
}, 'model_checkpoint_detail.pth')


# 대분류 모델, 옵티마이저, 에폭 등을 저장하는 딕셔너리 생성
training_info_large = {
    'epoch': epoch,
    'model_state_dict': model_large.state_dict(),
    'optimizer_state_dict': optimizer_large.state_dict(),
    'loss': loss,
}

# 저장
with open('mindbut_training_info_large.pkl', 'wb') as file:
    pickle.dump(training_info_large, file)

# 중분류 모델, 옵티마이저, 에폭 등을 저장하는 딕셔너리 생성
training_info_medium = {
    'epoch': epoch,
    'model_state_dict': model_medium.state_dict(),
    'optimizer_state_dict': optimizer_medium.state_dict(),
    'loss': loss,
}

# 저장
with open('mindbut_training_info_medium.pkl', 'wb') as file:
    pickle.dump(training_info_medium, file)

# 소분류 모델, 옵티마이저, 에폭 등을 저장하는 딕셔너리 생성
training_info_small = {
    'epoch': epoch,
    'model_state_dict': model_small.state_dict(),
    'optimizer_state_dict': optimizer_small.state_dict(),
    'loss': loss,
}

# 저장
with open('mindbut_training_info_small.pkl', 'wb') as file:
    pickle.dump(training_info_small, file)

# 세부분류 모델, 옵티마이저, 에폭 등을 저장하는 딕셔너리 생성
training_info_detail = {
    'epoch': epoch,
    'model_state_dict': model_detail.state_dict(),
    'optimizer_state_dict': optimizer_detail.state_dict(),
    'loss': loss,
}

# 저장
with open('mindbut_training_info_detail.pkl', 'wb') as file:
    pickle.dump(training_info_detail, file)
