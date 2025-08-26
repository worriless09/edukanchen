const features = [
  {
    icon: "🤖",
    title: "AI-Powered Learning",
    description:
      "Smart algorithms adapt to your learning style and optimize your study schedule for maximum retention.",
  },
  {
    icon: "🧠",
    title: "Spaced Repetition System",
    description: "AI-optimized review schedules ensure maximum retention and long-term memory consolidation.",
  },
  {
    icon: "📚",
    title: "Previous Year Questions",
    description: "Practice with a vast collection of previous year questions to understand exam patterns.",
  },
  {
    icon: "👨‍🏫",
    title: "Expert Faculty",
    description: "Learn from IAS officers and top-ranked professionals with proven track records.",
  },
  {
    icon: "🎥",
    title: "Live Classes",
    description: "Attend live classes conducted by experts to clarify doubts and gain real-time insights.",
  },
  {
    icon: "📝",
    title: "Mock Test Series",
    description: "Take part in comprehensive mock test series to assess your preparation level.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 border-0 py-2.5 lg:px-8 rounded-sm border-none border-white text-white bg-white">
        <div className="text-center mb-2">
          <h2 className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-primary-700 text-3xl font-medium">Why Choose Kanchen Academy?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-normal">
            Experience the future of competitive exam preparation with our AI-powered platform designed specifically for
            UPSC, SSC, and State PCS aspirants.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-0">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl p-10 border text-center hover:shadow-2xl hover:border-primary-500 transition-all duration-300 bg-primary-50"
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 font-normal leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
