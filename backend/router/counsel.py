from fastapi import APIRouter, Depends, HTTPException, Path
from database.database_model import *
from sqlalchemy.orm import Session
from typing_extensions import Annotated
from database.database import SessionLocal
from sqlalchemy import desc
from datetime import date, datetime
from openai import OpenAI
from model.moodtracking.moodtracking_model import moodtracking_model
from model.counsel.openai_finetuning import counsel_model

router = APIRouter(
    tags = ["counsel"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def get_user_kakaotalk(db = db_dependency, user_kakaotalk = str):
    user = db.query(Users).filter(Users.user_kakaotalk == user_kakaotalk).first()
    return user

def get_user_id(db = db_dependency, user_id = int):
    user = db.query(Users).filter(Users.user_id == user_id).first()
    return user

def get_counsel(db = db_dependency, user_kakaotalk = str):
    user = get_user_kakaotalk(db, user_kakaotalk)
    counsel = db.query(Counsels).filter(Users.user_id == user.user_id).order_by(Counsels.counsel_id.desc()).first()
    return counsel

@router.post("/counsel")
def create_chatting(db: db_dependency, user: User):
    try: 
        user = get_user_kakaotalk(db, user.user_kakaotalk)
        new_counsel = Counsels(
            counsel_id = 0,
            user_id = user.user_id
        )
        db.add(new_counsel)
        db.commit()
        return{'detail' : 'success to create counsel'}
    except:
        return{'detail' : 'fail to create counsel'}
    
@router.post("/counsel/chatting")
def create_chatting(db: db_dependency, user: User, chatting: Chatting):
    try: 
        counsel = get_counsel(db, user.user_kakaotalk)
        user = get_user_id(db, counsel.user_id)
        result = counsel_model(chatting.chatting_user)
        new_chatting = Chattings(
            counsel_id =  counsel.counsel_id,
            chatting_user = chatting.chatting_user,
            chatting_computer = result
        )
        db.add(new_chatting)
        db.commit()
        return{'detail' : 'success to create chatting'}
    except Exception as e:
        return{'detail' : f'fail to create chatting{str(e)}'}

'''
@router.post("/counsel/chatting/emotion")
def create_chatting_emotion(db: db_dependency, user: User):
    counsel = get_counsel(db, user.user_kakaotalk)
    first_chatting = db.query(Chattings).filter(Chattings.counsel_id == counsel.counsel_id).one()
    first_chatting.chatting_user
    counsel_emotion = predict(first_chatting.chatting_user)
    print(counsel_emotion)
'''
    
@router.get("/chatting/record/last")
def get_last_chatting(db: db_dependency, user_kakaotalk: str):
    try:
        counsel = get_counsel(db, user_kakaotalk)
        return  db.query(Chattings).filter(Chattings.counsel_id == counsel.counsel_id).order_by(Chattings.chatting_id.desc()).first()
    except:
        return{'detail' : "fail to get last counsel record"}

@router.get("/chatting/record/date")
def get_date_chatting(db: db_dependency, user_kakaotalk: str, counsel_date: str):
    try:
        user = get_user_kakaotalk(db, user_kakaotalk)
        counsels = db.query(Counsels).filter(Counsels.user_id == user.user_id).filter(Counsels.counsel_date == counsel_date).all()
        counsel_ids = [counsel.counsel_id for counsel in counsels]
        chattings = db.query(Chattings).filter(Chattings.counsel_id.in_(counsel_ids)).all()
        return chattings
    except Exception as e:
        return{'detail' : f'fail to get date counsel record {str(e)}'}

@router.get("/chatting/record/{counsel_id}")
def get_chatting(db: db_dependency, counsel_id: int = Path):
    try:
        return  db.query(Chattings).filter(Chattings.counsel_id == counsel_id).all()
    except:
        return{'detail' : "fail to get counsel record"}

