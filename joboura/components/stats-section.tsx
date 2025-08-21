"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, Briefcase, Target } from "lucide-react"

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { icon: Users, value: "50K+", label: "Active Job Seekers", color: "from-blue-400 to-cyan-400" },
    { icon: Briefcase, value: "15K+", label: "Job Opportunities", color: "from-green-400 to-emerald-400" },
    { icon: Target, value: "95%", label: "Match Accuracy", color: "from-orange-400 to-red-400" },
    { icon: TrendingUp, value: "2.5x", label: "Faster Hiring", color: "from-purple-400 to-pink-400" },
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Trusted by Professionals Worldwide</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our AI-powered platform has helped thousands of job seekers find their perfect career match
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transform transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative mb-6">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${stat.color} p-4 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div
                  className={`absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${stat.color} blur opacity-50`}
                ></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
