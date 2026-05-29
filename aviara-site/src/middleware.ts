import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The previous WordPress site left a trail of URLs in Google's index
// (wp-admin, wp-content, wp-json, author/category/tag archives, stray .php
// probes). Letting them fall through to our Next.js 404 means Google keeps
// retrying them for months and they linger in Search Console's index report.
//
// Returning 410 Gone instead is the explicit "permanently deleted, stop
// tracking this" signal — Google drops 410s from the report far faster than
// 404s. The matcher below only ever runs on these dead WordPress shapes, so
// real routes (/, /portfolio, /home-staging-*, /journal, etc.) are untouched
// and keep their static optimization.
export function middleware(_req: NextRequest) {
  return new NextResponse(
    "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex\"><title>410 Gone</title></head><body><h1>410 — Gone</h1><p>This page was part of the previous website and has been permanently removed.</p></body></html>",
    {
      status: 410,
      headers: { "content-type": "text/html; charset=utf-8" },
    }
  );
}

export const config = {
  matcher: [
    "/wp-admin/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wp-json/:path*",
    "/author/:path*",
    "/category/:path*",
    "/tag/:path*",
    // Any stray .php probe (wp-login.php, xmlrpc.php, wp-cron.php, …),
    // excluding our own internal paths.
    "/((?!_next|api).*\\.php)",
  ],
};
