import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/customer', '/worker', '/admin'];

// Paths that redirect authenticated users away
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for refresh token in HTTP-only cookie
  const refreshToken = request.cookies.get('refresh_token');

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // If trying to access protected route without refresh token, redirect to login
  if (isProtectedPath && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access auth route with refresh token, redirect to homepage
  if (isAuthPath && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // For future role-based redirects when dashboards exist:
  // - CUSTOMER -> /customer/dashboard
  // - WORKER -> /worker/dashboard  
  // - ADMIN -> /admin/dashboard

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
