"use client"
import React, { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { HeaderOptimized } from '@/components/layout/header-optimized';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UnifiedKanchenAcademyProps {
  children: React.ReactNode;
}

const UnifiedKanchenAcademy: React.FC<UnifiedKanchenAcademyProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
 
  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }
 
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/courses',
    '/flashcards', 
    '/mock-tests',
    '/ai-analyzer',
    '/student',
    '/settings',
    '/quiz',
    '/videos',
    '/study-materials'
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
 
  // If user is not authenticated, show auth prompt for protected routes
  if (!user && isProtectedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-xl border-0">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Please sign in to access your dashboard and learning materials. Join thousands of successful aspirants in their UPSC journey.
            </p>
          </div>
         
          <div className="space-y-4">
            <Link href="/login" className="w-full block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 text-base font-semibold shadow-lg">
                Sign In to Dashboard
              </Button>
            </Link>
            <Link href="/register" className="w-full block">
              <Button variant="outline" className="w-full py-3 text-base font-semibold border-2 hover:bg-blue-50 hover:border-blue-600">
                Create New Account
              </Button>
            </Link>
            <Link href="/" className="w-full block">
              <Button variant="ghost" className="w-full py-3 text-base font-medium text-gray-600 hover:text-blue-600">
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              New to Kanchen Academy?{" "}
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Learn more about our platform
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header for authenticated/internal pages only */}
      <HeaderOptimized
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onSignOut={signOut}
        showAuthButtons={!user} // Only show auth buttons if not logged in
        isDashboard={true} // Indicates this is for dashboard/internal pages
      />
     
      {/* Sidebar Navigation */}
      <Navigation
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
     
      {/* Main Content Area */}
      <main className={`
        ${user ? 'lg:ml-16' : ''} 
        pt-16 
        min-h-screen 
        transition-all 
        duration-300 
        ease-in-out
      `}>
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default UnifiedKanchenAcademy;