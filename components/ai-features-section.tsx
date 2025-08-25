// components/ai-features-section.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, BarChart3, Users, Zap, Target } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Arya AI Mentor',
    description: 'Your personal AI tutor available 24/7 for instant doubt clearing and personalized guidance.',
    color: 'bg-blue-500',
    demo: 'Try AI Chat'
  },
  {
    icon: Zap,
    title: 'Smart Flashcards',
    description: 'AI-generated flashcards with spaced repetition algorithm for maximum retention.',
    color: 'bg-green-500',
    demo: 'Generate Cards'
  },
  {
    icon: MessageSquare,
    title: 'Mock Interviews',
    description: 'AI-powered UPSC interview simulation with real-time feedback and improvement tips.',
    color: 'bg-purple-500',
    demo: 'Start Interview'
  },
  {
    icon: BarChart3,
    title: 'Learning Analytics',
    description: 'Advanced insights into your learning patterns, weak areas, and progress trends.',
    color: 'bg-orange-500',
    demo: 'View Analytics'
  },
  {
    icon: Target,
    title: 'Adaptive Learning',
    description: 'AI adjusts difficulty and topics based on your performance and learning speed.',
    color: 'bg-red-500',
    demo: 'See Adaptation'
  },
  {
    icon: Users,
    title: 'Current Affairs AI',
    description: 'AI analyzes daily news and creates exam-relevant questions and summaries.',
    color: 'bg-indigo-500',
    demo: 'Read Analysis'
  }
];

export function AIFeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Meet Your AI Study Companion
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionary AI features that adapt to your learning style and guarantee success in competitive exams
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                
                <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50">
                  {feature.demo}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
