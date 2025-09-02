// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get user with proper error handling
  const { data: { user }, error } = await supabase.auth.getUser()

  // Protected page routes
  const protectedRoutes = [
    '/dashboard', '/profile', '/settings', '/courses', '/videos', 
    '/flashcards', '/mock-tests', '/quiz', '/study-materials', 
    '/notes', '/pyqs', '/current-affairs', '/daily-updates', 
    '/ai-analyzer', '/progress', '/learning-paths'
  ]
  
  // Protected API routes
  const protectedApiRoutes = [
    '/api/analytics', '/api/progress', '/api/courses', '/api/user'
  ]
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Auth routes that should redirect if already logged in
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

  // Handle protected API routes
  if (isProtectedApiRoute && (error || !user)) {
    return NextResponse.json(
      { error: 'Unauthorized - Please login again' }, 
      { status: 401 }
    )
  }

  // Handle protected page routes
  if (isProtectedRoute && (error || !user)) {
    // Add the current URL as a redirect parameter
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Handle auth routes when already logged in
  if (isAuthRoute && user && !error) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
