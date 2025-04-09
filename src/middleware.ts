import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicPaths = [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify-email",
    "/issue-details",
  ];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if the path is for the API
  const isApiPath = pathname.startsWith("/api");

  // Admin routes that require admin role
  const adminPaths = ["/admin"];
  const isAdminPath = adminPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!session) {
    // If not authenticated and trying to access a protected route
    // if (!isPublicPath && !isApiPath) {
    //   const signInUrl = new URL("/sign-in", req.url);
    //   signInUrl.searchParams.set("callbackUrl", pathname);
    //   return NextResponse.redirect(signInUrl);
    // }

    // Let public routes and API routes pass
    return NextResponse.next();
  }

  // If authenticated but accessing auth pages (sign-in, sign-up, etc.)
  if (
    session &&
    (pathname === "/sign-in" ||
      pathname === "/sign-up" ||
      pathname === "/verify-email")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Check admin access for admin routes
  if (isAdminPath && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for:
    // 1. Files in the public directory
    // 2. API routes that handle auth themselves
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
