'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Star } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'UPSC CSE Complete Course',
    category: 'UPSC',
    duration: '12 months',
    students: 15000,
    rating: 4.9,
    price: 25000,
    originalPrice: 35000,
    features: ['Live Classes', 'AI Flashcards', 'Mock Tests', 'Current Affairs'],
    batch: 'Morning & Evening',
    level: 'Beginner to Advanced'
  },
  {
    id: 2,
    title: 'SSC CGL Comprehensive',
    category: 'SSC',
    duration: '8 months',
    students: 12000,
    rating: 4.8,
    price: 15000,
    originalPrice: 20000,
    features: ['Video Lectures', 'Practice Tests', 'Doubt Clearing', 'Study Material'],
    batch: 'Weekend',
    level: 'Intermediate'
  },
  {
    id: 3,
    title: 'State PCS Foundation',
    category: 'State PCS',
    duration: '10 months',
    students: 8000,
    rating: 4.7,
    price: 18000,
    originalPrice: 25000,
    features: ['State-specific Content', 'Regional Language Support', 'Mock Interviews'],
    batch: 'Evening',
    level: 'Beginner'
  },
]

const categories = ['All', 'UPSC', 'SSC', 'State PCS']

export function CoursesSection() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory)

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-4">
            Our Popular Courses
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-light">
            Choose from our comprehensive range of courses designed by experts and powered by AI technology.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2 bg-white rounded-lg p-2 border border-gray-200">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-primary-100 text-primary-800 font-medium">{course.category}</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">{course.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {course.duration} • {course.batch}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {course.students.toLocaleString()} students enrolled
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {course.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-medium text-gray-900">₹{course.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">₹{course.originalPrice.toLocaleString()}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 font-medium">
                    {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                  </Badge>
                </div>

                <Button className="w-full hover:bg-primary-500 text-white font-medium bg-primary-500">
                  Enroll Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  )
}
