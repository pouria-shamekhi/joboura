

from playwright.sync_api import sync_playwright
import urllib.parse
import json

def construct_search_url(keyword, cities=None, job_type=None):
    base_url = "https://www.e-estekhdam.com/search/استخدام"
    url_parts = []

    if cities:
        cities_str = "--".join(cities)
        url_parts.append(f"در-{cities_str}")

    if job_type:
        url_parts.append(f"بصورت-{job_type}")

    url_parts.append(f"برای-{keyword}")
    url = base_url + "-" + "-".join(url_parts)
    return urllib.parse.quote(url, safe=':/?=&-')

def scrape_page_with_playwright(page_url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(page_url)
        page.wait_for_selector("a.item-content.media.display-block", timeout=10000)

        job_links = page.query_selector_all("a.item-content.media.display-block")
        base_url = "https://www.e-estekhdam.com"

        results = []
        for job_link in job_links:
            href = job_link.get_attribute("href") or ""
            full_link = href if href.startswith("http") else base_url + href

            title_span = job_link.query_selector("div.title span")
            job_name = title_span.inner_text() if title_span else "نام شغل موجود نیست"

            province_div = job_link.query_selector("div.provinces")
            city = province_div.inner_text() if province_div else "شهر موجود نیست"

            results.append({
                "title": job_name,
                "url": full_link,
                "city": city
            })

        browser.close()
        return results

if __name__ == "__main__":
    with open("scrapper_input.json", "r", encoding="utf-8") as f:
        config = json.load(f)

    keyword = config["iran"]["keyword"]
    cities = config["iran"].get("cities", None)
    job_type = config["iran"].get("job_type", None)

    search_url = construct_search_url(keyword, cities, job_type)
    jobs = scrape_page_with_playwright(search_url)

    with open("scrapper_output_ir.json", "w", encoding="utf-8") as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)
