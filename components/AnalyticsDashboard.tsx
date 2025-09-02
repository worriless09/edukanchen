'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Target, 
  Calendar, 
  Award,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Flame,
  GraduationCap,
  BarChart3,

  Brain,
  Trophy,
  Zap,
  Star,
  Users,
  CheckCircle,
  Activity,
  BookmarkCheck,
  Lightbulb,
  Timer,
  PieChart
} from "lucide-react";

interface AnalyticsData {
  studyStreak: number;
  knowledgeScore: number;
  totalStudyTime: number;
  topicsCompleted: number;
  weeklyGoal: number;
  weeklyProgress: number;
  skillsImproved: number;
  averageScore: number;
  completionRate: number;
  focusTime: number;
}

// Enhanced Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};

const floatingVariants: Variants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const EnhancedAnalyticsDashboard = () => {
  // Mock data with more comprehensive analytics - moved to top
  const mockAnalytics: AnalyticsData = {
    studyStreak: 12,
    knowledgeScore: 87,
    totalStudyTime: 540,
    topicsCompleted: 18,
    weeklyGoal: 420,
    weeklyProgress: 89,
    skillsImproved: 6,
    averageScore: 82,
    completionRate: 94,
    focusTime: 340
  };

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(mockAnalytics); // Start with data
  const [loading, setLoading] = useState(false); // Start without loading
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simulate loading with shorter delay
    const timer = setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // For immediate testing, you can also set analytics immediately
  useEffect(() => {
    if (!analytics && !loading) {
      setAnalytics(mockAnalytics);
    }
  }, [analytics, loading]);

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
      // Simulate refresh
      setTimeout(() => {
        setAnalytics({
          ...mockAnalytics,
          studyStreak: mockAnalytics.studyStreak + 1,
          totalStudyTime: mockAnalytics.totalStudyTime + 30
        });
        setRefreshing(false);
      }, 1500);
    }
  };

  // Enhanced Stat Card with more visual elements
  const EnhancedStatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    gradient, 
    progress, 
    trend,
    decorativeIcon,
    sparkle = false
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    progress?: number;
    trend?: 'up' | 'down' | 'neutral';
    decorativeIcon?: string;
    sparkle?: boolean;
  }) => (
    <motion.div 
      variants={itemVariants} 
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <div className={`relative overflow-hidden rounded-2xl ${gradient} shadow-lg hover:shadow-xl transition-all duration-500 backdrop-blur-sm min-h-[180px] flex flex-col border-2`}>
        {/* Animated Background Pattern - more subtle */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/20 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-1/2 -left-2 w-10 h-10 rounded-full bg-white/15 group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute bottom-2 right-1/3 w-6 h-6 rounded-full bg-white/25 group-hover:scale-105 transition-transform duration-600" />
        </div>
        
        {/* Main Content */}
        <div className="relative p-6 flex-1 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
              {title}
            </h3>
            <motion.div 
              variants={sparkle ? pulseVariants : floatingVariants}
              animate={sparkle ? "pulse" : "float"}
              className="relative"
            >
              <div className="p-3 bg-white/30 rounded-xl backdrop-blur-sm group-hover:bg-white/40 transition-colors duration-300 shadow-sm">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
              {sparkle && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1 text-amber-500"
                >
                  <Star className="h-3 w-3" />
                </motion.div>
              )}
            </motion.div>
          </div>
          
          {/* Value Display */}
          <div className="flex items-end gap-3 mb-4">
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-3xl font-bold text-gray-800"
            >
              {value}
            </motion.span>
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  trend === 'up' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : trend === 'down' 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <TrendingUp className={`h-3 w-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
                {trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : '0%'}
              </motion.div>
            )}
          </div>
          
          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-semibold text-gray-700">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"
                />
              </div>
            </div>
          )}
          
          {/* Subtitle */}
          <p className="text-sm text-gray-600 font-medium">
            {subtitle}
          </p>
          
          {/* Decorative Element */}
          {decorativeIcon && (
            <div className="absolute bottom-4 right-4 text-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">
              {decorativeIcon}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#8B5CF6" }: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-700">{percentage}%</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          {/* Loading Header */}
          <div className="text-center mb-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <BarChart3 className="h-12 w-12 text-indigo-600" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Loading Your Analytics
            </h1>
            <div className="mt-4 w-64 h-1 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                animate={{ x: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
          
          {/* Loading Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-8 w-8 bg-gray-300 rounded-xl"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded mb-3"></div>
                <div className="h-2 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-6 space-y-8"
      >
        {/* Enhanced Header */}
        <motion.div variants={itemVariants} className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-3xl rounded-full" />
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <BarChart3 className="h-16 w-16 text-indigo-600" />
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="h-3 w-3 text-yellow-800" />
                </div>
              </div>
            </motion.div>
                      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover insights, track progress, and celebrate your learning journey with beautiful visualizations
            </p>
          </div>
        </motion.div>

        {analytics && (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EnhancedStatCard
                title="Study Streak"
                value={`${analytics.studyStreak} days`}
                subtitle="Consistency is key! 🔥"
                icon={Flame}
                gradient="bg-gradient-to-br from-orange-100 to-amber-200 border-orange-300"
                trend="up"
                decorativeIcon="🔥"
                sparkle={true}
              />
              
              <EnhancedStatCard
                title="Knowledge Score"
                value={`${analytics.knowledgeScore}%`}
                subtitle="Overall mastery level"
                icon={Brain}
                gradient="bg-gradient-to-br from-blue-100 to-indigo-200 border-blue-300"
                progress={analytics.knowledgeScore}
                trend="up"
                decorativeIcon="🧠"
              />
              
              <EnhancedStatCard
                title="Study Time"
                value={`${Math.floor(analytics.totalStudyTime / 60)}h ${analytics.totalStudyTime % 60}m`}
                subtitle="Total learning invested"
                icon={Clock}
                gradient="bg-gradient-to-br from-teal-100 to-cyan-200 border-teal-300"
                trend="up"
                decorativeIcon="⏰"
              />
              
              <EnhancedStatCard
                title="Skills Mastered"
                value={analytics.skillsImproved}
                subtitle="New abilities unlocked"
                icon={Trophy}
                gradient="bg-gradient-to-br from-yellow-100 to-amber-200 border-yellow-300"
                trend="up"
                decorativeIcon="🏆"
                sparkle={true}
              />
              
              <EnhancedStatCard
                title="Completion Rate"
                value={`${analytics.completionRate}%`}
                subtitle="Task completion efficiency"
                icon={CheckCircle}
                gradient="bg-gradient-to-br from-green-100 to-emerald-200 border-green-300"
                progress={analytics.completionRate}
                trend="up"
                decorativeIcon="✅"
              />
              
              <EnhancedStatCard
                title="Focus Time"
                value={`${Math.floor(analytics.focusTime / 60)}h ${analytics.focusTime % 60}m`}
                subtitle="Deep work sessions"
                icon={Zap}
                gradient="bg-gradient-to-br from-rose-100 to-pink-200 border-rose-300"
                trend="up"
                decorativeIcon="⚡"
              />
              
              <EnhancedStatCard
                title="Weekly Progress"
                value={`${analytics.weeklyProgress}%`}
                subtitle={`${analytics.weeklyGoal}min goal`}
                icon={Target}
                gradient="bg-gradient-to-br from-purple-100 to-violet-200 border-purple-300"
                progress={analytics.weeklyProgress}
                trend="up"
                decorativeIcon="🎯"
              />
              
              <EnhancedStatCard
                title="Average Score"
                value={`${analytics.averageScore}%`}
                subtitle="Assessment performance"
                icon={GraduationCap}
                gradient="bg-gradient-to-br from-gray-100 to-slate-200 border-gray-300"
                progress={analytics.averageScore}
                trend="neutral"
                decorativeIcon="🎓"
              />
            </div>

            {/* Circular Progress Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-white/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Knowledge Mastery</h3>
                <div className="flex justify-center">
                  <CircularProgress percentage={analytics.knowledgeScore} color="#8B5CF6" />
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-white/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Weekly Goal</h3>
                <div className="flex justify-center">
                  <CircularProgress percentage={analytics.weeklyProgress} color="#10B981" />
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-white/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Completion Rate</h3>
                <div className="flex justify-center">
                  <CircularProgress percentage={analytics.completionRate} color="#F59E0B" />
                </div>
              </div>
            </motion.div>

            {/* Achievement Showcase */}
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-r from-white/90 via-purple-50/80 to-pink-50/80 rounded-3xl p-8 border-2 border-purple-200/50 backdrop-blur-sm shadow-xl">
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block mb-4"
                  >
                    <Award className="h-12 w-12 text-purple-600" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Achievement Gallery
                  </h2>
                  <p className="text-gray-600 mt-2">Your learning milestones and accomplishments</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { emoji: "🏆", title: "Study Champion", desc: `${analytics.studyStreak} day streak` },
                    { emoji: "🧠", title: "Knowledge Master", desc: `${analytics.knowledgeScore}% mastery` },
                    { emoji: "⚡", title: "Speed Learner", desc: `${analytics.skillsImproved} skills gained` },
                    { emoji: "🎯", title: "Goal Crusher", desc: `${analytics.weeklyProgress}% completed` }
                  ].map((achievement, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white/90 rounded-2xl p-6 text-center backdrop-blur-sm shadow-lg border-2 border-white/60"
                    >
                      <div className="text-4xl mb-3">{achievement.emoji}</div>
                      <h3 className="font-bold text-gray-800 mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Action Center */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchAnalytics(true)}
                  disabled={refreshing}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center justify-center gap-3"
                >
                  <motion.div
                    animate={refreshing ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </motion.div>
                  {refreshing ? 'Refreshing...' : 'Refresh Analytics'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/70 text-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold backdrop-blur-sm border border-white/30 flex items-center justify-center gap-3"
                >
                  View Detailed Report
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;