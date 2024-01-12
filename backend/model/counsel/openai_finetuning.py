from openai import OpenAI

def counsel_model(chatting_user: str):
    client = OpenAI(api_key = '')

    client.fine_tuning.jobs.list(limit = 5)


    model = "ft:gpt-3.5-turbo-1106:personal::8Taf59kM"  
    #model_1 = "ft:gpt-3.5-turbo-1106:personal::8Tbya3R"
    #model_2 = "ft:gpt-3.5-turbo-1106:personal::8TcU6yCT"

    # With assistant content
    system_content = "당신은 상담자로서 내담자의 응답에 대한 적극적인 공감과 이해를 표현해야 합니다. 또한, 내담자의 비합리적이고 건강하지 않은 신념을 파악하여 합리적이고 건강하게 교정할 수 있도록 답변해야 합니다. 우울과 불안 완화를 위한 상담 목표를 달성할 수 있도록 도와주시고, 내담자의 현재 우울 및 불안 상태를 고려하여 답변해야 합니다."
    # assistant_content = "On Monday, location0, location1, and location2 open at 9 am, 8 am, and 8 am respectively."

    for i in range(1):
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": chatting_user}
            ]
        )

        parse_out = response.choices[0].message.content
    
    return parse_out

