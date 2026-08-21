import sqlite3
import json
from pathlib import Path
from typing import Optional, Dict, Any

# Use a local sqlite file in the app directory
DB_PATH = Path(__file__).parent.parent.parent / "jobs.db"

def _get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = _get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            job_id TEXT PRIMARY KEY,
            status TEXT NOT NULL,
            result TEXT
        )
    """)
    conn.commit()
    conn.close()

def create_job(job_id: str):
    conn = _get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO jobs (job_id, status) VALUES (?, ?)",
        (job_id, "processing")
    )
    conn.commit()
    conn.close()

def update_job(job_id: str, status: str, result: Optional[Dict[str, Any]] = None):
    conn = _get_db()
    cursor = conn.cursor()
    result_str = json.dumps(result) if result else None
    cursor.execute(
        "UPDATE jobs SET status = ?, result = ? WHERE job_id = ?",
        (status, result_str, job_id)
    )
    conn.commit()
    conn.close()

def get_job(job_id: str) -> Optional[Dict[str, Any]]:
    conn = _get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jobs WHERE job_id = ?", (job_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
        
    return {
        "job_id": row["job_id"],
        "status": row["status"],
        "result": json.loads(row["result"]) if row["result"] else None
    }

# Initialize on import
init_db()
