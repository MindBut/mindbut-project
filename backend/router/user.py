from fastapi import APIRouter, Depends, HTTPException
from database.database_model import Users, User
from sqlalchemy.orm import Session
from typing_extensions import Annotated
from database.database import SessionLocal
from starlette import status

router = APIRouter(
    tags = ["user"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/signup")
def create_user(db: db_dependency, param_user: User):
    existing_user = db.query(Users).filter(Users.user_kakaotalk == param_user.user_kakaotalk).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="username already registered")
    new_user = Users(
        user_kakaotalk = param_user.user_kakaotalk
    )
    db.add(new_user)
    db.commit()
    return {'detail' : 'sign up success'}

@router.post("/signup/name")
def create_user_name(db: db_dependency, param_user: User):
    try:
        user = db.query(Users).filter(Users.user_kakaotalk == param_user.user_kakaotalk).first()
        user.user_name = param_user.user_name
        db.commit()
        return {'detail' : 'register name success'}
    except Exception as e:
        return {'detail' : 'register name fail' + str(e)}

@router.post("/signup/bot")
def create_user_bot(db: db_dependency, param_user: User):
    try:
        user = db.query(Users).filter(Users.user_kakaotalk == param_user.user_kakaotalk).first()
        user.bot_name = param_user.bot_name
        db.commit()
        return {'detail' : 'register bot success'}
    except Exception:
        return {'detail' : 'register bot fail'}

@router.post("/signup/survey")
def create_user_survey(db:db_dependency, param_user: User):
    try:
        user = db.query(Users).filter(Users.user_kakaotalk == param_user.user_kakaotalk).first()
        user.survey_question_one = param_user.survey_question_one
        user.survey_question_two = param_user.survey_question_two
        user.survey_question_three = param_user.survey_question_three
        user.survey_question_four = param_user.survey_question_four
        user.survey_question_five = param_user.survey_question_five
        db.commit()
        return {'detail' : 'register survey success'}
    except Exception as e:
        return {'detail' : 'register survey fail'}
    
@router.get("/login")
def get_user_info(db: db_dependency, user_kakaotalk = str):
    try:
        user = db.user = db.query(Users).filter(Users.user_kakaotalk == user_kakaotalk).first()
        return {'detail' : 'success to get user info', 'user_kakaotalk': user.user_kakaotalk, 'user_name' : user.user_name,
                'bot_name' : user.bot_name, 'survey_question_one' : user.survey_question_one,
                'survey_question_two' : user.survey_question_two, 'survey_question_three' : user.survey_question_three, 
                'survey_question four' : user.survey_question_four, 'survey_question_five' : user.survey_question_five}
    except Exception:
        return {'detail' : 'fail to get user info'}
    