# %% [markdown]
# # Optimizing Prompt using Automatic Prompt Engineering

# %%
# from AutomaticPromptEngineer import APE, configs
import os
import yaml
import numpy as np
import pandas as pd
import time

# %%
import openai 
from dotenv import load_dotenv, find_dotenv

# %%
_ = load_dotenv(find_dotenv())
openai.api_key = os.getenv('OPENAI_API_KEY')
os.environ["OPENAI_API_KEY"] = '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'

# %%
# Get the list of goals, depressed, anxious categories to sample from 

goals = ['불안 완화', '관계 개선', '생산성 향상', '우울 완화', '자존감 향상', 
            '자신감 향상', '스트레스 완화', '행복 증대']
depressed = ['정상', '경미한', '중간', '약간 심한', '심한']
anxious = ['정상', '경미한', '중간', '약간 심한', '심한']

# %%
# Download dataset 
root = './'
data_path = os.path.join(root, 'data')
file_path = os.path.join(data_path, 'mindbut_classification_merged_file.csv')

data = pd.read_csv(file_path)
data.head()

# %%
# Download Instruction 
inst_path = os.path.join(data_path, 'inst.txt')
with open(inst_path, 'r') as file:
    # read file
    content = file.read()

# split by '-----'
content_list = content.split('-----')
instructions = [item.strip() for item in content_list]

# %%
# Get configs path
configs_path = os.path.join(root, 'configs', 'model.yaml')

# Read YAML file
with open(configs_path, 'r') as file:
    configs = yaml.safe_load(file)

config_generation = configs['generation']
config_eval = configs['evaluation']
config_score = configs['score']

print(config_generation['num_queries_per_subsample'])

# %%
from APE import generate, evaluate
from APE.evaluate import EvaluationResult

# %%
print(config_generation['model'])

# %%
# Generate Prompt 
response = generate.generate_prompt(instructions, config_generation)
print(response)

# %%
# Download Generated Instruction Candidate
inst_path = os.path.join(data_path, 'generated_prompt.txt')
with open(inst_path, 'r') as file:
    # read file
    content = file.read()

# split by '-----'
content_list = content.splitlines()
instructions = [item.strip().replace('[', '').replace(']', '').replace('"', '').replace("'", '') for item in content_list]

# %%
# Generate outputs of counselor given the prompt
outputs = generate.eval_prompt(instructions, goals, depressed, anxious, data, config_eval)
outputs.head()

# %%
# Compute the scores
scores = generate.score_prompt(outputs, config_score)
scores.head()

# %%
# Find the best prompts 
SCORES = evaluate.evaluate_prompts(scores)
best_prompts = EvaluationResult.sorted(SCORES)


