from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router


app = FastAPI(
    title="Sports CV Assessment API",
    description=(
        "Computer vision API for sports "
        "talent assessment."
    ),
    version="0.1.0",
)


# Development CORS.
#
# Later, we will replace "*" with your
# actual frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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