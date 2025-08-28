// components/mock-tests/TestList.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { MockTest } from '@/types/test';
import TestCard from './TestCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function TestList() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [userAttempts, setUserAttempts] = useState<Record<string, number>>({});
  const [averageScores, setAverageScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    fetchTests();
    if (user) {
      fetchUserAttempts();
    }
  }, [user]);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAttempts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_test_attempts')
        .select('mock_test_id, percentage')
        .eq('user_id', user.id);

      if (error) throw error;

      const attemptsCount: Record<string, number> = {};
      const scores: Record<string, number[]> = {};

      data?.forEach(attempt => {
        const testId = attempt.mock_test_id;
        attemptsCount[testId] = (attemptsCount[testId] || 0) + 1;
        
        if (!scores[testId]) scores[testId] = [];
        scores[testId].push(attempt.percentage);
      });

      // Calculate average scores
      const avgScores: Record<string, number> = {};
      Object.entries(scores).forEach(([testId, percentages]) => {
        avgScores[testId] = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
      });

      setUserAttempts(attemptsCount);
      setAverageScores(avgScores);
    } catch (error) {
      console.error('Error fetching user attempts:', error);
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || test.category === categoryFilter;
    const matchesTier = tierFilter === 'all' || test.tier === tierFilter;
    
    return matchesSearch && matchesCategory && matchesTier;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="upsc">UPSC</SelectItem>
              <SelectItem value="ssc">SSC</SelectItem>
              <SelectItem value="banking">Banking</SelectItem>
              <SelectItem value="railway">Railway</SelectItem>
              <SelectItem value="defense">Defense</SelectItem>
              <SelectItem value="state-pcs">State PCS</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Access" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Test Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              userAttempts={userAttempts[test.id] || 0}
              averageScore={averageScores[test.id]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tests found matching your criteria</p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setTierFilter('all');
            }}
            variant="outline"
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}