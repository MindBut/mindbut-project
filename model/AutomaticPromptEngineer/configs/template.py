class GenerationTemplate:
    """
    Takes a prompt template and provides methods for filling in blanks. 
    The format is as follows. 
    [DEMO] is where the instruction will be inserted.
    """
    def __init__(self, template):
        self.template = template 
    
    def fill(self, demo=''):
        '''
        Fill the template with few-shot instruction.
        '''
        return self.template.replace('[DEMO]', demo)
    
class EvalTemplate: 
    """
    Takes a prompt template and provides methods for filling in blanks. 
    The format is as given. 
    [PROMPT] is where the generated prompt will be inserted. 
    [KNOWLEDGE] is where the status of the counselee will be inserted. 
    [INPUT] is where the input of the counselee will be inserted. 
    """
    def __init__(self, template):
        self.template = template
        
    def fill(self, prompt='', goal='', depressed='', anxious='', input=''):
        """
        Fills in the template with the given values. 
        Args:
            prompt (str, optional): generated prompt. Defaults to ''.
            goal (str, optional): goal of the counseling process. Defaults to ''.
            depressed (str, optional): Extent of depression. Defaults to ''.
            anxious (str, optional): Extent of anxiety. Defaults to ''.
            input (str, optional): input of counselee. Defaults to ''.
        """
        return self.template.replace('[PROMPT]', prompt).replace(
            '[GOAL]', goal).replace('[DEPRESSED]', depressed).replace(
                '[ANXIOUS]', anxious).replace('[INPUT]', input)

class ScoreTemplate:
    """
    Takes the full counseling chat and provides a metric for the scoring procedure. 
    The format is as follows:
    [GOAL], [DEPRESSED], [ANXIOUS], [INPUT], [OUTPUT]
    """
    def __init__(self, template):
        self.template = template
    
    def fill(self, data):
        """
        Fills in the template with the given values. Data is a tuple of lists. 

        Args:
            data (goal, depressed, anxious, input, output) 
        """
        for (goal_, depressed_, anxious_, input_, output_) in enumerate(zip(*data)):
            score_template += self.template.replace('[INPUT]', input_).replace(
            '[GOAL]', goal_).replace('[DEPRESSED]', depressed_).replace(
                '[ANXIOUS]', anxious_).replace('[OUTPUT]', output_)
        
        return score_template 