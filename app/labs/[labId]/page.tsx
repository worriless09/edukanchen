// 4. Main Labs Directory Page
// app/labs/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

const LabsDirectory = () => {
  const { user } = useUser();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await fetch('/api/labs/public');
      const data = await response.json();
      setLabs(data.labs || []);
    } catch (error) {
      console.error('Error fetching labs:', error);
    } finally {
      setLoading(false);
    }
  };

  const labCategories = [
    {
      id: 'ai-tools',
      name: "AI Study Tools",
      description: "Leverage artificial intelligence to enhance your learning",
      icon: "🤖",
      labs: [
        { 
          name: "AI Flashcard Generator", 
          id: "flashcard-generator", 
          description: "Generate intelligent flashcards from any topic using advanced AI",
          difficulty: "Easy",
          estimatedTime: "15 min",
          category: "ai-tools",
          tags: ["AI", "Flashcards", "Memory"],
          isPremium: false
        },
        { 
          name: "Current Affairs Analyzer", 
          id: "current-affairs", 
          description: "Analyze news articles for UPSC relevance and extract key study points",
          difficulty: "Medium",
          estimatedTime: "20 min",
          category: "ai-tools",
          tags: ["Current Affairs", "UPSC", "Analysis"],
          isPremium: false
        },
        { 
          name: "Essay Writing Assistant", 
          id: "essay-writing", 
          description: "Get real-time AI feedback on your essay writing and structure",
          difficulty: "Hard",
          estimatedTime: "45 min",
          category: "ai-tools",
          tags: ["Essay", "Writing", "Feedback"],
          isPremium: true
        },
        { 
          name: "Mind Map Generator", 
          id: "mind-map", 
          description: "Create visual mind maps from complex topics automatically",
          difficulty: "Medium",
          estimatedTime: "25 min",
          category: "ai-tools",
          tags: ["Mind Map", "Visual Learning"],
          isPremium: true
        }
      ]
    },
    {
      id: 'interview-prep',
      name: "Interview Preparation",
      description: "Practice and perfect your interview skills with AI simulation",
      icon: "🎤",
      labs: [
        { 
          name: "Mock Interview Simulator", 
          id: "mock-interview", 
          description: "Simulate UPSC personality test with AI interviewer and get detailed feedback",
          difficulty: "Hard",
          estimatedTime: "60 min",
          category: "interview-prep",
          tags: ["Interview", "UPSC", "Personality Test"],
          isPremium: false
        },
        { 
          name: "DAF-based Questions", 
          id: "daf-questions", 
          description: "Practice questions tailored to your Detailed Application Form",
          difficulty: "Medium",
          estimatedTime: "30 min",
          category: "interview-prep",
          tags: ["DAF", "Personalized", "Interview"],
          isPremium: true
        },
        { 
          name: "Group Discussion Simulator", 
          id: "group-discussion", 
          description: "Practice group discussions with AI participants",
          difficulty: "Hard",
          estimatedTime: "40 min",
          category: "interview-prep",
          tags: ["Group Discussion", "SSC", "Banking"],
          isPremium: true
        }
      ]
    },
    {
      id: 'practice-tests',
      name: "Adaptive Practice",
      description: "Smart testing that adapts to your knowledge level",
      icon: "📝",
      labs: [
        { 
          name: "Adaptive Quiz Engine", 
          id: "adaptive-quiz", 
          description: "AI-powered quiz that adjusts difficulty based on your performance",
          difficulty: "Medium",
          estimatedTime: "30 min",
          category: "practice-tests",
          tags: ["Adaptive", "Quiz", "AI"],
          isPremium: false
        },
        { 
          name: "Sectional Tests", 
          id: "sectional-tests", 
          description: "Focus on specific subjects with detailed performance analysis",
          difficulty: "Medium",
          estimatedTime: "90 min",
          category: "practice-tests",
          tags: ["Sectional", "Analysis", "Performance"],
          isPremium: true
        },
        { 
          name: "Full Mock Tests", 
          id: "mock-tests", 
          description: "Complete simulation of actual exam with AI proctoring",
          difficulty: "Hard",
          estimatedTime: "180 min",
          category: "practice-tests",
          tags: ["Mock Test", "Full Length", "Proctoring"],
          isPremium: true
        }
      ]
    },
    {
      id: 'analytics',
      name: "Learning Analytics",
      description: "Deep insights into your learning patterns and progress",
      icon: "📊",
      labs: [
        { 
          name: "Performance Dashboard", 
          id: "performance-dashboard", 
          description: "Comprehensive view of your learning progress and weak areas",
          difficulty: "Easy",
          estimatedTime: "10 min",
          category: "analytics",
          tags: ["Dashboard", "Progress", "Analytics"],
          isPremium: false
        },
        { 
          name: "Weakness Identifier", 
          id: "weakness-identifier", 
          description: "AI analysis of your weak topics with personalized study plans",
          difficulty: "Medium",
          estimatedTime: "20 min",
          category: "analytics",
          tags: ["Weakness", "AI Analysis", "Study Plan"],
          isPremium: true
        }
      ]
    }
  ];

  const allLabs = labCategories.flatMap(category => 
    category.labs.map(lab => ({ ...lab, categoryName: category.name }))
  );

  const filteredLabs = selectedCategory === 'all' 
    ? allLabs 
    : allLabs.filter(lab => lab.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-offset flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-super mx-auto mb-4"></div>
          <p className="text-muted">Loading labs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offset">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">Learning Labs</h1>
          <p className="text-lg text-muted mb-6">
            Interactive tools and simulations to supercharge your exam preparation
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-super text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Labs
            </button>
            {labCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-super text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map(lab => (
            <LabCard key={lab.id} lab={lab} user={user} />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Your Lab Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Labs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8.5</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">245</div>
              <div className="text-sm text-gray-600">Minutes Practiced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">7</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LabCard = ({ lab, user }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canAccess = !lab.isPremium || (user?.subscription_tier === 'pro');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-main hover:shadow-md transition-all duration-200 group overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold group-hover:text-super transition-colors">
              {lab.name}
            </h3>
            {lab.isPremium && (
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                PRO
              </span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(lab.difficulty)}`}>
            {lab.difficulty}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {lab.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lab.tags?.map((tag, idx) => (
            <span 
              key={idx}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              ⏱ {lab.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              📂 {lab.categoryName}
            </span>
          </div>
          
          <Link href={canAccess ? `/labs/${lab.id}` : '/pricing'}>
            <button 
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                canAccess
                  ? 'bg-super text-white hover:opacity-90 hover:scale-105'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canAccess}
            >
              {canAccess ? 'Open Lab' : 'Upgrade to Pro'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LabsDirectory;