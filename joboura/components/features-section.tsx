"use client"

import { Brain, Zap, Shield, Globe, Users, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description:
        "Advanced machine learning algorithms analyze your resume and match you with the most relevant opportunities.",
      color: "from-purple-500 to-indigo-500",
      delay: "0ms",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description:
        "Get personalized job recommendations in seconds, not days. Our AI works 24/7 to find your perfect match.",
      color: "from-orange-500 to-red-500",
      delay: "150ms",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is encrypted and secure. We never share your information without your explicit consent.",
      color: "from-green-500 to-teal-500",
      delay: "300ms",
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description:
        "Access job opportunities from companies worldwide. Remote, hybrid, and on-site positions available.",
      color: "from-blue-500 to-cyan-500",
      delay: "450ms",
    },
    {
      icon: Users,
      title: "Company Insights",
      description:
        "Get detailed information about company culture, benefits, and growth opportunities before you apply.",
      color: "from-pink-500 to-rose-500",
      delay: "600ms",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Track your career progression and get recommendations for skills to develop and roles to pursue.",
      color: "from-yellow-500 to-orange-500",
      delay: "750ms",
    },
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose Joboura?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of job searching with our cutting-edge AI technology and comprehensive career platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 group hover:scale-105 hover:shadow-2xl"
              style={{ animationDelay: feature.delay }}
            >
              <div className="relative mb-6">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div
                  className={`absolute inset-0 w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} blur opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
                ></div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
