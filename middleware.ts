import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect /admin to our new professional admin panel
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin-dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin'],
};