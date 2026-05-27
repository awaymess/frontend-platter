import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password'];

function isPublicRoute(pathname: string): boolean {
  // Remove locale prefix
  const cleanPath = pathname.replace(/^\/(th|en)/, '') || '/';
  return publicRoutes.some((route) => cleanPath.startsWith(route));
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-page routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check if auth middleware should be disabled via env
  if (process.env.DISABLE_AUTH_MIDDLEWARE === 'true') {
    return intlMiddleware(request);
  }

  // Check auth for protected routes
  const accessToken = request.cookies.get('access_token')?.value;

  if (!isPublicRoute(pathname) && !accessToken) {
    // Get locale from pathname or default
    const locale = pathname.match(/^\/(th|en)/)?.[1] || routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated user tries to access login, redirect to dashboard
  if (isPublicRoute(pathname) && accessToken) {
    const locale = pathname.match(/^\/(th|en)/)?.[1] || routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Apply i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(th|en)/:path*'],
};
