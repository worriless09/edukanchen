// components/layout/ClientLayoutProvider.tsx
"use client"
import React, { useState } from 'react';
import { HeaderOptimized } from "@/components/layout/header-optimized"
import { Navigation } from "@/components/layout/Navigation"

interface ClientLayoutProviderProps {
  children: React.ReactNode;
}

export function ClientLayoutProvider({ children }: ClientLayoutProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header - Always visible */}
      <HeaderOptimized onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Fixed Navigation Sidebar - Always visible */}
      <Navigation isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area with proper spacing */}
      <main className="pt-16 md:pt-20 lg:pl-16 transition-all duration-300">
        <div className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}