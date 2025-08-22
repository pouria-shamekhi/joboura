
# 📌 Joboura – Smart Job Finder  

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://www.python.org/)  
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?logo=fastapi)](https://fastapi.tiangolo.com/)  
[![Playwright](https://img.shields.io/badge/Playwright-Scraping-purple?logo=microsoft)](https://playwright.dev/)  
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)](https://reactjs.org/)  
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-black?logo=next.js)](https://nextjs.org/)  
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  

Joboura یک پلتفرم **هوشمند جاب‌فایندر** است که با دریافت رزومه‌ی کاربر، مشاغل متناسب با مهارت‌های او را از منابع داخلی و خارجی جمع‌آوری و نمایش می‌دهد.  

---

## 📑 فهرست مطالب
- [ویژگی‌ها](#-ویژگیها)  
- [معماری](#-معماری-پروژه)  
- [ساختار پوشه‌ها](#-ساختار-کلی-پروژه)  
- [نصب و راه‌اندازی](#️-نصب-و-راهاندازی)  
- [بخش‌های اصلی کد](#-بخشهای-اصلی-کد)  
- [نمونه خروجی](#-نمونه-خروجی)  
- [نقشه راه](#-نقشه-راه-roadmap)  
- [مشارکت](#-مشارکت)  
- [لایسنس](#-لایسنس)  

---

## 🚀 ویژگی‌ها
- 📄 پردازش رزومه و استخراج کلیدواژه‌های شغلی  
- 🌍 جستجوی شغل‌های خارجی از طریق API (مثل LinkedIn)  
- 🇮🇷 اسکرپینگ شغل‌های ایرانی (Jobinja, ای‌استخدام) با Playwright  
- 🗂 نرمال‌سازی داده‌ها و ذخیره در دیتابیس  
- 🎯 نمایش مشاغل مرتبط در قالب استاندارد (عنوان، شرکت، مکان، تاریخ و لینک)  

---

## 🏗 معماری پروژه
```mermaid
flowchart TD
    A[FastAPIApp] -->|process_resume| B[ResumeProcessor]
    A -->|get_jobs| C[ForeignScrapper]
    A -->|get_jobs| D[IranScrapper]
    B --> E[ScrapperInput]
    C --> F[JobResult]
    D --> F
    A --> G[JobResultsDB]
    A --> H[UserKeys]
````

---

## 📂 ساختار کلی پروژه

```
joboura/
│── backend/            # FastAPI backend
│   ├── main.py         # Entry point
│   ├── models.py       # JobResult, UserKeys, ScrapperInput
│   ├── scrappers/      # IranScrapper & ForeignScrapper
│   ├── processor/      # ResumeProcessor
│   └── database.py     # JobResultsDB
│
│── frontend/           # React / Next.js frontend
│   ├── pages/
│   ├── components/
│   └── styles/
│
│── requirements.txt    # Python dependencies
│── package.json        # Frontend dependencies
│── README.md           # Project docs
```

---

## ⚙️ نصب و راه‌اندازی

### 1️⃣ کلون پروژه

```bash
git clone https://github.com/your-username/joboura.git
cd joboura
```

### 2️⃣ نصب بک‌اند (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn main:app --reload
```

بک‌اند روی `http://127.0.0.1:8000` اجرا می‌شود.

### 3️⃣ نصب فرانت‌اند (React/Next.js)

```bash
cd frontend
npm install
npm run dev
```

فرانت‌اند روی `http://localhost:3000` اجرا می‌شود.

---

## 🔍 بخش‌های اصلی کد

### 📄 ResumeProcessor

* پردازش رزومه و استخراج کلیدواژه‌ها
* تولید پیکربندی برای اسکرپرها

### 🌍 ForeignScrapper

* گرفتن شغل‌ها از API خارجی
* نرمال‌سازی داده‌ها به فرمت استاندارد

### 🇮🇷 IranScrapper

* اسکرپینگ Jobinja و ای‌استخدام با Playwright
* پارس DOM برای گرفتن لینک و جزئیات شغل‌ها

### 🗂 JobResultsDB

* ذخیره نتایج در دیتابیس (JSON)

### 🎯 JobResult Model

فرمت استاندارد خروجی:

```json
{
  "title": "Backend Developer",
  "company": "Example Co.",
  "location": "Tehran",
  "date": "2025-08-22",
  "link": "https://jobinja.ir/jobs/12345",
  "source": "Jobinja"
}
```

---

## 📸 دیاگرام

![Joboura Diagram](docs/diagram.png)

---

## 📜 نقشه راه (Roadmap)

* [ ] اضافه کردن سیستم پیشنهاد هوشمند شغل با LLM
* [ ] ذخیره‌سازی تاریخچه جستجو برای کاربر
* [ ] اضافه کردن فیلترهای پیشرفته (حقوق، ریموت، تمام‌وقت/پاره‌وقت)
* [ ] دپلوی روی سرور با Docker

---

## 🤝 مشارکت

1. فورک کنید 🍴
2. Branch جدید بسازید (`git checkout -b feature/my-feature`)
3. تغییرات را کامیت کنید (`git commit -m 'Add new feature'`)
4. پوش کنید (`git push origin feature/my-feature`)
5. Pull Request بسازید 🚀

---

## 📄 لایسنس

این پروژه تحت **MIT License** منتشر شده است.

---

```

---

📌 پوریا، اگه بخوای می‌تونم برات یک **cover image** (کاور گرافیکی برای بالای README) طراحی کنم که ریپوی گیت‌هابت خیلی حرفه‌ای‌تر به نظر بیاد.  
می‌خوای برات یه کاور ساده و شیک هم آماده کنم؟
```
