// app/labs/mock-interview/page.tsx
'use client';
import { useState, useRef } from 'react';

const MockInterviewLab = () => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [interviewStage, setInterviewStage] = useState('not-started'); // 'not-started', 'personality', 'daf', 'current-affairs'
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startInterview = async () => {
    try {
      const response = await fetch('/api/labs/interview-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          stage: 'personality-test', 
          questionNumber: 1 
        })
      });
      const data = await response.json();
      setCurrentQuestion(data.question);
      setInterviewStage('personality');
      setQuestionNumber(1);
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  const submitAnswer = async () => {
    try {
      const response = await fetch('/api/labs/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          answer: userAnswer,
          examType: 'UPSC',
          stage: interviewStage
        })
      });
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error evaluating answer:', error);
    }
  };

  const nextQuestion = async () => {
    const nextQuestionNum = questionNumber + 1;
    try {
      const response = await fetch('/api/labs/interview-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          stage: interviewStage, 
          questionNumber: nextQuestionNum 
        })
      });
      const data = await response.json();
      setCurrentQuestion(data.question);
      setQuestionNumber(nextQuestionNum);
      setUserAnswer('');
      setFeedback('');
    } catch (error) {
      console.error('Error getting next question:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">UPSC Mock Interview</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Stage: {interviewStage}</span>
              <span>Question: {questionNumber}</span>
              <span className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                {isRecording ? 'Recording' : 'Not Recording'}
              </span>
            </div>
          </div>

          {interviewStage === 'not-started' && (
            <div className="text-center bg-white rounded-lg shadow-sm p-12">
              <h2 className="text-xl font-semibold mb-4">Ready to Start Your Mock Interview?</h2>
              <p className="text-gray-600 mb-6">
                This interview will simulate the UPSC personality test phase. 
                You'll be asked questions about your background, hobbies, and current affairs.
              </p>
              <button
                onClick={startInterview}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
              >
                Start Mock Interview
              </button>
            </div>
          )}

          {currentQuestion && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-blue-900">Question:</h2>
                <p className="text-blue-800 text-lg leading-relaxed">
                  {currentQuestion}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Your Answer:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
                
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim()}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    Submit Answer
                  </button>
                  
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      isRecording 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isRecording ? '⏹ Stop Recording' : '🎤 Record Answer'}
                  </button>
                  
                  {feedback && (
                    <button
                      onClick={nextQuestion}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next Question →
                    </button>
                  )}
                </div>
              </div>

              {feedback && (
                <div className="bg-green-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3 text-green-900">AI Feedback:</h2>
                  <div className="text-green-800 leading-relaxed">
                    {feedback}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterviewLab;