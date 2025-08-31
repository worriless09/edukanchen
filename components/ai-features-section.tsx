// components/ai-features-section.tsx - COMPLETE IMPLEMENTATION
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, TrendingUp, BookOpen, MessageSquare, Lightbulb, Clock } from 'lucide-react';
import Link from 'next/link';

export function AiFeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI Question Analysis",
      description: "Upload any question and get instant difficulty assessment, topic categorization, and study recommendations",
      link: "/ai-analyzer",
      badge: "Smart Analysis",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Auto Flashcard Generation",
      description: "Upload your notes and let AI create smart flashcards with spaced repetition scheduling",
      link: "/flashcards",
      badge: "AI Generated",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "PYQ Smart Answers",
      description: "Get AI-powered detailed answers and explanations for previous year questions",
      link: "/quiz",
      badge: "PYQ Focus",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Adaptive Learning Path",
      description: "AI tracks your performance and adjusts difficulty levels for optimal learning",
      link: "/dashboard",
      badge: "Personalized",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: BookOpen,
      title: "Study Material Parser",
      description: "Upload PDFs and documents - AI extracts key concepts and creates study guides",
      link: "/study-materials",
      badge: "Auto Extract",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: MessageSquare,
      title: "AI Study Assistant",
      description: "Chat with AI for doubt clarification, concept explanation, and study tips",
      link: "/ai-analyzer",
      badge: "24/7 Support",
      color: "from-teal-500 to-green-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Lightbulb className="h-4 w-4" />
            AI-Powered Learning
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionary AI Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Smart Learning</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of exam preparation with our advanced AI tools designed specifically for Indian competitive exams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <Link href={feature.link}>
                    <Button className="w-full group-hover:bg-blue-600 transition-colors">
                      Try Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Questions Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-gray-600">Flashcards Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Availability</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
              <Clock className="h-5 w-5 mr-2" />
              Start Your AI-Powered Journey
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
