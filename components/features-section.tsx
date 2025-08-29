import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Learning",
    description: "Personalized study paths with adaptive algorithms that adjust to your learning pace and style.",
  },
  {
    icon: "🧠",
    title: "Spaced Repetition System",
    description: "AI-optimized review schedules ensure maximum retention and long-term memory consolidation.",
  },
  {
    icon: "👨‍🏫",
    title: "Expert Faculty",
    description: "Learn from experienced educators and successful civil servants with proven track records.",
  },
  {
    icon: "🏆",
    title: "Proven Results",
    description: "95% success rate with over 1000+ students achieving their civil service dreams.",
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
    <section id="features" className="py-20 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Kanchen Academy?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the perfect blend of traditional teaching excellence and cutting-edge AI technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 backdrop-blur-sm bg-blue-100 rounded-4xl"
            >
              <CardContent className="p-8 text-center bg-blue-100">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
