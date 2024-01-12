import random
import os
import numpy as np
import pandas as pd 

goals = ['불안 완화', '관계 개선', '생산성 향상', '우울 완화', '자존감 향상', 
            '자신감 향상', '스트레스 완화', '행복 증대']
depressed = ['정상', '경미한', '중간', '약간 심한', '심한']
anxious = ['정상', '경미한', '중간', '약간 심한', '심한']

root = './'
gen_data = pd.read_csv(os.path.join(root,'data/make_data.csv'))

n = len(gen_data) - 1
input_goals = random.choices(goals, k = n)
input_depressed = random.choices(depressed, k = n)
input_anxious = random.choices(anxious, k = n)

gen_data.insert(4, '상담 목표', input_goals)
gen_data.insert(5, '우울 수준', input_depressed)
gen_data.insert(6, '불안 수준', input_anxious)