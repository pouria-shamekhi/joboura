import requests
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import json
import subprocess
from pydantic import BaseModel
from database import SessionLocal, engine
import models
import os
from fastapi.middleware.cors import CORSMiddleware


class KeysInput(BaseModel):
    gemini_key: str
    foreign_api_key: str


class ResumeInput(BaseModel):
    resume_text: str


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/set-keys")
def set_keys(keys: KeysInput, db: Session = Depends(get_db)):
    keys_db = models.UserKeys(
        gemini_key=keys.gemini_key, foreign_api_key=keys.foreign_api_key
    )
    db.add(keys_db)
    db.commit()
    return {"message": "Keys saved successfully"}


@app.post("/process-resume")
def process_resume(resume: ResumeInput, db: Session = Depends(get_db)):
    keys = db.query(models.UserKeys).order_by(models.UserKeys.id.desc()).first()
    if not keys:
        return {"error": "API keys not set"}

    gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"""
تحلیل کن متن زیر رو:
{resume.resume_text}

خروجی را دقیقا به صورت JSON معتبر بده با این ساختار:
{{
  "foreign": {{
    "keyword": "...",
    "country_code": "...",
    "max_age_days": 15,
    "limit": 10
  }},
  "iran": {{
    "keyword": "...",
    "cities": ["شهر۱", "شهر۲"],
    "job_type": "..."
  }}
}}
هیچ توضیح یا متن اضافه نده. فقط JSON معتبر بده.
"""
                    }
                ]
            }
        ]
    }

    response = requests.post(
        f"{gemini_url}?key={keys.gemini_key}", headers=headers, json=payload
    )

    if response.status_code != 200:
        return {"error": f"Gemini API error: {response.text}"}

    gemini_data = response.json()

    try:
        gemini_text = gemini_data["candidates"][0]["content"]["parts"][0]["text"]
        print("Gemini raw text:", gemini_text)

        if gemini_text.startswith("```"):
            gemini_text = gemini_text.strip("`\n ")
            if gemini_text.lower().startswith("json"):
                gemini_text = gemini_text[4:].strip()

        gemini_output = json.loads(gemini_text)
    except Exception as e:
        return {
            "error": f"Invalid JSON from Gemini: {e}",
            "raw_text": gemini_text if "gemini_text" in locals() else None,
            "raw_response": gemini_data,
        }

    if (
        not gemini_output
        or "foreign" not in gemini_output
        or "iran" not in gemini_output
    ):
        return {
            "error": "Gemini output missing required fields",
            "raw_output": gemini_output,
        }

    gemini_output["foreign"]["api_key"] = keys.foreign_api_key

    with open("scrapper_input.json", "w", encoding="utf-8") as f:
        json.dump(gemini_output, f, ensure_ascii=False, indent=2)

    subprocess.run(["python", "foreign_scrapper.py"])
    subprocess.run(["python", "ir_scrapper.py"])

    db.query(models.JobResult).filter(models.JobResult.source == "foreign").delete()
    db.query(models.JobResult).filter(models.JobResult.source == "iran").delete()
    db.commit()

    with open("scrapper_output_foreign.json", "r", encoding="utf-8") as f:
        foreign_data = f.read()
    db.add(models.JobResult(source="foreign", result_json=foreign_data))

    with open("scrapper_output_ir.json", "r", encoding="utf-8") as f:
        iran_data = f.read()
    db.add(models.JobResult(source="iran", result_json=iran_data))

    db.commit()
    return {"message": "Resume processed, jobs fetched"}


@app.get("/jobs")
def get_jobs(source: str = None, db: Session = Depends(get_db)):
    query = db.query(models.JobResult)
    if source:
        query = query.filter(models.JobResult.source == source)
    results = query.all()[0]
    return {
        "id": results.id,
        "source": results.source,
        "created_at": results.created_at,
        "result_json": json.loads(results.result_json),
    }
