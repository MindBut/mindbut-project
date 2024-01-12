import jsonlines
import random

# multi_turn_input.jsonl 파일의 줄을 모두 읽습니다.
with jsonlines.open('multi_turn_input.jsonl', mode='r') as reader:
    multi_turn_lines = list(reader)

# 랜덤하게 300줄을 선택합니다.
sampled_lines = random.sample(multi_turn_lines, 60)

# new_file.jsonl 파일의 줄을 모두 읽습니다.
with jsonlines.open('new_file.jsonl', mode='r') as reader:
    new_file_lines = list(reader)

# 두 파일의 줄을 모두 합칩니다.
final_lines = sampled_lines + new_file_lines

# final_finetuning.jsonl 파일에 합친 줄을 씁니다.
with jsonlines.open('final_finetuning.jsonl', mode='w') as writer:
    writer.write_all(final_lines)
