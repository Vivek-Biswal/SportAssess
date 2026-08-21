import uuid
import httpx
import tempfile
from pathlib import Path
from urllib.parse import urlparse

from fastapi import (
    APIRouter,
    HTTPException,
    BackgroundTasks,
    Depends
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

from app.core.runner import AssessmentRunner
from app.core import jobs

router = APIRouter(
    prefix="/api",
    tags=["Assessments"],
)

runner = AssessmentRunner()

security = HTTPBearer()

def verify_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    import os
    expected_key = os.getenv("CV_SERVICE_API_KEY")
    if expected_key and credentials.credentials != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return credentials.credentials

ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".avi",
    ".webm",
    ".mkv",
}

class AssessmentRequest(BaseModel):
    testType: str
    videoUrl: str
    assessmentId: str
    athleteId: str

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "sports-cv",
    }

@router.get("/assessments/tests")
def get_supported_tests():
    return {
        "tests": runner.supported_tests()
    }

@router.get("/status/{job_id}")
def get_job_status(job_id: str, api_key: str = Depends(verify_api_key)):
    job = jobs.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if job["status"] == "processing":
        return {"processing_status": "processing"}
    elif job["status"] == "failed":
        return {"processing_status": "failed"}
    elif job["status"] == "success":
        raw = job["result"]
        # Map internal result fields to the contract expected by the Node backend
        mapped = {
            "processing_status": "success",
            "test": raw.get("test_type", ""),
            "score": raw.get("score") if raw.get("score") is not None else 0,
            "unit": raw.get("unit", ""),
            "confidence": raw.get("confidence", 0),
            "verification_status": "verified" if raw.get("valid") else "manual_review",
            "cheat_detected": not raw.get("valid", True),
            "cheat_score": 0 if raw.get("valid", True) else 0.5,
            "duration": raw.get("metrics", {}).get("duration", None),
            "reps": raw.get("metrics", {}).get("reps", None),
            "benchmark": None,
            "percentile": None,
        }
        return mapped
    else:
        return {"processing_status": job["status"]}

MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024 # 100MB

def process_video_task(job_id: str, test_type: str, video_url: str):
    logger.info(f"Starting background task for job {job_id}, test: {test_type}")
    temporary_file = None
    try:
        # Determine extension from url
        parsed_url = urlparse(video_url)
        path = parsed_url.path
        extension = Path(path).suffix.lower()
        if not extension or extension not in ALLOWED_VIDEO_EXTENSIONS:
            extension = ".mp4"

        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
            temporary_file = Path(temp_file.name)
            
            if "mock-storage.example.com" in video_url:
                logger.info(f"Mock storage URL detected ({video_url}). Generating dummy video...")
                temp_file.close() # Close it so cv2 can write to it
                import cv2
                import numpy as np
                out = cv2.VideoWriter(str(temporary_file), cv2.VideoWriter_fourcc(*'mp4v'), 30, (640, 480))
                for i in range(30):
                    frame = np.zeros((480, 640, 3), dtype=np.uint8)
                    out.write(frame)
                out.release()
            else:
                with httpx.Client() as client:
                    with client.stream("GET", video_url) as response:
                        if response.status_code != 200:
                            raise Exception(f"Failed to download video: HTTP {response.status_code}")
                        
                        content_length = response.headers.get("Content-Length")
                        if content_length and int(content_length) > MAX_VIDEO_SIZE_BYTES:
                            raise Exception("Video exceeds maximum allowed size")
                            
                        downloaded_size = 0
                        for chunk in response.iter_bytes():
                            downloaded_size += len(chunk)
                            if downloaded_size > MAX_VIDEO_SIZE_BYTES:
                                raise Exception("Video exceeds maximum allowed size during download")
                            temp_file.write(chunk)
                        
        logger.info(f"Video downloaded for job {job_id}, starting CV analysis...")

        result = runner.run(
            test_type=test_type,
            video_path=str(temporary_file),
        )

        logger.info(f"Job {job_id} completed successfully")
        jobs.update_job(job_id, "success", result.to_dict())

    except Exception as exc:
        logger.error(f"Job {job_id} failed: {exc}")
        jobs.update_job(job_id, "failed")
    finally:
        if temporary_file is not None:
            try:
                temporary_file.unlink(missing_ok=True)
            except Exception as e:
                logger.error(f"Failed to clean up temp file {temporary_file}: {e}")


@router.post("/analyze")
async def create_assessment(
    request: AssessmentRequest,
    background_tasks: BackgroundTasks,
    api_key: str = Depends(verify_api_key)
):
    """
    Run an asynchronous sports assessment on a video URL.
    """
    test_type = request.testType.lower().strip().replace(" ", "_")
    
    # Apply the same slug mapping as runner.py
    slug_map = {
        "sit-ups_(1_min)": "situps",
        "push-ups": "pushups",
    }
    test_type = slug_map.get(test_type, test_type)
    
    supported_tests = runner.supported_tests()

    if test_type not in supported_tests:
        raise HTTPException(
            status_code=400,
            detail={
                "message": f"Unsupported test type: {test_type}",
                "supported_tests": supported_tests,
            },
        )

    job_id = f"cv_job_{uuid.uuid4().hex}"
    
    try:
        jobs.create_job(job_id)
        background_tasks.add_task(process_video_task, job_id, test_type, request.videoUrl)
        logger.info(f"Created job {job_id} for assessment {request.assessmentId}")
    except Exception as exc:
        logger.error(f"Failed to create job: {exc}")
        raise HTTPException(status_code=500, detail="Failed to initialize processing job")

    return {"jobId": job_id}