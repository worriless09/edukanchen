
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { Header } from '@/components/header'
import  DashboardLayout from '@/components/layout/DashboardLayout'
import { StudyMaterialsSection } from '@/components/study-materials-section'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Metadata } from 'next'

// Loading component matching your design
const SectionSkeleton = () => (
  <div className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default function DashboardPage() {
  return (
    <>
      <Header />
      
      <ErrorBoundary fallback={<div className="p-6 text-center">Something went wrong. Please refresh the page.</div>}>
        <DashboardLayout>
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Learning Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Access all your study materials, track progress, and achieve your goals
              </p>
            </div>
            
            {/* Your existing study materials section */}
            <Suspense fallback={<SectionSkeleton />}>
              <StudyMaterialsSection />
            </Suspense>
          </div>
        </DashboardLayout>
      </ErrorBoundary>
    </>
  )
}

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personalized learning dashboard with AI-powered study tools',
}
