# MindBut Backend

* 설치
    * `pip install "fastapi[all]"`
    * `pip install openai`
    * `pip install python-dotenv`


* 준비
    * root 파일에 .env 생성 (openai key 유출 조심!)


* 실행
    * 터미널에서 `uvicorn main:app --reload`를 실행
    * <http://127.0.0.1:8000/docs> 에서 API 문서 확인 가능