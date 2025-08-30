"use client"
import React, { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { HeaderOptimized } from '@/components/layout/header-optimized';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface UnifiedKanchenAcademyProps {
  children: React.ReactNode;
}

const UnifiedKanchenAcademy: React.FC<UnifiedKanchenAcademyProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  
  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }
  
  // If user is not authenticated, show auth prompt for protected routes
  const isProtectedRoute = typeof window !== 'undefined' && 
    (window.location.pathname.startsWith('/dashboard') || 
     window.location.pathname.startsWith('/courses') ||
     window.location.pathname.startsWith('/flashcards') ||
     window.location.pathname.startsWith('/mock-tests'));
  
  if (!user && isProtectedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center p-6">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">KA</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access your dashboard and learning materials.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/login" className="w-full">
              <Button className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderOptimized 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onSignOut={signOut}
      />
      
      <Navigation 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      
      <main className="lg:ml-16 pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default UnifiedKanchenAcademy;