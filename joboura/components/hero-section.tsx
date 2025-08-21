"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Upload,
  Sparkles,
  ArrowRight,
  FileText,
  Zap,
} from "lucide-react";

/** ---------------- Backend wiring (in-file) ---------------- */
type Region = "iran" | "foreign";
// type JobCard = {
//   title: string;
//   company?: string;
//   location?: string;
//   date?: string;
//   link?: string;
//   source?: Region | string;
// };

interface JobCardIr {
  title: string; // Job title
  url: string; // Link to the job posting
  city: string; // City or location of the job
}

interface JobCardFo {
  job_title: string;
  url: string;
  date_posted: string;
  location: string;
  country: string;
  seniority: string;
  employment_statuses: string;
  technology_slugs: string[];
  company_object: {
    name: string;
    url: string;
  };
}

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000") as string;

async function apiProcessResume(resume_text: string) {
  const res = await fetch(`${API_BASE}/process-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Request failed"));
  return res.json();
}

async function apiGetJobsIr(): Promise<JobCardIr[]> {
  const url = `${API_BASE}/jobs?source=iran`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text().catch(() => "Request failed"));
  const rawData = await res.json();
  return rawData.result_json;
}

async function apiGetJobsFo(): Promise<JobCardFo[]> {
  const url = `${API_BASE}/jobs?source=foreign`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text().catch(() => "Request failed"));
  const rawData = await res.json();
  return rawData.result_json;
}

// function normalizeJob(job: any): JobCard {
//   const title =
//     job.title || job.job_title || job.position || job.role || "بدون عنوان";
//   const company =
//     job.company || job.company_name || job.employer || job.org || "";
//   const location =
//     job.location ||
//     [job.city, job.country_code || job.country].filter(Boolean).join(", ");
//   const date =
//     job.date || job.date_posted || job.posted_at || job.created_at || "";
//   const link =
//     job.link ||
//     job.url ||
//     job.job_url ||
//     job.apply_url ||
//     job.redirect_url ||
//     "";
//   return {
//     title,
//     company,
//     location,
//     date,
//     link,
//     source: job._source || job.source || "",
//   };
// }
/** ---------------------------------------------------------- */

export default function HeroSection() {
  const [resume, setResume] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ✅ نتایج
  const [jobsIran, setJobsIran] = useState<JobCardIr[]>([]);
  const [jobsForeign, setJobsForeign] = useState<JobCardFo[]>([]);

  const { toast } = useToast();

  const handleAnalyzeResume = async () => {
    if (!resume.trim()) {
      toast({
        title: "Resume Required",
        description: "Please paste your resume text to get started.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // ۱) پردازش رزومه در بک‌اند (Gemini + آماده‌سازی ورودی اسکرپرها)
      await apiProcessResume(resume);

      // ۲) دریافت آگهی‌ها (ایران و خارجی)
      const [ir, fo] = await Promise.all([apiGetJobsIr(), apiGetJobsFo()]);

      setJobsIran(ir);
      setJobsForeign(fo);

      toast({
        title: "✨ Resume Analyzed Successfully!",
        description: "Relevant job postings are ready.",
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResume(e.target?.result as string);
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Content (بدون تغییر UI) */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-orange-500/20">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">
              AI-Powered Job Matching
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Find Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Dream Job
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            Upload your resume and let our advanced AI find the perfect job
            matches tailored to your skills and experience.
          </p>

          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who found their dream careers with
            Joboura's intelligent job matching system.
          </p>
        </div>

        {/* Resume Upload Section (بدون تغییر ظاهری) */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 mb-16 shadow-2xl">
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 mb-4">
                <FileText className="w-6 h-6 text-orange-400" />
                <h3 className="text-2xl font-semibold text-white">
                  Upload Your Resume
                </h3>
              </div>
              <p className="text-gray-400">
                Paste your resume text or drag and drop a file
              </p>
            </div>

            <div
              className={`relative transition-all duration-300 ${
                dragActive ? "scale-105" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Textarea
                placeholder={`Paste your resume here or drag and drop a text file...

Include your:
• Work experience and achievements
• Skills and technologies
• Education and certifications
• Projects and accomplishments

The more details you provide, the better our AI can match you with relevant opportunities!`}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className={`min-h[300px] min-h-[300px] bg-black/20 border-2 transition-all duration-300 text-white placeholder-gray-400 resize-none text-lg leading-relaxed ${
                  dragActive
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-white/20 hover:border-white/30 focus:border-orange-500"
                }`}
              />

              {dragActive && (
                <div className="absolute inset-0 bg-orange-500/10 border-2 border-orange-500 border-dashed rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                    <p className="text-orange-300 font-medium">
                      Drop your resume file here
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAnalyzeResume}
                disabled={isAnalyzing || !resume.trim()}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing Your Resume...</span>
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Search className="w-5 h-5" />
                    <span>Find My Perfect Jobs</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>

              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 py-4 px-8 bg-transparent"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload File
              </Button>
            </div>

            {resume.trim() && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm font-medium">
                    Resume loaded • {resume.length} characters • Ready for
                    analysis
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* ✅ نتایج مشاغل؛ هماهنگ با استایل فعلی */}
        {(jobsIran.length > 0 || jobsForeign.length > 0) && (
          <div className="mt-10 space-y-10">
            {jobsIran.length > 0 && (
              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  فرصت‌های ایران
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobsIran.map((job, idx) => (
                    <Card
                      key={`ir-${idx}`}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 hover:border-orange-500/40 transition"
                    >
                      <div className="space-y-2">
                        <h4 className="text-white font-bold line-clamp-2">
                          {job.title}
                        </h4>
                        <p className="text-gray-400 text-sm">{job.city}</p>
                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:underline text-sm inline-block mt-1"
                          >
                            مشاهده آگهی
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {jobsForeign.length > 0 && (
              <section>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  فرصت‌های بین‌المللی
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobsForeign.map((job, idx) => (
                    <Card
                      key={`fo-${idx}`}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 hover:border-orange-500/40 transition"
                    >
                      <div className="space-y-2">
                        <h4 className="text-white font-bold line-clamp-2">
                          {job.job_title}
                        </h4>
                        {job.company_object.name && (
                          <p className="text-gray-300 text-sm">
                            {job.company_object.name}
                          </p>
                        )}

                        {job.location && (
                          <p className="text-gray-400 text-sm">
                            {job.location}
                          </p>
                        )}
                        {job.date_posted && (
                          <p className="text-gray-500 text-xs">
                            {job.date_posted}
                          </p>
                        )}
                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:underline text-sm inline-block mt-1"
                          >
                            مشاهده آگهی
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
