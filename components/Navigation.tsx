// components/Navigation.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/courses', label: 'Learning Paths', icon: '🌱' }, // Updated language
    { href: '/flashcards', label: 'Study Cards', icon: '🗂️' }, // Replaced Labs
    { href: '/dashboard', label: 'Progress', icon: '📈' }, // More supportive language  
    { href: '/practice', label: 'Practice', icon: '🌸' }, // Replaced Mock Tests
    { href: '/current-affairs', label: 'Daily Updates', icon: '📚' }, // More gentle language
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-main sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Updated with Misty Mountains styling */}
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
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {/* Primary CTA - Updated */}
            <Link href="/dashboard">
              <Button className="bg-misty hover:bg-misty text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all">
                Start Learning
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
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
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      {item.href === '/flashcards' && (
                        <span className="text-xs text-muted-foreground">
                          Smart spaced learning cards
                        </span>
                      )}
                    </div>
                  </span>
                </Link>
              ))}
              
              {/* Mobile CTA */}
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

// UserMenu component - Updated styling
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
