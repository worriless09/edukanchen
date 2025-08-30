// components/AnalyticsDashboard.tsx
import { useState, useEffect } from "react";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/learning-progress");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Study Streak</h3>
        <div className="text-3xl font-bold text-green-600">
          {analytics?.studyStreak || 0} days
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Labs Completed</h3>
        <div className="text-3xl font-bold text-blue-600">
          {analytics?.labsCompleted || 0}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Knowledge Score</h3>
        <div className="text-3xl font-bold text-purple-600">
          {analytics?.knowledgeScore || 0}%
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
