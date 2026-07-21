import { NextRequest, NextResponse } from "next/server";

// Site-wide password gate (pre-launch). Any username; password only.
const PASSWORD = "SchellWhiteford2026";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const pass = decoded.slice(decoded.indexOf(":") + 1);
      if (pass === PASSWORD) return NextResponse.next();
    } catch {}
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Whiteford — Private Preview", charset="UTF-8"' },
  });
}
