// components/mock-tests/TestCard.tsx
'use client';

import { MockTest } from '@/types/test';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Users, Lock, Star } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

interface TestCardProps {
  test: MockTest;
  userAttempts?: number;
  averageScore?: number;
}

export default function TestCard({ test, userAttempts = 0, averageScore }: TestCardProps) {
  const { hasAccess } = useAuth();
  const canAccess = hasAccess(test.tier);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{test.title}</CardTitle>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant={test.tier === 'free' ? 'secondary' : canAccess ? 'default' : 'destructive'}>
              {test.tier === 'premium' && !canAccess && <Lock className="h-3 w-3 mr-1" />}
              {test.tier === 'free' ? 'Free' : 'Premium'}
            </Badge>
            {averageScore && (
              <div className="flex items-center text-sm text-yellow-600">
                <Star className="h-3 w-3 mr-1" />
                {averageScore.toFixed(1)}%
              </div>
            )}
          </div>
        </div>
        
        {test.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{test.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="flex flex-col items-center">
            <FileText className="h-4 w-4 text-blue-500 mb-1" />
            <span className="text-xs text-gray-600">{test.total_questions} Questions</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Clock className="h-4 w-4 text-green-500 mb-1" />
            <span className="text-xs text-gray-600">{test.time_limit} mins</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Users className="h-4 w-4 text-purple-500 mb-1" />
            <span className="text-xs text-gray-600">{test.total_marks} marks</span>
          </div>
        </div>
        
        {test.category && (
          <Badge variant="outline" className="w-fit">
            {test.category.toUpperCase()}
          </Badge>
        )}
        
        {userAttempts > 0 && (
          <div className="text-sm text-gray-600">
            Attempts: {userAttempts}
          </div>
        )}
        
        <div className="pt-2">
          {canAccess ? (
            <Link href={`/mock-tests/${test.id}`}>
              <Button className="w-full">
                {userAttempts > 0 ? 'Retake Test' : 'Start Test'}
              </Button>
            </Link>
          ) : (
            <div className="space-y-2">
              <Button className="w-full" variant="outline" disabled>
                <Lock className="h-4 w-4 mr-2" />
                Premium Required
              </Button>
              <Link href="/pricing">
                <Button className="w-full" size="sm">
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
