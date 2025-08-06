import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Redirect all admin routes to unified admin panel
  if (pathname === '/admin' || pathname === '/admin-dashboard' || pathname === '/marketing-dashboard') {
    return NextResponse.redirect(new URL('/admin-panel', request.url));
  }

  // Redirect old Payload admin routes
  if (pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/')) {
    return NextResponse.redirect(new URL('/admin-panel', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/admin-dashboard', '/marketing-dashboard', '/api/admin/:path*'],
};