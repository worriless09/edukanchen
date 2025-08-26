// app/api/flashcards/review/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateNextReview } from '@/lib/algorithms/simple-spaced-repetition';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      flashcard_id, 
      quality, 
      response_time, 
      confidence_level, 
      hints_used 
    } = body;

    // Validate input
    if (!flashcard_id || quality === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate quality range (0-5)
    if (quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: 'Quality must be between 0 and 5' },
        { status: 400 }
      );
    }

    // Get current progress
    const { data: currentProgress, error: progressError } = await supabase
      .from('user_flashcard_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('flashcard_id', flashcard_id)
      .single();

    if (progressError && progressError.code !== 'PGRST116') {
      console.error('Error fetching progress:', progressError);
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    // Calculate next review using simple spaced repetition
    const reviewResult = calculateNextReview({
      quality,
      easeFactor: currentProgress?.ease_factor || 2.5,
      interval: currentProgress?.interval_days || 1,
      repetitions: currentProgress?.repetitions || 0
    });

    // Calculate success rate
    const totalReviews = (currentProgress?.total_reviews || 0) + 1;
    const successfulReviews = (currentProgress?.successful_reviews || 0) + (quality >= 3 ? 1 : 0);
    const successRate = successfulReviews / totalReviews;

    // Calculate average response time
    const currentAvgTime = currentProgress?.average_response_time || 0;
    const newAvgTime = currentAvgTime === 0 
      ? response_time 
      : (currentAvgTime * (totalReviews - 1) + response_time) / totalReviews;

    // Update progress in database
    const progressData = {
      user_id: user.id,
      flashcard_id,
      ease_factor: reviewResult.easeFactor,
      interval_days: reviewResult.interval,
      repetitions: reviewResult.repetitions,
      next_review_date: reviewResult.nextReviewDate.toISOString().split('T')[0],
      last_reviewed_at: new Date().toISOString(),
      total_reviews: totalReviews,
      successful_reviews: successfulReviews,
      success_rate: successRate,
      average_response_time: Math.round(newAvgTime),
      last_quality: quality,
      confidence_level: confidence_level || 0.5,
      hints_used: hints_used || 0
    };

    const { error: updateError } = await supabase
      .from('user_flashcard_progress')
      .upsert(progressData, {
        onConflict: 'user_id,flashcard_id'
      });

    if (updateError) {
      console.error('Error updating progress:', updateError);
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

    // Generate performance feedback
    const feedback = generatePerformanceFeedback(quality, successRate, reviewResult.interval);

    return NextResponse.json({
      success: true,
      next_review_date: reviewResult.nextReviewDate,
      interval_days: reviewResult.interval,
      ease_factor: reviewResult.easeFactor,
      repetitions: reviewResult.repetitions,
      success_rate: successRate,
      performance_feedback: feedback,
      study_analytics: {
        total_reviews: totalReviews,
        successful_reviews: successfulReviews,
        average_response_time: Math.round(newAvgTime),
        difficulty_trend: getDifficultyTrend(quality, currentProgress?.last_quality)
      }
    });

  } catch (error) {
    console.error('Review processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/flashcards/due/route.ts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('deck_id');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('user_flashcard_progress')
      .select(`
        *,
        flashcards (
          id,
          front_text,
          back_text,
          difficulty,
          tags,
          flashcard_decks (
            id,
            title,
            category
          )
        )
      `)
      .eq('user_id', user.id)
      .lte('next_review_date', new Date().toISOString().split('T')[0])
      .order('next_review_date', { ascending: true })
      .limit(limit);

    if (deckId) {
      query = query.eq('flashcards.deck_id', deckId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching due cards:', error);
      return NextResponse.json(
        { error: 'Failed to fetch due cards' },
        { status: 500 }
      );
    }

    // Process with simple prioritization
    const prioritizedCards = data?.map(progress => {
      const priorityScore = calculateSimplePriorityScore(progress);
      return {
        ...progress,
        priority_score: priorityScore,
        priority_reason: getSimplePriorityReason(progress)
      };
    }).sort((a, b) => b.priority_score - a.priority_score);

    return NextResponse.json({
      cards: prioritizedCards || [],
      total_due: prioritizedCards?.length || 0,
      high_priority_count: prioritizedCards?.filter(c => c.priority_score > 50).length || 0
    });

  } catch (error) {
    console.error('Error in due cards API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateSimplePriorityScore(progress: any): number {
  let score = 0;

  const daysOverdue = Math.max(0, 
    (Date.now() - new Date(progress.next_review_date).getTime()) / (1000 * 60 * 60 * 24)
  );
  score += Math.min(50, daysOverdue * 10);

  // Priority based on success rate
  if (progress.success_rate < 0.5) score += 30;
  if (progress.success_rate < 0.3) score += 20;

  // Priority based on ease factor (lower = harder = higher priority)
  if (progress.ease_factor < 2.0) score += 25;
  if (progress.ease_factor < 1.5) score += 15;

  // New cards or cards with few reviews get priority
  if (!progress.total_reviews || progress.total_reviews < 3) score += 20;

  return Math.round(score);
}

function getSimplePriorityReason(progress: any): string {
  const daysOverdue = Math.max(0, 
    (Date.now() - new Date(progress.next_review_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysOverdue > 2) return `${Math.ceil(daysOverdue)} days overdue`;
  if (progress.success_rate < 0.3) return "Very low success rate";
  if (progress.success_rate < 0.5) return "Low success rate";
  if (progress.ease_factor < 1.5) return "Very difficult card";
  if (progress.ease_factor < 2.0) return "Difficult card";
  if (!progress.total_reviews || progress.total_reviews < 3) return "New card";
  return "Regular review due";
}

function generatePerformanceFeedback(quality: number, successRate: number, interval: number): string {
  if (quality >= 4) {
    return "Excellent! Your understanding is strong. Keep up the great work!";
  } else if (quality === 3) {
    return "Good job! You're on the right track. A bit more practice will solidify this knowledge.";
  } else if (quality === 2) {
    return "You're getting there! This concept needs more attention. Don't worry, it's part of the learning process.";
  } else {
    return "This is a challenging concept for you. Consider reviewing the fundamentals or seeking additional resources.";
  }
}

function getDifficultyTrend(currentQuality: number, lastQuality?: number): 'improving' | 'stable' | 'declining' {
  if (!lastQuality) return 'stable';
  
  if (currentQuality > lastQuality) return 'improving';
  if (currentQuality < lastQuality) return 'declining';
  return 'stable';
}