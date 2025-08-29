import { Suspense } from 'react'
import { Header } from '@/components/header'
import TestInterface from '@/components/mock-tests/TestInterface'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Metadata } from 'next'

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50/50 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
        <div className="flex gap-4 justify-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 w-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default function MockTestsPage({ 
  searchParams 
}: { 
  searchParams: { testId?: string } 
}) {
  if (searchParams.testId) {
    return (
      <>
        <Header />
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingSkeleton />}>
            <TestInterface 
              testId={searchParams.testId}
              onTestComplete={(attempt) => {
                console.log('Test completed:', attempt)
                // Handle test completion
              }}
              onExit={() => {
                window.history.back()
              }}
            />
          </Suspense>
        </ErrorBoundary>
      </>
    )
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50/50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📝 Mock Tests & Practice
            </h1>
            <p className="text-gray-600">
              AI-powered mock tests that adapt to your performance level
            </p>
          </div>
          
          <ErrorBoundary>
            {/* Add your mock test list component here */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">Mock tests coming soon...</p>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </>
  )
}

export const metadata: Metadata = {
  title: 'Mock Tests - Practice & Assessment',
  description: 'AI-powered mock tests with performance analytics and All India ranking',
}
