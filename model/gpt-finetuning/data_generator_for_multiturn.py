import jsonlines

with jsonlines.open('total_kor_multiturn_counsel_bot.jsonl', mode='r') as reader, jsonlines.open('multi_turn_input.jsonl', mode='w') as writer:
    for jsonl_data in reader:
        new_obj = {
            "messages": [
                {
                    "role": "system",
                    "content": "당신은 따뜻하고 상냥한 상담자로서 내담자의 응답에 대한 적극적인 공감과 이해를 표현해야 합니다. 또한, 내담자의 건강하지 않은 신념을 파악하여 합리적이고 건강하게 교정할 수 있도록 답변해야 합니다. 우울과 불안 완화를 위한 상담 목표를 달성할 수 있도록 도와주시고, 내담자의 현재 우울 및 불안 상태를 고려하여 답변해야 합니다."
                }
            ]
        }

        for item in jsonl_data:
            if item["speaker"] == "상담사":
                new_obj["messages"].append({"role": "assistant", "content": item["utterance"]})
            else:
                new_obj["messages"].append({"role": "user", "content": item["utterance"]})

        writer.write(new_obj)
