// components/Navigation.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Brain, BookOpen, FileText, ClipboardList, HelpCircle } from 'lucide-react';

const studyItems = [
  {
    href: '/ai-analyzer',
    icon: Brain,
    title: 'AI Analyzer',
    description: 'Smart content analysis and insights',
    emoji: '🧠'
  },
  {
    href: '/flashcards',
    icon: BookOpen,
    title: 'Study Cards',
    description: 'Interactive learning cards and practice',
    emoji: '🗂️'
  },
  {
    href: '/notes',
    icon: FileText,
    title: 'Notes',
    description: 'Comprehensive study materials',
    emoji: '📝'
  },
  {
    href: '/practice',
    icon: ClipboardList,
    title: 'Mock Tests',
    description: 'Full-length practice examinations',
    emoji: '📋'
  },
  {
    href: '/pyq',
    icon: HelpCircle,
    title: 'Previous Year Questions',
    description: 'Solve past exam questions',
    emoji: '❓'
  }
];

// Study Dropdown Component
const StudyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Check if current path is a study-related page
  const isStudyActive = studyItems.some(item => pathname === item.href);

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
        className={`relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
          isStudyActive
            ? 'bg-blue-50 text-blue-600 border border-blue-100'
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        <span className="text-sm">📚</span>
        <span className="text-sm font-medium">Study</span>
        <ChevronDown 
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl py-3 z-[60] animate-fade-in"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-4 pb-2 mb-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Study Tools</h3>
          </div>
          
          {studyItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-start space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors duration-150 group ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                  : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <span className="text-base">{item.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
          
          <div className="border-t border-gray-100 mt-3 pt-2 mx-2">
            <Link
              href="/study"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-150"
            >
              View All Study Tools
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Study Dropdown
const MobileStudyDropdown = ({ onClose }: { onClose: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isStudyActive = studyItems.some(item => pathname === item.href);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
          isStudyActive
            ? 'bg-misty-light text-misty'
            : 'text-forest-medium hover:text-forest hover:bg-misty-lighter'
        }`}
      >
        <span className="flex items-center gap-3">
          <span className="text-lg">📚</span>
          <span className="font-medium">Study</span>
        </span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {isOpen && (
        <div className="bg-misty-lighter border-l-4 border-misty ml-4 animate-fade-in">
          {studyItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setIsOpen(false);
                onClose();
              }}
              className={`flex items-center space-x-3 px-4 py-3 transition-colors duration-150 border-b border-main/10 last:border-b-0 ${
                pathname === item.href
                  ? 'bg-misty-light text-misty'
                  : 'hover:bg-background text-forest-medium hover:text-forest'
              }`}
            >
              <span className="text-sm">{item.emoji}</span>
              <div>
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Updated navItems - removed individual study items since they're now in dropdown
  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/courses', label: 'Learning Paths', icon: '🌱' },
    { href: '/dashboard', label: 'Progress', icon: '📈' },
    { href: '/current-affairs', label: 'Daily Updates', icon: '📚' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-misty rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">🏔️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-forest">Kanchen Academy</span>
              <span className="text-xs text-forest-medium -mt-1">Your Learning Companion</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-misty-light text-misty border border-misty/20'
                    : 'text-forest-medium hover:text-forest hover:bg-misty-lighter'
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </span>
              </Link>
            ))}
            
            {/* Study Dropdown */}
            <StudyDropdown />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button className="bg-misty hover:bg-misty text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all">
                Start Learning
              </Button>
            </Link>
            
            <button
              className="md:hidden p-2 rounded-lg hover:bg-misty-lighter transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <UserMenu />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-main animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-misty-light text-misty'
                      : 'text-forest-medium hover:text-forest hover:bg-misty-lighter'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </span>
                </Link>
              ))}
              
              {/* Mobile Study Dropdown */}
              <MobileStudyDropdown onClose={() => setIsMobileMenuOpen(false)} />
              
              <div className="pt-4 mt-4 border-t border-main">
                <Link href="/dashboard">
                  <Button className="w-full bg-misty hover:bg-misty text-white py-3 rounded-lg font-medium">
                    Start Your Learning Journey
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// UserMenu component
const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 bg-sage rounded-full flex items-center justify-center hover:bg-sage-primary transition-colors"
      >
        <span className="text-white text-sm font-medium">👤</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-main rounded-lg shadow-lg py-2 animate-fade-in">
          <Link 
            href="/profile" 
            className="block px-4 py-2 text-forest-medium hover:text-forest hover:bg-misty-lighter transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link 
            href="/settings" 
            className="block px-4 py-2 text-forest-medium hover:text-forest hover:bg-misty-lighter transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          <hr className="my-2 border-main" />
          <button 
            className="block w-full text-left px-4 py-2 text-forest-medium hover:text-forest hover:bg-misty-lighter transition-colors"
            onClick={() => {
              setIsOpen(false);
              // Add logout logic
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};