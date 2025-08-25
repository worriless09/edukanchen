// components/exam-categories-section.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Trophy } from 'lucide-react';

const examCategories = [
  {
    title: 'UPSC Civil Services',
    description: 'Complete preparation with AI-powered mock interviews and current affairs analysis',
    students: '5,000+',
    duration: '18 months',
    successRate: '15%',
    color: 'bg-blue-600',
    subjects: ['Prelims', 'Mains', 'Interview', 'Current Affairs'],
    popular: true
  },
  {
    title: 'SSC Exams',
    description: 'CGL, CHSL, MTS preparation with smart flashcards and adaptive learning',
    students: '8,000+',
    duration: '12 months',
    successRate: '25%',
    color: 'bg-green-600',
    subjects: ['Quantitative', 'Reasoning', 'English', 'GK'],
    popular: false
  },
  {
    title: 'Banking Exams',
    description: 'IBPS, SBI PO/Clerk with AI-generated questions and performance tracking',
    students: '6,500+',
    duration: '10 months',
    successRate: '30%',
    color: 'bg-purple-600',
    subjects: ['Banking Awareness', 'Reasoning', 'Quantitative', 'English'],
    popular: false
  }
];

export function ExamCategoriesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Choose Your Exam Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Specialized AI-powered preparation for India's most competitive exams
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {examCategories.map((exam, index) => (
            <Card key={index} className={`relative overflow-hidden border-0 shadow-xl ${exam.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {exam.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
              )}
              
              <div className={`h-2 ${exam.color}`} />
              
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h3>
                  <p className="text-gray-600">{exam.description}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                    <div className="font-semibold text-gray-900">{exam.students}</div>
                    <div className="text-gray-500">Students</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                    <div className="font-semibold text-gray-900">{exam.duration}</div>
                    <div className="text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <Trophy className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                    <div className="font-semibold text-gray-900">{exam.successRate}</div>
                    <div className="text-gray-500">Success Rate</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-900">Key Subjects:</div>
                  <div className="flex flex-wrap gap-2">
                    {exam.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className={`w-full ${exam.color} hover:opacity-90`}>
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
