from pathlib import Path
import shutil
import tempfile

from fastapi import (
    APIRouter,
    File,
    Form,
    HTTPException,
    UploadFile,
)

from app.core.runner import AssessmentRunner


router = APIRouter(
    prefix="/api",
    tags=["Assessments"],
)

runner = AssessmentRunner()


ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".avi",
    ".webm",
    ".mkv",
}


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


@router.post("/assessments")
async def create_assessment(
    test_type: str = Form(...),
    video: UploadFile = File(...),
):
    """
    Run one sports assessment on an uploaded video.
    """

    test_type = (
        test_type
        .lower()
        .strip()
    )

    supported_tests = (
        runner.supported_tests()
    )

    if test_type not in supported_tests:
        raise HTTPException(
            status_code=400,
            detail={
                "message": (
                    f"Unsupported test type: "
                    f"{test_type}"
                ),
                "supported_tests": supported_tests,
            },
        )

    if not video.filename:
        raise HTTPException(
            status_code=400,
            detail="Video filename is missing.",
        )

    extension = (
        Path(video.filename)
        .suffix
        .lower()
    )

    if extension not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail={
                "message": (
                    "Unsupported video format."
                ),
                "allowed_formats": sorted(
                    ALLOWED_VIDEO_EXTENSIONS
                ),
            },
        )

    temporary_file = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension,
        ) as temp_file:

            temporary_file = Path(
                temp_file.name
            )

            shutil.copyfileobj(
                video.file,
                temp_file,
            )

        result = runner.run(
            test_type=test_type,
            video_path=str(
                temporary_file
            ),
        )

        return result.to_dict()

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={
                "message": (
                    "Assessment processing failed."
                ),
                "error": str(exc),
            },
        )

    finally:
        if temporary_file is not None:
            temporary_file.unlink(
                missing_ok=True
            )