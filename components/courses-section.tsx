"use client"

import { Button } from "@/components/ui/button"
import { Clock, Users, Star } from "lucide-react"
import { useState } from "react"

const courses = [
  {
    id: "upsc",
    category: "UPSC",
    title: "UPSC CSE Complete Course",
    duration: "12 months",
    schedule: "Morning & Evening",
    students: "15,000",
    rating: 4.9,
    price: "₹25,000",
    originalPrice: "₹35,000",
    discount: "29% OFF",
    features: ["Live Classes", "AI Flashcards", "Mock Tests", "Current Affairs"],
    theme: "blue",
    topBorder: "bg-gradient-to-r from-blue-500 to-purple-600",
  },
  {
    id: "ssc",
    category: "SSC",
    title: "SSC CGL Comprehensive",
    duration: "8 months",
    schedule: "Weekend",
    students: "12,000",
    rating: 4.8,
    price: "₹15,000",
    originalPrice: "₹20,000",
    discount: "25% OFF",
    features: ["Video Lectures", "Practice Tests", "Doubt Clearing", "Study Material"],
    theme: "green",
    topBorder: "bg-gradient-to-r from-green-500 to-teal-600",
  },
  {
    id: "state-pcs",
    category: "State PCS",
    title: "State PCS Foundation",
    duration: "10 months",
    schedule: "Evening",
    students: "8,000",
    rating: 4.7,
    price: "₹18,000",
    originalPrice: "₹25,000",
    discount: "28% OFF",
    features: ["State-specific Content", "Regional Language Support", "Mock Interviews"],
    theme: "orange",
    topBorder: "bg-gradient-to-r from-orange-500 to-red-600",
  },
]

const categories = ["All", "UPSC", "SSC", "State PCS"]

export function CoursesSection() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredCourses =
    activeCategory === "All" ? courses : courses.filter((course) => course.category === activeCategory)

  const getButtonTheme = (theme: string) => {
    switch (theme) {
      case "blue":
        return "bg-blue-600 hover:bg-blue-700"
      case "green":
        return "bg-green-600 hover:bg-green-700"
      case "orange":
        return "bg-orange-600 hover:bg-orange-700"
      default:
        return "bg-gray-600 hover:bg-gray-700"
    }
  }

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Title and Subtitle */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-1">
            Our Premium <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-0 py-0">Courses</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed py-0">
            Comprehensive preparation programs designed for success with expert guidance and cutting-edge technology.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 rounded-full p-1 flex space-x-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Colored Top Border */}
              <div className={`h-1 ${course.topBorder}`}></div>

              <div className="p-6 text-center">
                {/* Course Badge and Rating */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.theme === "blue"
                        ? "bg-blue-100 text-blue-800"
                        : course.theme === "green"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {course.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>

                {/* Course Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">{course.title}</h3>

                {/* Course Info */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      {course.duration} • {course.schedule}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{course.students} students enrolled</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">{course.originalPrice}</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    {course.discount}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl text-center mx-16"
                  >
  Enroll Now →
</Button>

<button className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium">
  Learn More
</button>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Courses Button */}
        <div className="flex justify-center mt-12">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium">
            View All Courses →
          </Button>
        </div>
      </div>
    </section>
  )
}
