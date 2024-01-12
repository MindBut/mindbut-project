import random
import numpy as np
import pandas as pd

def subsample_instruction(instructions, subsample_size):
    """Subsample instruction

    Args:
        instructions (list)
        subsample_size (int): number of subsamples to get from 
    """
    indices = random.sample(range(len(instructions)), subsample_size)
    instruction_samples = [instructions[i] for i in indices]
    return instruction_samples

def subsample_data(data, goals, depressed, anxious, subsample_size):
    """Generate subsamples from data

    Args:
        data (dataframe): 4 columns of categorical labels, 1 column input, 1 column output
        goals (list): list of counseling goals
        depressed (list): list of the extent of depression
        anxious (list): list of the extent of anxiety
        subsample_size (int): number of subsamples to generate

    Returns:
        goal, depressed, anxious, category, input (list): list of subsamples
    """
    print(type(data))
    n = data.shape[0]-1   # number of datas
    print(n)
    goal = random.choices(goals, k=subsample_size)
    depressed = random.choices(depressed, k=subsample_size)
    anxious = random.choices(anxious, k=subsample_size)
    data_index = random.sample([i for i in range(n)], subsample_size)
        
    category = []
    input = []

    for i in data_index:
        value = ""
        if pd.notnull(data.iloc[i+1,0]):
            value += data.iloc[i+1,0]
        if pd.notnull(data.iloc[i+1,1]):
            if value:
                value += '/'
            value += data.iloc[i+1,1]
        if pd.notnull(data.iloc[i+1,2]):
            if value:
                value += '/'
            value += data.iloc[i+1,2]
        if pd.notnull(data.iloc[i+1,3]):
            if value:
                value += '/'
            value += data.iloc[i+1,3]
        category.append(value)
        
        assert pd.notnull(data.iloc[i+1,4])
        input.append(data.iloc[i+1,4])

    return goal, depressed, anxious, category, input
    