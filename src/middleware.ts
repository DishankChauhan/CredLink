import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get Firebase auth session cookie
  const session = request.cookies.get('firebase-auth-session');
  
  // Define protected API paths
  const isProtectedApiPath = 
    request.nextUrl.pathname.startsWith('/api/credential') || 
    request.nextUrl.pathname.startsWith('/api/issuer') || 
    request.nextUrl.pathname.startsWith('/api/admin');
  
  // Define public API paths that don't need authentication
  const isPublicApiPath = 
    request.nextUrl.pathname.startsWith('/api/auth') || 
    request.nextUrl.pathname === '/api/credential/validate';
  
  // For protected API routes, check for session
  if (isProtectedApiPath && !isPublicApiPath && !session) {
    return NextResponse.json(
      { error: 'Unauthorized: Authentication required' },
      { status: 401 }
    );
  }
  
  return NextResponse.next();
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    '/api/credential/:path*',
    '/api/issuer/:path*',
    '/api/admin/:path*',
    // Exclude public endpoints from authentication check
    '/((?!api/auth|api/credential/validate).*)',
  ],
}; 