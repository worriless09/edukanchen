import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Play, FileText, Clock, CheckCircle, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

interface Lecture {
  id: number;
  title: string;
  description: string;
  duration: number;
  is_free: boolean;
  video_url: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  is_free: boolean;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  is_free: boolean;
}

interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
  is_free: boolean;
  lectures: Lecture[];
  notes: Note[];
  quizzes: Quiz[];
}

interface Course {
  id: string | number;
  title: string;
  description: string;
  category: string;
  is_premium: boolean;
}

interface CourseDashboardProps {
  courseId: string | number;
}

const CourseDashboard: React.FC<CourseDashboardProps> = ({ courseId }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [userProgress, setUserProgress] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<'free' | 'premium'>('free');

  // Mock function to simulate canAccess
  const canAccess = useCallback((contentType: 'free' | 'premium') => {
    if (contentType === 'free') return true;
    return userSubscription === 'premium';
  }, [userSubscription]);

  // Enhanced video player component with error handling
  const VideoPlayer: React.FC<{
    lecture: Lecture;
    onProgress?: (lectureId: number, progress: number) => void;
    onComplete?: (lectureId: number) => void;
  }> = ({ lecture, onProgress, onComplete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const canWatch = canAccess(lecture.is_free ? 'free' : 'premium');
    
    if (!canWatch) {
      return (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
            <div className="text-center text-white p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
              <p className="text-blue-100 mb-4">
                Upgrade to Premium to access this lecture
              </p>
              <button 
                onClick={() => setUserSubscription('premium')}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      );
    }

    const handlePlay = () => {
      setIsPlaying(true);
      // Simulate video progress
      const progressInterval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const progress = (newTime / (lecture.duration * 60)) * 100;
          
          if (onProgress) {
            onProgress(lecture.id, progress);
          }
          
          if (progress >= 100) {
            clearInterval(progressInterval);
            if (onComplete) {
              onComplete(lecture.id);
            }
            setIsPlaying(false);
            return lecture.duration * 60;
          }
          
          return newTime;
        });
      }, 1000);
      
      // Clean up interval after lecture duration
      setTimeout(() => {
        clearInterval(progressInterval);
        setIsPlaying(false);
      }, lecture.duration * 60 * 1000);
    };

    return (
      <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center relative">
        <div className="text-white text-center">
          <div 
            className={`w-16 h-16 mx-auto mb-4 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors ${
              isPlaying ? 'animate-pulse' : ''
            }`}
            onClick={handlePlay}
          >
            <Play className="w-16 h-16" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{lecture.title}</h3>
          <p className="text-gray-300 mb-4">
            {isPlaying ? 'Playing...' : `Video Player - ${lecture.duration} mins`}
          </p>
          <button 
            onClick={() => onComplete && onComplete(lecture.id)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Mark as Complete
          </button>
        </div>
        
        {/* Progress bar overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
          <div className="w-full bg-gray-600 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / (lecture.duration * 60)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock course data with better structure
      const mockCourse: Course = {
        id: courseId,
        title: "UPSC Civil Services Complete Course",
        description: "Comprehensive preparation for UPSC CSE with expert guidance",
        category: "upsc",
        is_premium: true
      };

      const mockModules: Module[] = [
        {
          id: 1,
          title: "History Module",
          description: "Ancient, Medieval & Modern History",
          order_index: 1,
          is_free: false,
          lectures: [
            {
              id: 1,
              title: "Ancient Indian History - Part 1",
              description: "Indus Valley Civilization and early settlements",
              duration: 45,
              is_free: true,
              video_url: "#"
            },
            {
              id: 2,
              title: "Ancient Indian History - Part 2", 
              description: "Vedic Period and Cultural Developments",
              duration: 50,
              is_free: false,
              video_url: "#"
            },
            {
              id: 3,
              title: "Medieval Indian History",
              description: "Delhi Sultanate and Mughal Empire",
              duration: 55,
              is_free: false,
              video_url: "#"
            }
          ],
          notes: [
            {
              id: 1,
              title: "History Notes - Ancient India",
              content: "Comprehensive notes on Ancient History",
              is_free: true
            },
            {
              id: 2,
              title: "History Notes - Medieval India",
              content: "Detailed notes on Medieval period",
              is_free: false
            }
          ],
          quizzes: [
            {
              id: 1,
              title: "Ancient History Quiz",
              description: "Test your knowledge on Ancient India",
              is_free: false
            }
          ]
        },
        {
          id: 2,
          title: "Geography Module",
          description: "Physical & Human Geography",
          order_index: 2,
          is_free: false,
          lectures: [
            {
              id: 4,
              title: "Physical Geography - Part 1",
              description: "Earth's Structure and Composition",
              duration: 40,
              is_free: false,
              video_url: "#"
            },
            {
              id: 5,
              title: "Physical Geography - Part 2",
              description: "Climate and Weather Systems",
              duration: 48,
              is_free: false,
              video_url: "#"
            }
          ],
          notes: [
            {
              id: 3,
              title: "Geography Notes - Physical",
              content: "Complete notes on Physical Geography",
              is_free: false
            }
          ],
          quizzes: [
            {
              id: 2,
              title: "Geography Quiz",
              description: "Test your geographical knowledge",
              is_free: false
            }
          ]
        }
      ];

      // Mock progress data with proper typing
      const mockProgress: Record<number, number> = {
        1: 100, // lecture 1 completed
        2: 45,  // lecture 2 45% complete
        3: 0,   // lecture 3 not started
        4: 0,   // lecture 4 not started
        5: 0    // lecture 5 not started
      };

      setCourse(mockCourse);
      setModules(mockModules);
      
      // Set initial module and lecture
      if (mockModules.length > 0) {
        setCurrentModule(mockModules[0]);
        if (mockModules[0].lectures && mockModules[0].lectures.length > 0) {
          setCurrentLecture(mockModules[0].lectures[0]);
        }
      }
      setUserProgress(mockProgress);
    } catch (err) {
      console.error('Error fetching course data:', err);
      setError('Failed to load course data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    } else {
      setError('Invalid course ID provided');
      setLoading(false);
    }
  }, [courseId, fetchCourseData]);

  const handleProgress = useCallback(async (lectureId: number, progress: number) => {
    try {
      console.log(`Updating progress for lecture ${lectureId}: ${progress}%`);
      
      setUserProgress(prev => ({
        ...prev,
        [lectureId]: Math.min(Math.max(Math.round(progress), 0), 100) // Ensure progress is between 0-100
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, []);

  const handleLectureComplete = useCallback(async (lectureId: number) => {
    await handleProgress(lectureId, 100);
  }, [handleProgress]);

  const calculateModuleProgress = useCallback((module: Module) => {
    if (!module.lectures || module.lectures.length === 0) return 0;
    
    const totalProgress = module.lectures.reduce((sum, lecture) => {
      return sum + (userProgress[lecture.id] || 0);
    }, 0);
    
    return Math.round(totalProgress / module.lectures.length);
  }, [userProgress]);

  // Navigation functions
  const getAllLectures = useCallback(() => {
    return modules.flatMap(module => 
      module.lectures.map(lecture => ({ ...lecture, moduleId: module.id }))
    );
  }, [modules]);

  const navigateToLecture = useCallback((direction: 'prev' | 'next') => {
    if (!currentLecture) return;
    
    const allLectures = getAllLectures();
    const currentIndex = allLectures.findIndex(lecture => lecture.id === currentLecture.id);
    
    if (currentIndex === -1) return;
    
    let targetIndex;
    if (direction === 'prev') {
      targetIndex = currentIndex - 1;
    } else {
      targetIndex = currentIndex + 1;
    }
    
    if (targetIndex >= 0 && targetIndex < allLectures.length) {
      const targetLecture = allLectures[targetIndex];
      const targetModule = modules.find(m => m.id === targetLecture.moduleId);
      
      if (targetModule) {
        setCurrentModule(targetModule);
        setCurrentLecture(targetLecture);
      }
    }
  }, [currentLecture, getAllLectures, modules]);

  const handleModuleSelect = useCallback((module: Module) => {
    setCurrentModule(module);
    // Set first accessible lecture as current
    const firstAccessibleLecture = module.lectures.find(lecture => 
      canAccess(lecture.is_free ? 'free' : 'premium')
    );
    if (firstAccessibleLecture) {
      setCurrentLecture(firstAccessibleLecture);
    }
  }, [canAccess]);

  const handleLectureSelect = useCallback((lecture: Lecture) => {
    const canWatch = canAccess(lecture.is_free ? 'free' : 'premium');
    if (canWatch) {
      setCurrentLecture(lecture);
    }
  }, [canAccess]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Course</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchCourseData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No course data
  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h3>
          <p className="text-gray-600">The requested course could not be found.</p>
        </div>
      </div>
    );
  }

  const allLectures = getAllLectures();
  const currentLectureIndex = currentLecture ? 
    allLectures.findIndex(lecture => lecture.id === currentLecture.id) : -1;
  const hasPrevLecture = currentLectureIndex > 0;
  const hasNextLecture = currentLectureIndex < allLectures.length - 1;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-blue-100 mb-4">{course.description}</p>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            {modules.length} Modules
          </span>
          <span className="flex items-center">
            <Play className="w-5 h-5 mr-2" />
            {modules.reduce((acc, mod) => acc + (mod.lectures ? mod.lectures.length : 0), 0)} Lectures
          </span>
          <span className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
            <span className="text-sm">
              Subscription: <strong className="capitalize">{userSubscription}</strong>
            </span>
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar - Course Content */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Course Content</h2>
              <button
                onClick={() => setUserSubscription(userSubscription === 'free' ? 'premium' : 'free')}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
              >
                Toggle {userSubscription === 'free' ? 'Premium' : 'Free'}
              </button>
            </div>
            
            <div className="space-y-4">
              {modules.map((module) => {
                const moduleProgress = calculateModuleProgress(module);
                const isCurrentModule = currentModule?.id === module.id;
                
                return (
                  <div key={module.id} className="border rounded-lg overflow-hidden">
                    <div 
                      className={`p-4 cursor-pointer transition-colors ${
                        isCurrentModule ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleModuleSelect(module)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">{module.title}</h3>
                        <span className="text-xs text-gray-500">{moduleProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${moduleProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{module.description}</p>
                    </div>
                    
                    {isCurrentModule && (
                      <div className="border-t">
                        {/* Lectures */}
                        {module.lectures && module.lectures.length > 0 && (
                          <div>
                            <div className="bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700">
                              Lectures ({module.lectures.length})
                            </div>
                            {module.lectures.map((lecture) => {
                              const progress = userProgress[lecture.id] || 0;
                              const isCompleted = progress >= 90;
                              const canWatch = canAccess(lecture.is_free ? 'free' : 'premium');
                              const isCurrentLecture = currentLecture?.id === lecture.id;
                              
                              return (
                                <div
                                  key={lecture.id}
                                  className={`p-3 border-b cursor-pointer transition-colors flex items-center ${
                                    isCurrentLecture ? 'bg-blue-100 border-blue-200' : 'hover:bg-blue-50'
                                  } ${!canWatch ? 'opacity-60' : ''}`}
                                  onClick={() => handleLectureSelect(lecture)}
                                >
                                  <div className="flex items-center flex-1">
                                    {!canWatch ? (
                                      <Lock className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                                    ) : isCompleted ? (
                                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                                    ) : (
                                      <Play className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                                    )}
                                    
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-800 truncate">
                                        {lecture.title}
                                      </p>
                                      <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {lecture.duration} min
                                        {!lecture.is_free && (
                                          <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs">
                                            Premium
                                          </span>
                                        )}
                                      </div>
                                      {progress > 0 && progress < 90 && (
                                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                          <div 
                                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Notes */}
                        {module.notes && module.notes.length > 0 && (
                          <div>
                            <div className="bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700">
                              Notes ({module.notes.length})
                            </div>
                            {module.notes.map((note) => {
                              const canView = canAccess(note.is_free ? 'free' : 'premium');
                              return (
                                <div 
                                  key={note.id} 
                                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 flex items-center ${
                                    !canView ? 'opacity-60' : ''
                                  }`}
                                >
                                  {!canView ? (
                                    <Lock className="w-4 h-4 text-gray-400 mr-3" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-gray-500 mr-3" />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{note.title}</p>
                                    {!note.is_free && (
                                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded mt-1 inline-block">
                                        Premium
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Quizzes */}
                        {module.quizzes && module.quizzes.length > 0 && (
                          <div>
                            <div className="bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700">
                              Quizzes ({module.quizzes.length})
                            </div>
                            {module.quizzes.map((quiz) => {
                              const canAccess_ = canAccess(quiz.is_free ? 'free' : 'premium');
                              return (
                                <div 
                                  key={quiz.id} 
                                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 flex items-center ${
                                    !canAccess_ ? 'opacity-60' : ''
                                  }`}
                                >
                                  {!canAccess_ ? (
                                    <Lock className="w-4 h-4 text-gray-400 mr-3" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 text-purple-500 mr-3" />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{quiz.title}</p>
                                    <p className="text-xs text-gray-600">{quiz.description}</p>
                                    {!quiz.is_free && (
                                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded mt-1 inline-block">
                                        Premium
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {currentLecture ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Video Player */}
              <VideoPlayer 
                lecture={currentLecture}
                onProgress={handleProgress}
                onComplete={handleLectureComplete}
              />
              
              {/* Lecture Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentLecture.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentLecture.duration} min
                    </span>
                    {!currentLecture.is_free && (
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{currentLecture.description}</p>
                
                {/* Progress Indicator */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Your Progress</span>
                    <span className="text-sm text-gray-600">
                      {userProgress[currentLecture.id] || 0}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${userProgress[currentLecture.id] || 0}%` }}
                    />
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <button 
                    onClick={() => navigateToLecture('prev')}
                    disabled={!hasPrevLecture}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      hasPrevLecture 
                        ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Lecture
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Lecture {currentLectureIndex + 1} of {allLectures.length}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => navigateToLecture('next')}
                    disabled={!hasNextLecture}
                    className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                      hasNextLecture 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next Lecture
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a Lecture to Begin
              </h3>
              <p className="text-gray-600">
                Choose a lecture from the sidebar to start your learning journey
              </p>
              {modules.length > 0 && (
                <button
                  onClick={() => handleModuleSelect(modules[0])}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start First Module
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;