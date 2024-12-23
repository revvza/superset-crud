import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as cookie from 'cookie';

export function middleware(request: NextRequest) {
  const cookiesHeader = request.headers.get('cookie') || '';
  const cookies = cookie.parse(cookiesHeader);

  const role = cookies.role || null; // Mendapatkan role dari cookie
  const frames = cookies.frames ? JSON.parse(cookies.frames) : []; // Mendapatkan frames dari cookie
  const pathname = request.nextUrl.pathname;

  console.log('Cookies in middleware:', cookies);
  console.log('Role in middleware:', role);
  console.log('Frames in middleware:', frames);
  console.log('Request path:', pathname);

  // Halaman login tidak perlu memeriksa cookies
  if (pathname === '/') {
    return NextResponse.next(); // Jika di halaman login, lanjutkan tanpa perubahan
  }

  // Jika belum login (belum ada cookies role dan frames), redirect ke halaman login
  if (!role || frames.length === 0) {
    console.log('User not logged in, redirecting to login...');
    return NextResponse.redirect(new URL('/', request.url)); // Redirect ke halaman login
  }

  // Jika role admin, hanya bisa mengakses /dashboard
  if (role === 'admin') {
    if (pathname.startsWith('/dashboard')) {
      console.log('Admin accessing dashboard, proceeding...');
      return NextResponse.next(); // Admin bisa lanjut ke dashboard
    } else {
      console.log('Admin path mismatch, redirecting to dashboard...');
      return NextResponse.redirect(new URL('/dashboard', request.url)); // Redirect ke dashboard
    }
  }

  // Jika role viewer dan ada frames
  if (role && role.startsWith('viewer')) {
    if (pathname.startsWith('/frameview')) {
      if (frames.length > 0) {
        console.log('Viewer1 accessing frameview, proceeding...');
        return NextResponse.next(); // Viewer1 bisa mengakses frameview jika ada frames
      } else {
        console.log('Viewer1 frames empty, redirecting to login...');
        return NextResponse.redirect(new URL('/', request.url)); // Redirect ke login jika tidak ada frames
      }
    } else {
      console.log('Viewer1 path mismatch, redirecting to frameview...');
      return NextResponse.redirect(new URL('/frameview', request.url)); // Redirect ke frameview jika bukan path frameview
    }
  }

  // Fallback jika role atau path tidak valid
  console.log('Invalid role or path, redirecting to login...');
  return NextResponse.redirect(new URL('/', request.url)); // Redirect ke halaman login jika role atau path tidak valid
}

export const config = {
  matcher: ['/dashboard', '/frameview', '/'], // Paths yang relevan
};
