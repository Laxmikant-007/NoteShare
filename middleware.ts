import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // User is authenticated, allow access
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    },
  },
);

// Define which routes are protected
export const config = {
  matcher: [
    "/explore/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/note/:path*",
    "/settings/:path*",
  ],
};
