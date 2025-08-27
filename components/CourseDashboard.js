import React, { useState, useEffect } from 'react';
import { BookOpen, Play, FileText, Clock, CheckCircle, Lock } from 'lucide-react';

const CourseDashboard = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState('free');

  // Mock function to simulate canAccess
  const canAccess = (contentType) => {
    if (contentType === 'free') return true;
    return userSubscription === 'premium';
  };

  // Mock video player component
  const VideoPlayer = ({ lecture, onProgress, onComplete }) => {
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
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <div className="text-white text-center">
          <Play className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <h3 className="text-xl font-semibold mb-2">{lecture.title}</h3>
          <p className="text-gray-300">Video Player - {lecture.duration} mins</p>
          <button 
            onClick={() => onComplete && onComplete(lecture.id)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Mark as Complete
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // Mock course data - replace with actual API calls
      const mockCourse = {
        id: courseId,
        title: "UPSC Civil Services Complete Course",
        description: "Comprehensive preparation for UPSC CSE with expert guidance",
        category: "upsc",
        is_premium: true
      };

      const mockModules = [
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
              description: "Indus Valley Civilization",
              duration: 45,
              is_free: true,
              video_url: "#"
            },
            {
              id: 2,
              title: "Ancient Indian History - Part 2", 
              description: "Vedic Period",
              duration: 50,
              is_free: false,
              video_url: "#"
            }
          ],
          notes: [
            {
              id: 1,
              title: "History Notes - Chapter 1",
              content: "Comprehensive notes on Ancient History",
              is_free: true
            }
          ],
          quizzes: [
            {
              id: 1,
              title: "History Quiz 1",
              description: "Test your knowledge",
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
              id: 3,
              title: "Physical Geography - Part 1",
              description: "Earth's Structure",
              duration: 40,
              is_free: false,
              video_url: "#"
            }
          ],
          notes: [],
          quizzes: []
        }
      ];

      // Mock progress data
      const mockProgress = {
        1: 100, // lecture 1 completed
        2: 45,  // lecture 2 45% complete
        3: 0    // lecture 3 not started
      };

      setCourse(mockCourse);
      setModules(mockModules);
      if (mockModules.length > 0) {
        setCurrentModule(mockModules[0]);
        if (mockModules[0].lectures && mockModules[0].lectures.length > 0) {
          setCurrentLecture(mockModules[0].lectures[0]);
        }
      }
      setUserProgress(mockProgress);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = async (lectureId, progress) => {
    try {
      console.log(`Updating progress for lecture ${lectureId}: ${progress}%`);
      
      setUserProgress(prev => ({
        ...prev,
        [lectureId]: Math.round(progress)
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleLectureComplete = async (lectureId) => {
    await handleProgress(lectureId, 100);
  };

  const calculateModuleProgress = (module) => {
    if (!module.lectures || module.lectures.length === 0) return 0;
    
    const completedLectures = module.lectures.filter(lecture => 
      userProgress[lecture.id] >= 90
    ).length;
    
    return Math.round((completedLectures / module.lectures.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{course && course.title}</h1>
        <p className="text-blue-100 mb-4">{course && course.description}</p>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            {modules.length} Modules
          </span>
          <span className="flex items-center">
            <Play className="w-5 h-5 mr-2" />
            {modules.reduce((acc, mod) => acc + (mod.lectures ? mod.lectures.length : 0), 0)} Lectures
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar - Course Content */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Course Content</h2>
            
            <div className="space-y-4">
              {modules.map((module, moduleIndex) => {
                const moduleProgress = calculateModuleProgress(module);
                
                return (
                  <div key={module.id} className="border rounded-lg overflow-hidden">
                    <div 
                      className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => setCurrentModule(module)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">{module.title}</h3>
                        <span className="text-xs text-gray-500">{moduleProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full"
                          style={{ width: `${moduleProgress}%` }}
                        />
                      </div>
                    </div>
                    
                    {currentModule && currentModule.id === module.id && (
                      <div className="border-t">
                        {/* Lectures */}
                        {module.lectures && module.lectures.map((lecture, lectureIndex) => {
                          const progress = userProgress[lecture.id] || 0;
                          const isCompleted = progress >= 90;
                          const canWatch = canAccess(lecture.is_free ? 'free' : 'premium');
                          
                          return (
                            <div
                              key={lecture.id}
                              className={`p-3 border-b cursor-pointer hover:bg-blue-50 flex items-center ${
                                currentLecture && currentLecture.id === lecture.id ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => canWatch && setCurrentLecture(lecture)}
                            >
                              <div className="flex items-center flex-1">
                                {!canWatch ? (
                                  <Lock className="w-4 h-4 text-gray-400 mr-3" />
                                ) : isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                                ) : (
                                  <Play className="w-4 h-4 text-blue-500 mr-3" />
                                )}
                                
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">
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
                                        className="bg-blue-600 h-1 rounded-full"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Notes */}
                        {module.notes && module.notes.map((note) => (
                          <div key={note.id} className="p-3 border-b cursor-pointer hover:bg-gray-50 flex items-center">
                            <FileText className="w-4 h-4 text-gray-500 mr-3" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{note.title}</p>
                              {!note.is_free && (
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                                  Premium
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Quizzes */}
                        {module.quizzes && module.quizzes.map((quiz) => (
                          <div key={quiz.id} className="p-3 border-b cursor-pointer hover:bg-gray-50 flex items-center">
                            <CheckCircle className="w-4 h-4 text-purple-500 mr-3" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{quiz.title}</p>
                              {!quiz.is_free && (
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                                  Premium
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
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
                <div className="bg-gray-50 rounded-lg p-4">
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
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <button className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <span className="mr-2">←</span>
                    Previous Lecture
                  </button>
                  
                  <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Next Lecture
                    <span className="ml-2">→</span>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;