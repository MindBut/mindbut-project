from openai import OpenAI

def moodtracking_userresponse(message_model: str):
        
    client = OpenAI(api_key = '')

    client.fine_tuning.jobs.list(limit = 5)

    model_response = "ft:gpt-3.5-turbo-1106:personal::8YJdti1y"
    system_prompt_2 = "당신은 내담자입니다. 따뜻한 상담자의 응답에 1줄로 적극적으로 반응해주세요."
    response_list = []

    for i in range(2):
        response_selection = client.chat.completions.create(
            model=model_response,
            messages=[
                {"role": "system", "content": system_prompt_2},
                {"role": "user", "content": message_model}
            ]
        )

        selection = response_selection.choices[0].message.content
        print(selection)
        response_list.append(selection)
    
    return response_list