// 12. Middleware for Lab Access Control
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if accessing premium labs
  if (pathname.startsWith('/labs/')) {
    const labId = pathname.split('/')[2];
    const premiumLabs = [
      'essay-writing',
      'daf-questions', 
      'group-discussion',
      'sectional-tests',
      'mock-tests',
      'weakness-identifier'
    ];
    
    if (premiumLabs.includes(labId)) {
      // Check user subscription status
      const userTier = request.cookies.get('user_tier')?.value;
      
      if (userTier !== 'pro') {
        // Redirect to pricing page
        return NextResponse.redirect(new URL('/pricing?lab=' + labId, request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/labs/:path*']
};