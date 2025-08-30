// components/layout/ClientLayoutProvider.tsx
"use client"
import React, { useState } from 'react';
import { HeaderOptimized } from "@/components/layout/header-optimized";
import { Navigation } from "@/components/layout/Navigation";
import { useAuth } from "@/components/auth/AuthProvider";

interface ClientLayoutProviderProps {
  children: React.ReactNode;
}

export function ClientLayoutProvider({ children }: ClientLayoutProviderProps) {
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header - Always visible */}
      <HeaderOptimized 
        user={user} 
        onSignOut={signOut} 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      {/* Fixed Navigation Sidebar - Always visible */}
      <Navigation user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area with proper spacing */}
      <main className="pt-16 md:pt-20 lg:pl-16 transition-all duration-300">
        <div className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}