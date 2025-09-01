"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Menu, X, ChevronDown, ChevronRight, ArrowRight, Play, Phone, Mail, 
  Users, Trophy, BookOpen, Star, Clock, Award, MapPin, 
  Brain, FileText, ClipboardList, HelpCircle, Home, TrendingUp, Calendar,
  CheckCircle, Crown, Quote, Facebook, Twitter, Instagram, Youtube,
  AlertTriangle, RefreshCw
} from "lucide-react"
import Link from "next/link"
import { useRef } from "react"


// Profile Dropdown Component
function ProfileDropdown() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: { target: unknown }) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={profileDropdownRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        <span className="text-white text-sm font-medium">👤</span>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            onClick={() => setIsProfileOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            onClick={() => setIsProfileOpen(false)}
          >
            Settings
          </Link>
          <hr className="my-2 border-gray-200" />
          <button
            className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            onClick={() => {
              setIsProfileOpen(false);
              // Add your logout logic here
              console.log('User signed out');
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// Header Component
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [studyDropdownOpen, setStudyDropdownOpen] = useState(false)

    function setIsProfileOpen(arg0: boolean): void {
        throw new Error("Function not implemented.")
    }

    function handleClickOutside(this: Document, ev: MouseEvent) {
        throw new Error("Function not implemented.")
    }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img 
  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
  alt="Kanchen Academy Logo"
  className="w-24 h-14 object-contain"
/>
            <div>
              <div className="font-bold text-xl text-gray-900">Kanchen Academy</div>
              <div className="text-xs text-gray-500 hidden sm:block">Your Learning Companion</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#home" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              🏠 Home
            </a>
            <a href="#courses" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              🎯 Courses
            </a>
            <a href="#features" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              📊 Features
            </a>
            <a href="#faculty" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              👨‍🏫 Faculty
            </a>
            
            <div className="relative">
              <button 
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setStudyDropdownOpen(!studyDropdownOpen)}
              >
                📚 Study Tools
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              {studyDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <a href="/ai-analyzer" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    🧠 AI Analyzer
                  </a>
                  <a href="/flashcards" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    🗂️ Flashcards
                  </a>
                  <a href="/mock-tests" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    📋 Mock Tests
                  </a>
                  <a href="/pyqs" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    ❓ Previous Year Questions
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side - Auth buttons and Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-3">
              <a href="/login">
                <Button variant="ghost" className="font-medium">Login</Button>
              </a>
              <a href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 font-medium px-6">Book Trial</Button>
              </a>
              
              {/* Profile Dropdown */}
              <ProfileDropdown />
            </div>



            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            <Link href="#home" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md">Home</Link>
            <Link href="#courses" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md">Courses</Link>
            <Link href="#features" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md">Features</Link>
            <Link href="#faculty" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md">Faculty</Link>
            <div className="border-t pt-2">
              <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md">Login</Link>
              <Link href="/register" className="block px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-md">Book Trial</Link>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {studyDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setStudyDropdownOpen(false)} 
        />
      )}
    </header>
  )
}

// Hero Section
function HeroSection() {
  const [currentCta, setCurrentCta] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const ctaMessages = [
    "Get Free Demo Class - No Cost!",
    "Join 1000+ Successful Students!",
    "Begin Your UPSC Journey Today!",
    "Transform Your Career Now!",
    "Join Top Rankers Community!",
  ]

  const achievements = [
    { icon: Users, value: "1000+", label: "Students", color: "blue" },
    { icon: Trophy, value: "150+", label: "Selections", color: "green" },
    { icon: BookOpen, value: "50+", label: "Courses", color: "purple" },
    { icon: Star, value: "4.9", label: "Rating", color: "yellow" },
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentCta((prev) => (prev + 1) % ctaMessages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

const getColorClasses = (color: string) => {
  const colorMap: Record<"blue" | "green" | "purple" | "yellow", string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
  }

  return colorMap[color as keyof typeof colorMap] ?? colorMap.blue
}


  return (
    <section id="home" className="relative pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 md:w-40 md:h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 md:w-44 md:h-44 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20">
        <div className="grid lg:grid-cols-5 items-center gap-12 lg:gap-16 xl:gap-20">
          
          {/* Left Content */}
          <div className={`lg:col-span-3 text-center lg:text-left space-y-6 md:space-y-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl font-bold text-gray-800 leading-tight tracking-tight">
                Transform Your Dreams into{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Civil Service
                </span>{" "}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Success
                </span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-1.5xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join India&apos;s most innovative coaching institute combining traditional teaching excellence with{" "}
                <span className="font-semibold text-cyan-800">AI-powered learning tools</span>. 
                Specialized preparation for UPSC, SSC, and State PCS examinations.
              </p>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {achievements.map((achievement, index) => (
                <Card 
                  key={index} 
                  className={`border shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                    getColorClasses(achievement.color)
                  }`}
                >
                  <CardContent className="p-3 md:p-4 text-center">
                    <achievement.icon className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-current" />
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{achievement.value}</div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">{achievement.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <a href="/register" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                  >
                    Start Learning Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </a>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Dynamic CTA Message */}
              <div className="text-center lg:text-left">
                <p className="text-base md:text-lg font-medium text-blue-600 animate-pulse transition-all duration-500">
                  {ctaMessages[currentCta]}
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Card */}
          <div className={`lg:col-span-2 relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative z-10 max-w-md mx-auto lg:max-w-none">
              <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-0 hover:shadow-3xl transition-shadow duration-300">
                <CardContent className="p-5 md:p-6">
                  <div className="space-y-5">
                    
                    {/* Header */}
                    <div className="text-center">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Ready to Start?</h3>
                      <p className="text-gray-600 text-sm">Join thousands of successful aspirants</p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: BookOpen, label: "50+ Courses", desc: "Comprehensive Study", color: "blue" },
                        { icon: Users, label: "Expert Faculty", desc: "Experienced Teachers", color: "green" },
                        { icon: Trophy, label: "Top Results", desc: "Proven Success", color: "purple" },
                        { icon: Star, label: "4.9 Rating", desc: "Student Reviews", color: "yellow" }
                      ].map((feature, index) => (
                        <div 
                          key={index} 
                          className={`text-center p-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                            getColorClasses(feature.color)
                          }`}
                        >
                          <feature.icon className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-current" />
                          <div className="font-semibold text-gray-900 text-sm">{feature.label}</div>
                          <div className="text-xs text-gray-600 mt-1">{feature.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <a href="/register" className="block">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
                        Get Started Free
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </a>

                    {/* Trust Badge */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        ✨ Free trial • No credit card required • Join 1000+ aspirants
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Exam Categories Section
function ExamCategoriesSection() {
  const examCategories = [
    {
      title: 'UPSC Civil Services',
      description: 'Complete preparation with AI-powered mock interviews and current affairs analysis',
      students: '5,000+',
      duration: '18 months',
      successRate: '15%',
      color: 'bg-blue-600',
      subjects: ['Prelims', 'Mains', 'Interview', 'Current Affairs'],
      popular: true
    },
    {
      title: 'SSC Exams',
      description: 'CGL, CHSL, MTS preparation with smart flashcards and adaptive learning',
      students: '8,000+',
      duration: '12 months',
      successRate: '25%',
      color: 'bg-green-600',
      subjects: ['Quantitative', 'Reasoning', 'English', 'GK'],
      popular: false
    },
    {
      title: 'Banking Exams',
      description: 'IBPS, SBI PO/Clerk with AI-generated questions and performance tracking',
      students: '6,500+',
      duration: '10 months',
      successRate: '30%',
      color: 'bg-purple-600',
      subjects: ['Banking Awareness', 'Reasoning', 'Quantitative', 'English'],
      popular: false
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Choose Your Exam Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Specialized AI-powered preparation for India&apos;s most competitive exams
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {examCategories.map((exam, index) => (
            <Card key={index} className={`relative overflow-hidden border-0 shadow-xl ${exam.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {exam.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
              )}
              
              <div className={`h-2 ${exam.color}`} />
              
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h3>
                  <p className="text-gray-600">{exam.description}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                    <div className="font-semibold text-gray-900">{exam.students}</div>
                    <div className="text-gray-500">Students</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                    <div className="font-semibold text-gray-900">{exam.duration}</div>
                    <div className="text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <Trophy className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                    <div className="font-semibold text-gray-900">{exam.successRate}</div>
                    <div className="text-gray-500">Success Rate</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-900">Key Subjects:</div>
                  <div className="flex flex-wrap gap-2">
                    {exam.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className={`w-full ${exam.color} hover:opacity-90`}>
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Courses Section
function CoursesSection() {
  const [activeCategory, setActiveCategory] = useState("All")

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

  const filteredCourses = activeCategory === "All" ? courses : courses.filter((course) => course.category === activeCategory)

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-1">
            Our Premium <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Courses</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
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
              <div className={`h-1 ${course.topBorder}`}></div>

              <div className="p-6 text-center">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.theme === "blue" ? "bg-blue-100 text-blue-800" :
                    course.theme === "green" ? "bg-green-100 text-green-800" :
                    "bg-orange-100 text-orange-800"
                  }`}>
                    {course.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">{course.title}</h3>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{course.duration} • {course.schedule}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{course.students} students enrolled</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {course.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">{course.originalPrice}</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    {course.discount}
                  </span>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
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

        <div className="flex justify-center mt-12">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium">
            View All Courses →
          </Button>
        </div>
      </div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
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
              className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 backdrop-blur-sm bg-blue-100 rounded-2xl"
            >
              <CardContent className="p-8 text-center">
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

// Study Materials Section
function StudyMaterialsSection() {
  const studyMaterials = [
    {
      title: "Previous Year Questions (PYQs)",
      description: "Comprehensive collection of last 20 years questions with detailed solutions",
      icon: "📄",
      features: ["Topic-wise categorization", "Difficulty analysis", "Solution videos"],
      freeContent: "Last 5 years questions",
      premiumContent: "Complete 20 years database + trend analysis",
      color: "teal",
      gradientFrom: "from-teal-400",
      gradientTo: "to-green-500",
    },
    {
      title: "Mock Tests & Practice",
      description: "AI-powered mock tests that adapt to your performance level",
      icon: "📋",
      features: ["Adaptive difficulty", "Performance analytics", "All India ranking"],
      freeContent: "5 mock tests per month",
      premiumContent: "Unlimited tests + detailed analysis",
      color: "orange",
      gradientFrom: "from-orange-400",
      gradientTo: "to-red-500",
    },
    {
      title: "Study Notes & Materials",
      description: "Expertly curated notes covering entire syllabus with regular updates",
      icon: "📚",
      features: ["Visual learning aids", "Quick revision notes", "Mind maps"],
      freeContent: "Basic notes for 3 subjects",
      premiumContent: "Complete syllabus + advanced materials",
      color: "purple",
      gradientFrom: "from-purple-400",
      gradientTo: "to-pink-500",
    },
    {
      title: "Current Affairs",
      description: "Daily current affairs with monthly compilations and analysis",
      icon: "📰",
      features: ["Daily updates", "Monthly magazines", "Editorial analysis"],
      freeContent: "Weekly current affairs",
      premiumContent: "Daily updates + editorial analysis",
      color: "blue",
      gradientFrom: "from-blue-400",
      gradientTo: "to-indigo-500",
    },
    {
      title: "Smart Revision Tools",
      description: "AI-powered flashcards and spaced repetition for effective memorization",
      icon: "🧠",
      features: ["Spaced repetition algorithm", "Custom flashcards", "Progress tracking"],
      freeContent: "Basic flashcards",
      premiumContent: "AI-powered spaced repetition + analytics",
      color: "pink",
      gradientFrom: "from-pink-400",
      gradientTo: "to-rose-500",
    },
    {
      title: "Interactive Quizzes",
      description: "Gamified learning with topic-wise quizzes and instant feedback",
      icon: "🎯",
      features: ["Instant feedback", "Leaderboards", "Achievement badges"],
      freeContent: "10 quizzes per week",
      premiumContent: "Unlimited quizzes + detailed explanations",
      color: "yellow",
      gradientFrom: "from-yellow-400",
      gradientTo: "to-orange-500",
    },
  ]

  return (
    <section id="study-ecosystem" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Complete Study Ecosystem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for UPSC preparation - from PYQs to AI-powered revision tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studyMaterials.map((material, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white rounded-2xl">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${material.gradientFrom} ${material.gradientTo} flex items-center justify-center mb-4 shadow-lg mx-auto`}>
                  <span className="text-2xl filter drop-shadow-sm">{material.icon}</span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 text-center">{material.title}</CardTitle>
                <p className="text-gray-600 text-sm text-center">{material.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  {material.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">FREE</Badge>
                    </div>
                    <p className="text-sm text-gray-700 text-center">{material.freeContent}</p>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        PREMIUM
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 text-center">{material.premiumContent}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 font-semibold">
                    Try Free
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Crown className="h-4 w-4 mr-1" />
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="h-8 w-8" />
                <h3 className="text-2xl font-bold">Unlock Premium Access</h3>
              </div>
              <p className="text-blue-100 mb-6 text-lg">
                Get unlimited access to all study materials, AI-powered tools, and premium features
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent">
                  View Pricing Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Faculty Section
function FacultySection() {
  const faculty = [
    {
      name: "Dr. Rajesh Kumar",
      designation: "UPSC Expert & Former IAS Officer",
      experience: "15+ Years",
      image: "/placeholder.svg?height=200&width=200&text=Dr.Rajesh",
      specialization: "Public Administration, Ethics",
      achievements: ["IAS Rank 12", "500+ Students Mentored", "Author of 3 Books"],
    },
    {
      name: "Prof. Meera Sharma",
      designation: "History & Current Affairs Specialist",
      experience: "12+ Years",
      image: "/placeholder.svg?height=200&width=200&text=Prof.Meera",
      specialization: "Ancient & Modern History",
      achievements: ["PhD in History", "300+ Selections", "TV Panelist"],
    },
    {
      name: "Mr. Amit Verma",
      designation: "Mathematics & Reasoning Expert",
      experience: "10+ Years",
      image: "/placeholder.svg?height=200&width=200&text=Mr.Amit",
      specialization: "Quantitative Aptitude, Logic",
      achievements: ["IIT Graduate", "95% Success Rate", "Online Course Creator"],
    },
  ]

  return (
    <section id="faculty" className="py-20 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Faculty</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from experienced educators and successful civil servants who have guided thousands to success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {faculty.map((member, index) => (
            <div key={index} className="bg-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-cyan-800 font-medium mb-2">{member.designation}</p>
                <p className="text-gray-600 text-sm">{member.specialization}</p>
              </div>

              <div className="space-y-3 mb-6">
                {member.achievements.map((achievement, achievementIndex) => (
                  <div key={achievementIndex} className="flex items-center justify-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2 text-cyan-800" />
                    {achievement}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center text-sm text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                {member.experience} Teaching Experience
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      achievement: "IAS Rank 45, 2023",
      image: "/placeholder.svg?height=80&width=80&text=Priya",
      content: "Kanchen Academy's AI flashcards were a game-changer for my preparation. The spaced repetition helped me retain vast amounts of information effortlessly.",
      rating: 5,
    },
    {
      name: "Rahul Kumar",
      achievement: "SSC CGL Selected, 2023",
      image: "/placeholder.svg?height=80&width=80&text=Rahul",
      content: "The comprehensive course structure and expert faculty guidance helped me crack SSC CGL in my first attempt. Highly recommended!",
      rating: 5,
    },
    {
      name: "Anjali Patel",
      achievement: "GPSC Class 1, 2023",
      image: "/placeholder.svg?height=80&width=80&text=Anjali",
      content: "The personalized study plans and regular mock tests kept me on track throughout my preparation journey. Thank you Kanchen Academy!",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
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

              <Quote className="h-8 w-8 mb-4 text-cyan-800" />

              <p className="text-gray-600 mb-6 italic">&quot;{testimonial.content}&quot;</p>

              <div className="flex items-center">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-cyan-800">{testimonial.achievement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? We&apos;re here to help you start your civil service preparation journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8 bg-sky-100 px-6 rounded-2xl py-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-cyan-800 mr-4 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">
                      123 Education Street, Civil Lines<br />New Delhi - 110001
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-cyan-800 mr-4 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+91 98765 43210<br />+91 87654 32109</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-cyan-800 mr-4 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">info@kanchenacademy.com<br />admissions@kanchenacademy.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-cyan-800 mr-4 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Office Hours</p>
                    <p className="text-gray-600">Monday - Saturday: 9:00 AM - 7:00 PM<br />Sunday: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-800 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-800 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-800 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-800 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Interest</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-800 focus:border-transparent">
                  <option>Select a course</option>
                  <option>UPSC Civil Services</option>
                  <option>SSC CGL/CHSL</option>
                  <option>State PCS</option>
                  <option>Banking Exams</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-800 focus:border-transparent"
                  placeholder="Tell us about your goals and how we can help..."
                ></textarea>
              </div>

              <Button className="w-full bg-cyan-800 hover:bg-cyan-900 text-white py-3">Send Message</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Final CTA Section
function FinalCtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-cyan-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Start Your Success Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of successful candidates who transformed their dreams into reality with Kanchen Academy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-cyan-800 hover:bg-gray-100 px-8 py-4">
              Book Free Demo Class
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-cyan-800 px-8 py-4 bg-transparent"
            >
              Download Brochure
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <Phone className="h-5 w-5 mr-3" />
              <div>
                <p className="text-blue-100 text-sm">Call us now</p>
                <p className="font-semibold">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="h-5 w-5 mr-3" />
              <div>
                <p className="text-blue-100 text-sm">Email us</p>
                <p className="font-semibold">info@kanchenacademy.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-cyan-800" />
              <span className="text-2xl font-bold">Kanchen Academy</span>
            </div>
            <p className="text-gray-400">
              Empowering aspirants with AI-powered learning for UPSC, SSC, and State PCS success.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-cyan-400 cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-cyan-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-cyan-400 cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-cyan-400 cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400">About Us</a></li>
              <li><a href="#courses" className="hover:text-cyan-400">Courses</a></li>
              <li><a href="#faculty" className="hover:text-cyan-400">Faculty</a></li>
              <li><a href="#" className="hover:text-cyan-400">Success Stories</a></li>
              <li><a href="#contact" className="hover:text-cyan-400">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Courses</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400">UPSC CSE</a></li>
              <li><a href="#" className="hover:text-cyan-400">SSC CGL</a></li>
              <li><a href="#" className="hover:text-cyan-400">SSC CHSL</a></li>
              <li><a href="#" className="hover:text-cyan-400">State PCS</a></li>
              <li><a href="#" className="hover:text-cyan-400">Banking Exams</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to get latest updates and study materials.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button className="px-4 py-2 bg-cyan-800 hover:bg-cyan-700 rounded-r-md">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Kanchen Academy. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}

// Main Landing Page Component
export default function CompleteLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ExamCategoriesSection />
      <CoursesSection />
      <FeaturesSection />
      <StudyMaterialsSection />
      <FacultySection />
      <TestimonialsSection />
      <ContactSection />
      <FinalCtaSection />
      <Footer />
    </div>
  )
}