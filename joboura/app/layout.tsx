import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Joboura - AI-Powered Job Finder | Find Your Dream Career",
  description:
    "Discover your perfect job match with Joboura's advanced AI technology. Upload your resume and get personalized job recommendations from top companies worldwide.",
  keywords: "job finder, AI jobs, career matching, resume analysis, job search, employment",
  authors: [{ name: "Joboura Team" }],
  creator: "Joboura",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://joboura.com",
    title: "Joboura - AI-Powered Job Finder",
    description: "Find your dream job with AI-powered resume analysis and job matching",
    siteName: "Joboura",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joboura - AI-Powered Job Finder",
    description: "Find your dream job with AI-powered resume analysis and job matching",
    creator: "@joboura",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
