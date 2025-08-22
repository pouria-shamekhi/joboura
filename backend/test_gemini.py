import requests
import json

GEMINI_API_KEY = ""

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

headers = {
    "Content-Type": "application/json"
}

payload = {
    "contents": [
        {
            "parts": [
                {
                    "text": "سلام جمینای! فقط یک جمله ساده جواب بده."
                }
            ]
        }
    ]
}

response = requests.post(
    f"{url}?key={GEMINI_API_KEY}",
    headers=headers,
    json=payload
)

print("Status code:", response.status_code)
try:
    data = response.json()
    print("Response JSON:")
    print(json.dumps(data, ensure_ascii=False, indent=2))
except:
    print("Raw response:")
    print(response.text)
