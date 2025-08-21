// 11. Homepage Update with Labs CTA
// components/LabsCTA.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export const LabsCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={`py-16 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experience the Future of Learning
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Try our interactive AI-powered labs - no signup required
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold mb-2">AI Flashcards</h3>
              <p className="text-sm text-blue-100">
                Generate intelligent flashcards from any topic instantly
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-2">🎤</div>
              <h3 className="font-semibold mb-2">Mock Interviews</h3>
              <p className="text-sm text-blue-100">
                Practice UPSC interviews with AI-powered simulation
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-2">Smart Analytics</h3>
              <p className="text-sm text-blue-100">
                Get insights into your learning patterns and progress
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/labs">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105">
                Try Labs Free
              </button>
            </Link>
            <Link href="/labs/flashcard-generator">
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                Quick Demo
              </button>
            </Link>
          </div>
          
          <p className="text-sm text-blue-100 mt-4">
            ✨ No signup required for basic labs • Instant access
          </p>
        </div>
      </div>
    </section>
  );
};