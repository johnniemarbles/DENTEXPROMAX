
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl
  
  // 1. PUBLIC ROUTES (Allow everyone)
  const isPublic = 
    pathname === '/' || 
    pathname.startsWith('/login') || 
    pathname.startsWith('/register') || 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static');

  if (isPublic) return NextResponse.next();

  // 2. SHARED ROUTES (Allow Authenticated Users of ANY role)
  // Clinic pages must be visible to Pros (to edit) and Patients (to book)
  const isShared = pathname.startsWith('/clinic') || pathname.startsWith('/profile');

  // 3. IF NO TOKEN: Redirect to Login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 4. DECODE ROLE
  const role = parseJwtRole(token);

  // 5. ROLE ENFORCEMENT (The "Firewall")
  
  // A. Protect PATIENT routes
  if (pathname.startsWith('/patient') && role !== 'patient') {
    // If a PRO tries to go here, bounce them to PRO Dashboard
    return NextResponse.redirect(new URL('/pro/dashboard', request.url));
  }

  // B. Protect PRO routes
  if (pathname.startsWith('/pro') && role !== 'pro' && role !== 'pro_candidate') {
    // If a PATIENT tries to go here, bounce them to PATIENT Dashboard
    return NextResponse.redirect(new URL('/patient/dashboard', request.url));
  }

  // 6. ALLOW SHARED & MATCHING ROUTES
  return NextResponse.next();
}

// Helper: robust JWT decoder for Edge Runtime
function parseJwtRole(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const data = JSON.parse(jsonPayload);
    // ADAPT THIS: Check if your token uses 'role', 'userType', or 'scope'
    return data.global_role || data.role || data.userType; 
  } catch (e) {
    return null; // Invalid token
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
