// app/(dashboard)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ErrorBoundary } from "react-error-boundary";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import CourseDashboard from "@/components/CourseDashboard";
import { BookOpen, Brain, Target, TrendingUp, Award } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    completedCourses: 0,
    totalCourses: 0,
    dueFlashcards: 0,
    totalFlashcards: 0,
    averageScore: 0,
    totalTestAttempts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch stats
    const fetchStats = async () => {
      try {
        // Replace this with actual API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setStats({
          completedCourses: 3,
          totalCourses: 8,
          dueFlashcards: 15,
          totalFlashcards: 120,
          averageScore: 84,
          totalTestAttempts: 12,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const courseProgress = stats.totalCourses > 0 ? (stats.completedCourses / stats.totalCourses) * 100 : 0;

  return (
    <ErrorBoundary 
      fallback={
        <div className="text-center">
          <p className="text-red-600 mb-4">Something went wrong loading the dashboard.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      }
    >
      

          

          {/* Right column: Analytics + Courses */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseDashboard courseId="dashboard-overview" />
              </CardContent>
            </Card>
         
        {/* Placeholder for additional sections */}
        {/* Uncomment and implement as needed */}
        {/* 
        <Card>
          <CardHeader>
            <CardTitle>Learning Goals</CardTitle>
          </CardHeader>
          <CardContent>
            // Your goals content here
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Materials</CardTitle>
          </CardHeader>
          <CardContent>
            // Your study materials content here
          </CardContent>
        </Card>
        */}

      </div>
    </ErrorBoundary>
  );
}