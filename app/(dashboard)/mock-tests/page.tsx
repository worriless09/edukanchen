// app/(dashboard)/mock-tests/page.tsx
import TestList from '@/components/mock-tests/TestList';
import { Metadata } from 'next';

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
      
      <TestList />
    </div>
  );
}
