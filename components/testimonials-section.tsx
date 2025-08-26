import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    achievement: 'IAS Rank 45, 2023',
    image: '/placeholder.svg?height=80&width=80&text=Priya',
    content: 'Kanchen Academy\'s AI flashcards were a game-changer for my preparation. The spaced repetition helped me retain vast amounts of information effortlessly.',
    rating: 5
  },
  {
    name: 'Rahul Kumar',
    achievement: 'SSC CGL Selected, 2023',
    image: '/placeholder.svg?height=80&width=80&text=Rahul',
    content: 'The comprehensive course structure and expert faculty guidance helped me crack SSC CGL in my first attempt. Highly recommended!',
    rating: 5
  },
  {
    name: 'Anjali Patel',
    achievement: 'GPSC Class 1, 2023',
    image: '/placeholder.svg?height=80&width=80&text=Anjali',
    content: 'The personalized study plans and regular mock tests kept me on track throughout my preparation journey. Thank you Kanchen Academy!',
    rating: 5
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our successful students who achieved their dreams with Kanchen Academy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <Quote className="h-8 w-8 text-primary-300 mb-4" />
              
              <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-primary-600">{testimonial.achievement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
