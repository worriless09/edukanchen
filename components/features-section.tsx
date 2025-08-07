const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Learning',
    description: 'Smart algorithms adapt to your learning style and optimize your study schedule for maximum retention.',
  },
  {
    icon: '🧠',
    title: 'Spaced Repetition',
    description: 'AI-optimized review schedules ensure maximum retention and long-term memory consolidation.',
  },
  {
    icon: '📚',
    title: 'Comprehensive Content',
    description: 'Complete syllabus coverage with updated materials, current affairs, and practice tests.',
  },
  {
    icon: '📊',
    title: 'Smart Analytics',
    description: 'Track your progress with detailed insights and get AI-powered recommendations for improvement.',
  },
  {
    icon: '👨‍🏫',
    title: 'Expert Mentorship',
    description: 'Learn from IAS officers and top-ranked professionals with proven track records.',
  },
  {
    icon: '🎯',
    title: 'Personalized Plans',
    description: 'Custom study schedules based on your strengths, weaknesses, and exam timeline.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-4">
            Why Kanchen Academy Works
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-light">
            Experience the future of competitive exam preparation with our AI-powered platform 
            designed specifically for UPSC, SSC, and State PCS aspirants.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 border border-gray-200 text-center hover:shadow-lg hover:border-primary-300 transition-all duration-200">
              <div className="text-3xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-700 font-light leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
