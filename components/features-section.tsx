//# Updated Features Section (With Your Requested Icons)


import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: "🧠", // Your requested icon
    title: "AI-Powered Learning",
    description: "Personalized study paths with adaptive algorithms that adjust to your learning pace and style.",
  },
  {
    icon: "📚", // Your requested icon  
    title: "Spaced Repetition System",
    description: "AI-optimized review schedules ensure maximum retention and long-term memory consolidation.",
  },
  {
    icon: "👨🏫", // Your requested icon
    title: "Expert Faculty", 
    description: "Learn from experienced educators and successful civil servants with proven track records.",
  },
  {
    icon: "🎥", // Your requested icon
    title: "Live Classes",
    description: "Attend live classes conducted by experts to clarify doubts and gain real-time insights.",
  },
  {
    icon: "📝", // Your requested icon
    title: "Mock Test Series",
    description: "Take part in comprehensive mock test series to assess your preparation level.",
  },
  {
    icon: "🏆",
    title: "Proven Results",
    description: "95% success rate with over 1000+ students achieving their civil service dreams.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Kanchen Academy?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the perfect blend of traditional teaching excellence and cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover-lift bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
