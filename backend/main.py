from fastapi import FastAPI
from router import moodtracker, user, counsel

app = FastAPI()

app.include_router(user.router)
app.include_router(moodtracker.router)
app.include_router(counsel.router)
