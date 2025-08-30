"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, Brain, BookOpen, FileText, ClipboardList, HelpCircle, Home, TrendingUp, Calendar } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { HeaderOptimized } from '@/components/layout/header-optimized';

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

// Study Dropdown Component for Top Navigation
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
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-start space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors duration-150 group hover:bg-gray-50 text-gray-700 hover:text-gray-900"
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

// Layout Component
interface UnifiedKanchenAcademyProps {
  children: React.ReactNode;
}

const UnifiedKanchenAcademy: React.FC<UnifiedKanchenAcademyProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="h-0 bg-gray-50">
      <HeaderOptimized onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Navigation isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* FIXED: Changed lg:ml-64 to lg:ml-16 and adjusted padding */}
        <main className="flex-1 lg:ml-16 pt-16 md:pt-20 px-6 pb-6">{children}</main>
      </div>
    </div>
  );
};

export default UnifiedKanchenAcademy;
export { StudyDropdown };