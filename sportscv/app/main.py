from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router


import os

app = FastAPI(
    title="Sports CV Assessment API",
    description=(
        "Computer vision API for sports "
        "talent assessment."
    ),
    version="0.1.0",
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)


@app.get("/")
def root():
    return {
        "service": (
            "Sports CV Assessment API"
        ),
        "status": "running",
    }