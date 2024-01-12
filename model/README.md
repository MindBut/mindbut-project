## 마인드벗: 모델링
(Introduction)

## APE
(TBA)

## Generate Dataset

**1. 파일 실행**

`generate-dataset` 경로로 이동하여 `prompt_automation.py` 파일을 실행합니다.

```
$ cd generate-dataset
$ python prompt_automation.py
```

**2. 인덱스 범위 입력하기**

프롬프트를 생성할 인덱스의 범위를 입력합니다.

```
> First index: (입력하기)
> Last index: (입력하기)
```

**3. 프롬프트 생성**

생성된 프롬프트("당신은 상담자입니다" 부터 "상담자의 답변:" 까지)를 그대로 복사해서 뤼튼/챗GPT에 넣어줍니다.
```
--Row #----------------------------------------------

당신은 상담자입니다. 

(생략)

상담자의 답변:
```

**4. 응답 저장하기**

`Type in output (or <q> to quit):` 부분에 LLM의 응답을 붙여 넣어줍니다.
```
> Type in output (or <q> to quit): (붙여넣기)
```

**5. 종료하기**

중간에 프로그램을 종료하고 CSV파일을 저장하고 싶다면 `q`를 입력하면 됩니다. *프로그램이 종료되어야* CSV 파일이 저장되므로 300개를 한번에 하기보다는 조금씩 끊어서 하시는걸 추천...