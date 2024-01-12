import numpy as np 
import pandas as pd


def evaluate_prompts(df):
    
    scores = df[6].to_list
    averages = []
    
    for score in scores:
        integers = [int(char) for char in score if char.isdigit()]
        average = np.mean(integers)
        averages.append(average)
    
    df = df.insert(7, 'NewColumn', averages)
    
    # Group the score of the same instruction and compute the mean 
    inst2score = df.groupby(0)[7].mean().reset_index()
    
    return inst2score


class EvaluationResult():
    
    def __init__(self, df):
        self.data = df

    def sorted(self):
        sorted_df = self.data.sort_values(by=1, ascending = False)
        sorted_df.head()

    def in_place(self):
        self.data.head()