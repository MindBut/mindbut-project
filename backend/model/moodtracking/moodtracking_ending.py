from openai import OpenAI

def moodtracking_ending(message_select: str):
        
    client = OpenAI(api_key = '')

    client.fine_tuning.jobs.list(limit = 5)

    model_end = "ft:gpt-3.5-turbo-1106:personal::8YF8aYtN"
    system_prompt_3 = "당신은 상담자입니다. 내담자의 말에 반응하고 다정하게 상담을 종료해주세요."

    for i in range(1):
        response_end = client.chat.completions.create(
            model = model_end,
            messages=[
                {"role": "system", "content": system_prompt_3},
                {"role": "user", "content": message_select}
            ]
        )

        final = response_end.choices[0].message.content
    return final
