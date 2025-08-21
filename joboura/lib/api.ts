// joboura-main/lib/api.ts
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

export type JobCard = {
  title: string;
  company?: string;
  location?: string;
  date?: string;
  link?: string;
  source?: "iran" | "foreign" | string;
};

export async function processResume(resume_text: string) {
  const res = await fetch(`${API_BASE}/process-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text }),
  });
  if (!res.ok) throw new Error(await safeText(res));
  return (await res.json()) as { message: string };
}

export async function getJobs(source?: "iran" | "foreign"): Promise<JobCard[]> {
  const url = source ? `${API_BASE}/jobs?source=${source}` : `${API_BASE}/jobs`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await safeText(res));
  const data = await res.json();

  // بک‌اندت ممکنه آرایه‌ای از رکوردها بده که هر کدوم result_json داره.
  // اینجا فلت و نرمال می‌کنیم تا کارت‌ها یک‌شکل بشن.
  const items: any[] = [];
  for (const rec of Array.isArray(data) ? data : []) {
    const raw = rec?.result_json ?? rec?.results ?? rec; // اگر مستقیماً لیست جاب‌ها باشه
    if (Array.isArray(raw)) {
      items.push(...raw.map((j) => ({ ...j, _source: rec?.source ?? source })));
    } else if (raw && typeof raw === "object") {
      items.push({ ...raw, _source: rec?.source ?? source });
    }
  }

  return items.map(normalizeJob);
}

function normalizeJob(job: any): JobCard {
  const title =
    job.title || job.job_title || job.position || job.role || "بدون عنوان";
  const company =
    job.company || job.company_name || job.employer || job.org || "";
  const location =
    job.location ||
    [job.city, job.country_code || job.country].filter(Boolean).join(", ");
  const date =
    job.date || job.date_posted || job.posted_at || job.created_at || "";
  const link =
    job.link ||
    job.url ||
    job.job_url ||
    job.apply_url ||
    job.redirect_url ||
    "";

  return {
    title,
    company,
    location,
    date,
    link,
    source: job._source || job.source || "",
  };
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "Request failed";
  }
}
