import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// REQUIRED: These functions are imported in your pages and must be exported
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0, // For Indian rupees, typically no decimals
  }).format(amount);
}

// REQUIRED: This function is imported in app/flashcards/page.tsx
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
 
  // Handle future dates
  if (diffInSeconds < 0) {
    const futureDiff = Math.abs(diffInSeconds);
    if (futureDiff < 60) return 'in a few seconds';
    if (futureDiff < 3600) return `in ${Math.floor(futureDiff / 60)} minutes`;
    if (futureDiff < 86400) return `in ${Math.floor(futureDiff / 3600)} hours`;
    return `in ${Math.floor(futureDiff / 86400)} days`;
  }
 
  // Past dates
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
 
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
 
  return 'Just now';
}

// Additional utility functions for your UPSC/exam prep platform
export function formatExamDate(date: Date | string): string {
  const examDate = typeof date === 'string' ? new Date(date) : date;
  return examDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateDaysRemaining(examDate: Date | string): number {
  const now = new Date();
  const exam = typeof examDate === 'string' ? new Date(examDate) : examDate;
  const diffTime = exam.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function formatStudyTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
 
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
 
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
 
  return `${hours}h ${remainingMinutes}m`;
}

// Bonus utility functions for competitive exam platforms
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatScore(current: number, total: number): string {
  return `${current}/${total}`;
}

export function getGradeFromPercentage(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  return 'F';
}

export function formatRank(rank: number): string {
  const suffix = getRankSuffix(rank);
  return `${rank}${suffix}`;
}

function getRankSuffix(rank: number): string {
  if (rank >= 11 && rank <= 13) return 'th';
  
  const lastDigit = rank % 10;
  switch (lastDigit) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}