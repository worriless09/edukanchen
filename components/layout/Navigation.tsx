// components/Navigation.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Brain, BookOpen, FileText, ClipboardList, HelpCircle, Home, TrendingUp, Calendar, X } from 'lucide-react';

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

interface NavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Navigation = ({ isOpen = false, onClose }: NavigationProps) => {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Main navigation items
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/courses', label: 'Learning Paths', icon: TrendingUp },
    { href: '/dashboard', label: 'Progress', icon: Calendar },
    { href: '/current-affairs', label: 'Daily Updates', icon: BookOpen },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:block fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          isSidebarExpanded ? 'w-72' : 'w-16'
        }`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="p-3 space-y-2 h-full overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={!isSidebarExpanded ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-200 whitespace-nowrap ${
                  isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0'
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Study Tools Section */}
          <div className="pt-4">
            <div className={`px-3 pb-2 transition-opacity duration-200 ${
              isSidebarExpanded ? 'opacity-100' : 'opacity-0'
            }`}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Study Tools
              </h3>
            </div>
            
            <div className="space-y-1">
              {studyItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  title={!isSidebarExpanded ? item.title : undefined}
                >
                  <span className="text-base flex-shrink-0">{item.emoji}</span>
                  <div className={`transition-opacity duration-200 ${
                    isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0'
                  } overflow-hidden`}>
                    <div className="font-medium text-sm whitespace-nowrap">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`pt-4 mt-auto transition-opacity duration-200 ${
            isSidebarExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Your Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Study Streak</span>
                  <span className="font-medium text-blue-600">7 days</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Tests Completed</span>
                  <span className="font-medium text-green-600">23</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Hours Studied</span>
                  <span className="font-medium text-purple-600">142h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <div className="lg:hidden fixed left-0 top-20 h-[calc(100vh-5rem)] w-80 bg-white border-r border-gray-200 z-50 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Main Navigation */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 px-2">Navigation</h3>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={onClose}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
              
              {/* Study Tools */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 px-2 mb-2">Study Tools</h3>
                <div className="space-y-1">
                  {studyItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        pathname === item.href
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={onClose}
                    >
                      <span className="text-base">{item.emoji}</span>
                      <div>
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Progress Stats */}
              <div className="border-t border-gray-200 pt-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Your Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Study Streak</span>
                      <span className="font-medium text-blue-600">7 days</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Tests Completed</span>
                      <span className="font-medium text-green-600">23</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Hours Studied</span>
                      <span className="font-medium text-purple-600">142h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};