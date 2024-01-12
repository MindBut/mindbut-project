from openai import OpenAI

def moodtracking_model(prompt : str):
    # 키 바꾸기
    client = OpenAI(api_key = '')

    client.fine_tuning.jobs.list(limit = 5)
    
    model = "ft:gpt-3.5-turbo-1106:personal::8XuHUQ7S" 

    system_content = "당신은 따뜻하고 상냥한 상담자로서 내담자의 감정 상태에 공감, 반영해야합니다. 3~4줄로, 친구처럼 친근하고 다정하게 감정에 공감해주세요. 명언, 명대사, 이모티콘을 활용하면 좋습니다. "

    for i in range(1):
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": prompt}
            ]
        )

        parse_out = response.choices[0].message.content
    return parse_out