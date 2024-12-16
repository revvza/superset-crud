import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as cookie from 'cookie';

export function middleware(request: NextRequest) {
  const cookiesHeader = request.headers.get('cookie') || '';
  const cookies = cookie.parse(cookiesHeader);

  const role = cookies.role||null; // Mendapatkan role dari cookie
  const frames = cookies.frames ? JSON.parse(cookies.frames) : []; // Mendapatkan frames dari cookie

  console.log("Cookies in middleware:", cookies);
  console.log("Role in middleware:", role);
  console.log("Frames in middleware:", frames);
  console.log("Request path:", request.nextUrl.pathname);

  // Cek jika role adalah admin dan path dimulai dengan /dashboard
  if (role === 'admin' && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log("Redirecting Admin to dashboard...");
    return NextResponse.next();
  } 
  // Cek jika role adalah viewer1 dan path dimulai dengan /frameview
  else if (role === 'viewer1' && request.nextUrl.pathname.startsWith('/frameview')) {
    if (frames.length > 0) {
      console.log("Frames available for viewer1, proceeding to frameview...");
      return NextResponse.next(); // Lanjutkan ke frameview jika frames tersedia
    } else {
      console.log("No frames available for viewer1, redirecting to login...");
      return NextResponse.redirect(new URL('/', request.url)); // Redirect ke login jika frames kosong
    }
  } 
  // Fallback untuk role atau path yang tidak valid
  else {
    console.log("Role or path mismatch, redirecting to login...");
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/dashboard', '/frameview'], // Path yang relevan
};