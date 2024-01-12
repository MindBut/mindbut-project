import numpy as np
import pandas as pd


data = pd.read_csv('fill_counselor_2100.csv', index_col=0)

first_idx = int(input('> First index: '))
last_idx = int(input('> Last index: '))
instruction = "당신은 상담자입니다. 아래의 대화를 읽고, 내담자의 감정에 공감하고 이해한 뒤, 내담자의 비합리적이고 건강하지 않은 신념을 찾아 합리적이고 건강한 신념으로 변화시키는 방향으로 3~4문장의 답변을 제시해 주세요. 내담자의 상담 목표와 현재 우울/불안 상태를 고려하여 답변해 주세요."

def generate_prompt(goal, depressed, anxious, input_text):
    return (f"{instruction} 아래의 내담자에게 적절한 상담자의 답변은 무엇인가요?\n\n"
                + f"내담자의 상담 목표: {goal}\n"
                + f"내담자의 상태: {depressed} 수준의 우울, {anxious} 수준의 불안\n"
                + f"내담자의 발화: {input_text}\n\n"
                + f"상담자의 답변: ")


for row in range(first_idx, last_idx + 1):
    goal = data.loc[row, '상담 목표']
    depressed = data.loc[row, '우울 수준']
    anxious = data.loc[row, '불안 수준']
    input_text = data.loc[row, 'input']

    print(f"\n--Row {row}----------------------------------------------\n")
    template = generate_prompt(goal, depressed, anxious, input_text)
    print(template)
    print()
    
    llm_response = input('> Type in output (or <q> to quit): ')
    
    if llm_response == 'q':
        break
    else:
        data.loc[row, 'output'] = llm_response

data.to_csv('fill_counselor_2100.csv')
