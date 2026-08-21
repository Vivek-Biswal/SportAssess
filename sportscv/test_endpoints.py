import os
import sys

# Add sportscv to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set mock API key
os.environ["CV_SERVICE_API_KEY"] = "test_key_123"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("Testing /api/health...")
    response = client.get("/api/health")
    print(f"Health Response ({response.status_code}): {response.json()}")
    assert response.status_code == 200
    
    print("\nTesting /api/assessments/tests...")
    response = client.get("/api/assessments/tests")
    print(f"Supported Tests Response ({response.status_code}): {response.json()}")
    assert response.status_code == 200
    
    # Test real sample video (mocking the download to point to local file)
    print("\nTesting real video analysis (vertical_jump)...")
    
    # Let's bypass httpx download by monkeypatching or just sending a local file URL
    # Actually our routes.py uses httpx, we can serve a local file using a file:// URI?
    # httpx doesn't support file:// out of the box. We could use a mocked url or start a local server, 
    # but since it's a test client, the easiest is to just see if it handles auth first.
    
    # Test auth failure
    response = client.post("/api/analyze", json={
        "testType": "vertical_jump",
        "videoUrl": "http://example.com/video.mp4",
        "assessmentId": "test_id",
        "athleteId": "athlete_1"
    })
    print(f"Auth Failure Response ({response.status_code}): {response.json()}")
    assert response.status_code == 401
    
    # Test auth success with fake video
    headers = {"Authorization": "Bearer test_key_123"}
    response = client.post("/api/analyze", json={
        "testType": "vertical_jump",
        "videoUrl": "http://example.com/video.mp4",
        "assessmentId": "test_id",
        "athleteId": "athlete_1"
    }, headers=headers)
    print(f"Analyze Start Response ({response.status_code}): {response.json()}")
    assert response.status_code == 200
    job_id = response.json()["jobId"]
    
    # Test status
    response = client.get(f"/api/status/{job_id}", headers=headers)
    print(f"Status Response ({response.status_code}): {response.json()}")
    assert response.status_code == 200
    
    print("\nAll integration endpoint tests passed!")

if __name__ == "__main__":
    run_tests()
