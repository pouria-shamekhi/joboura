
import requests
import json

def fetch_jobs(keyword, country_code, max_age_days=15, limit=10, api_key=None):
    url = "https://api.theirstack.com/v1/jobs/search"

    payload = {
        "page": 0,
        "limit": limit,
        "posted_at_max_age_days": max_age_days,
        "blur_company_data": False,
        "order_by": [{"desc": True, "field": "date_posted"}],
        "job_country_code_or": [country_code],
        "job_title_or": [keyword],
        "include_total_results": False
    }

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        jobs = data.get("data", [])
        return jobs
    else:
        raise Exception(f"Error {response.status_code}: {response.text}")

if __name__ == "__main__":
    # خواندن ورودی از فایل JSON
    with open("scrapper_input.json", "r", encoding="utf-8") as f:
        config = json.load(f)

    keyword = config["foreign"]["keyword"]
    country_code = config["foreign"]["country_code"]
    max_age_days = config["foreign"].get("max_age_days", 15)
    limit = config["foreign"].get("limit", 10)
    api_key = config["foreign"]["api_key"]

    jobs = fetch_jobs(keyword, country_code, max_age_days, limit, api_key)

    # ذخیره خروجی
    with open("scrapper_output_foreign.json", "w", encoding="utf-8") as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)
