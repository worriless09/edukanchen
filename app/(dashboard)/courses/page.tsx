// app/(dashboard)/courses/page.tsx
import CourseList from '@/components/courses/CourseList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses - Kanchen Academy',
  description: 'Browse and enroll in comprehensive courses for UPSC, SSC, and other competitive exams.',
};

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-gray-600 mt-1">
          Comprehensive courses designed for competitive exam success
        </p>
      </div>
      
      <CourseList />
    </div>
  );
}
