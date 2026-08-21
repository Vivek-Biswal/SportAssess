import requests
import time
import os
import uuid

BASE_URL = "http://localhost:5000/api"

def create_user():
    email = f"test_{uuid.uuid4()}@example.com"
    payload = {
        "name": "E2E Athlete",
        "email": email,
        "password": "password123",
        "age": 20,
        "gender": "Male",
        "state": "Maharashtra",
        "district": "Mumbai",
        "role": "athlete"
    }
    print(f"Registering new user {email}...")
    res = requests.post(f"{BASE_URL}/auth/register", json=payload)
    if res.status_code != 201:
        print("Registration failed:", res.json())
        return None
    return res.json()["data"]["token"]

def upload_video(token, test_id):
    # Create a dummy video file
    with open("dummy.mp4", "wb") as f:
        f.write(b"dummy_video_data")
        
    print(f"Uploading video for test {test_id}...")
    headers = {"Authorization": f"Bearer {token}"}
    with open("dummy.mp4", "rb") as f:
        files = {"video": ("dummy.mp4", f, "video/mp4")}
        data = {"testId": test_id}
        res = requests.post(f"{BASE_URL}/videos/upload", headers=headers, files=files, data=data)
        
    if res.status_code != 202:
        print("Upload failed:", res.json())
        return None
    return res.json()["data"]["processId"]

def poll_status(token, process_id):
    headers = {"Authorization": f"Bearer {token}"}
    for i in range(30):
        res = requests.get(f"{BASE_URL}/ai/process/{process_id}", headers=headers)
        if res.status_code != 200:
            print("Status check failed:", res.json())
            return None
            
        status = res.json()["data"]["status"]
        print(f"Status check {i+1}: {status}")
        
        if status == "completed":
            return res.json()["data"].get("resultId")
        elif status == "failed":
            print("CV Analysis failed!")
            return None
            
        time.sleep(3)
    print("Timed out polling.")
    return None

def get_result(token, result_id):
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(f"{BASE_URL}/results/{result_id}", headers=headers)
    if res.status_code != 200:
        print("Failed to get result:", res.json())
        return None
    return res.json()["data"]

def main():
    print("--- Starting End-to-End Test ---")
    
    # Verify Node backend is up
    try:
        requests.get(f"{BASE_URL}/assessments")
    except requests.exceptions.ConnectionError:
        print("Node backend is not running on port 5000!")
        return

    token = create_user()
    if not token:
        return

    # testIds are typically 't1' for Vertical Jump, 't2' for Situps, 't3' for Pushups (based on backend mock data or seed script)
    # Let's verify test IDs
    headers = {"Authorization": f"Bearer {token}"}
    tests_res_raw = requests.get(f"{BASE_URL}/assessments", headers=headers)
    tests_res = tests_res_raw.json().get("data", [])
    test_ids = [t["id"] for t in tests_res if t.get("aiVerificationAvailable", False)]
    print(f"Available tests: {test_ids}")

    results = {}
    for test_id in test_ids:
        print(f"\n--- Testing {test_id} ---")
        process_id = upload_video(token, test_id)
        if not process_id:
            results[test_id] = "FAILED - Upload"
            continue
            
        print(f"Process ID: {process_id}")
        result_id = poll_status(token, process_id)
        if not result_id:
            results[test_id] = "FAILED - Polling or CV Error"
            continue
            
        print(f"Result ID: {result_id}")
        result_data = get_result(token, result_id)
        
        print("FINAL RESULT DATA:")
        print(f"  Score: {result_data.get('score')} {result_data.get('unit')}")
        print(f"  AI Confidence: {result_data.get('aiConfidence')}%")
        print(f"  Cheat Detected: {result_data.get('cheatDetected')}")
        print(f"  Verification Status: {result_data.get('verificationStatus')}")
        results[test_id] = "PASSED"
        
    print("\n--- E2E Summary ---")
    for tid, status in results.items():
        print(f"{tid}: {status}")

if __name__ == "__main__":
    main()
