"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Play, ArrowRight, Users, Trophy, BookOpen, Star, ChevronRight, ChevronDown, Brain, FileText, ClipboardList, HelpCircle } from 'lucide-react';

const studyItems = [
  {
    href: '/ai-analyzer',
    icon: Brain,
    title: 'AI Analyzer',
    description: 'Smart content analysis and insights'
  },
  {
    href: '/flashcards',
    icon: BookOpen,
    title: 'Study Cards',
    description: 'Interactive learning cards and practice'
  },
  {
    href: '/notes',
    icon: FileText,
    title: 'Notes',
    description: 'Comprehensive study materials'
  },
  {
    href: '/practice',
    icon: ClipboardList,
    title: 'Mock Tests',
    description: 'Full-length practice examinations'
  },
  {
    href: '/pyq',
    icon: HelpCircle,
    title: 'Previous Year Questions',
    description: 'Solve past exam questions'
  }
];

const ctaMessages = [
  "Get Free Demo Class - No Cost!",
  "Join 1000+ Successful Students!",
  "Begin Your UPSC Journey Today!",
  "Transform Your Career Now!",
  "Join Top Rankers Community!",
];

// Study Dropdown Component
const StudyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
      >
        <span className="text-sm font-medium">Study</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl py-3 z-[60] animate-fade-in"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-4 pb-2 mb-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Study Tools</h3>
          </div>
          
          {studyItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-start space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors duration-150 group hover:bg-gray-50 text-gray-700 hover:text-gray-900"
            >
              <div className="flex-shrink-0 mt-0.5">
                <item.icon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </a>
          ))}
          
          <div className="border-t border-gray-100 mt-3 pt-2 mx-2">
            <a
              href="/study"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-150"
            >
              View All Study Tools
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const UnifiedKanchenAcademy = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentCta, setCurrentCta] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentCta((prev) => (prev + 1) % ctaMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Unified Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kanchen-m9v7Y6xyNyNxVd7iwVDUqCPKEbRfrc.png"
                alt="Kanchen Academy Logo"
                className="w-32 h-14 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kanchen Academy</h1>
                <p className="text-xs text-gray-500 -mt-1">Your Learning Companion</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <a href="#" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Home</a>
              <a href="#courses" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Learning Paths</a>
              <a href="#dashboard" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Progress</a>
              <a href="#updates" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Daily Updates</a>
              <StudyDropdown />
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Login
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
                Book Trial
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm animate-fade-in">
              <div className="flex flex-col space-y-2">
                <a href="#" className="px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">Home</a>
                <a href="#courses" className="px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">Learning Paths</a>
                <a href="#dashboard" className="px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">Progress</a>
                <a href="#updates" className="px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">Daily Updates</a>
                
                <div className="px-4 py-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Study Tools</h4>
                  {studyItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  ))}
                </div>

                <div className="px-4 pt-4 border-t border-gray-200 space-y-3">
                  <button className="w-full px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors text-left">
                    Login
                  </button>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                    Book Trial
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default UnifiedKanchenAcademy;
