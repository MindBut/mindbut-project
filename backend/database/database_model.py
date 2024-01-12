from database.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float, DateTime
from sqlalchemy.sql import func
from datetime import datetime, date
from pydantic import BaseModel

class Users(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key= True, index = True)
    user_kakaotalk = Column(String)
    user_name = Column(String)
    bot_name = Column(String)
    survey_question_one = Column(String)
    survey_question_two = Column(String)
    survey_question_three = Column(String)
    survey_question_four = Column(String)
    survey_question_five = Column(String)

class Moodtrackings(Base):
    __tablename__ = "moodtrackings"

    moodtracking_id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    moodtracking_date = Column(Date, default=datetime.now().date())
    message_prompt = Column(String)
    message_first = Column(String)
    message_second = Column(String)
    message_first_answer = Column(String)
    message_second_answer = Column(String)
    message_model = Column(String)
    emotion_reason = Column(String)
    emotion_one = Column(String)
    emotion_two = Column(String)
    emotion_intensity = Column(Float, default = 0.0) 

class Counsels(Base):
    __tablename__ = "counsels"

    counsel_id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    counsel_date = Column(Date, default=datetime.now().date())
    counsel_emotion = Column(String)

class Chattings(Base):
    __tablename__ = "chattings"

    chatting_id = Column(Integer, primary_key = True, index = True)
    counsel_id = Column(Integer, ForeignKey("counsels.counsel_id"))
    chatting_datetime = Column(DateTime, default=datetime.now())
    chatting_user = Column(String)
    chatting_computer = Column(String)

class User(BaseModel):
    
    user_id: int
    user_kakaotalk: str
    user_name: str
    bot_name: str
    survey_question_one: str 
    survey_question_two: str
    survey_question_three: str 
    survey_question_four: str
    survey_question_five: str 

class Moodtracking(BaseModel):

    moodtracking_id: int
    user_id: int
    moodtracking_date: date
    message_prompt: str
    message_first: str
    message_second: str
    message_first_answer: str
    message_second_answer: str
    message_model: str 
    emotion_reason: str 
    emotion_one: str 
    emotion_two: str 
    emotion_intensity: float   

class Counsel(BaseModel):

    counsel_id: int
    user_id: int
    counsel_date: date
    counsel_emotion: str

class Chatting(BaseModel):

    chatting_id: int
    counsel_id: int
    chatting_datetime: datetime
    chatting_user: str
    chatting_computer: str