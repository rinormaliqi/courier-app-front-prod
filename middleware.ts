// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { JwtClaims } from "@/src/types/jwt";

// Public routes that don't require authentication
const publicRoutes = ["/login", "/401", "/403", "/502"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for public routes and static files
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  let accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  let newAccessToken: string | null = null;
  let newRefreshToken: string | null = null;

  // Try to refresh tokens if access token is expired
  if (!isTokenValid(accessToken) && refreshToken) {
    try {
      const response = await fetch("http://localhost:8080/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const tokenData = await response.json();
        newAccessToken = tokenData.access_token;
        newRefreshToken = tokenData.refresh_token;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }

  // Redirect to login if no valid tokens
  if (!accessToken && !newAccessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Get role from token
  const token = newAccessToken || accessToken;
  const decoded = decodeJwt(token!) as JwtClaims;

  // Extract roles from token - try both locations
  const roles = decoded.resource_access?.courier?.roles || decoded.roles || [];

  // Role-based access control
  if (pathname.startsWith("/dashboard/admin") && !roles.includes("Admin")) {
    return NextResponse.redirect(new URL("/403", req.url));
  }
  if (pathname.startsWith("/dashboard/manager") && !roles.includes("Manager")) {
    return NextResponse.redirect(new URL("/403", req.url));
  }
  if (pathname.startsWith("/dashboard/courier") && !roles.includes("Courier")) {
    return NextResponse.redirect(new URL("/403", req.url));
  }
  if (pathname.startsWith("/") && !roles.includes("Courier")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const response = NextResponse.next();

  // Set new tokens if refreshed
  if (newAccessToken && newRefreshToken) {
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      maxAge: 1800,
      path: "/",
    });
    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      maxAge: 86400,
      path: "/",
    });
  }

  return response;
}

function isTokenValid(token?: string): boolean {
  if (!token) return false;

  try {
    const decoded = decodeJwt(token) as JwtClaims;
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
