import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Redirect old admin routes to unified admin panel
  if (pathname === '/admin-dashboard' || pathname === '/marketing-dashboard') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin-dashboard', '/marketing-dashboard'],
};