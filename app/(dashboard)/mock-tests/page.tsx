// app/(dashboard)/mock-tests/page.tsx
import { Suspense } from 'react';
import TestList from '@/components/mock-tests/TestList';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Metadata } from 'next';

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

export const metadata: Metadata = {
  title: 'Mock Tests - Kanchen Academy',
  description: 'Practice with comprehensive mock tests designed for competitive exams.',
};

export default function MockTestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mock Tests</h1>
        <p className="text-gray-600 mt-1">
          Practice with exam-like tests to assess your preparation
        </p>
      </div>
           
      <ErrorBoundary fallback={
        <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Unable to load mock tests
          </h3>
          <p className="text-red-600 mb-4">
            There was an error loading the mock tests. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      }>
        <Suspense fallback={<LoadingSkeleton />}>
          <TestList />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}