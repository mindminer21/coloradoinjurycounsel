import { NextRequest, NextResponse } from "next/server";

// Site-wide password gate (pre-launch). Password only — no username.
const PASSWORD = "SchellWhiteford2026";
const COOKIE = "wf_gate";
const TOKEN = "granted-wf-2026";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};

function gatePage(error = false, next = "/") {
  const action = "/__gate?next=" + encodeURIComponent(next);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Private preview</title>
<style>
:root{--navy:#02243a;--gold:#c6a15b}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--navy);
font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#fff}
.card{width:min(92vw,380px);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);
border-radius:14px;padding:2rem 1.75rem;text-align:center;box-shadow:0 18px 50px rgba(2,27,44,.5)}
.mark{letter-spacing:.28em;font-size:.72rem;color:var(--gold);text-transform:uppercase;font-weight:600}
h1{font-size:1.15rem;font-weight:600;margin:.65rem 0 1.35rem;color:#fff}
input{width:100%;padding:.8rem .9rem;border-radius:8px;border:1px solid rgba(255,255,255,.22);
background:#0b1a29;color:#fff;font-size:1rem;text-align:center}
input:focus{outline:2px solid var(--gold);outline-offset:2px}
button{width:100%;margin-top:.85rem;padding:.8rem;border:0;border-radius:8px;background:var(--gold);
color:#14233a;font-weight:700;font-size:1rem;cursor:pointer}
.err{color:#ffb4a8;font-size:.85rem;margin-top:.8rem;${error ? "" : "display:none"}}
</style></head><body>
<form class="card" method="POST" action="${action}">
<div class="mark">Whiteford</div>
<h1>This site is a private preview</h1>
<input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password" aria-label="Password">
<button type="submit">Enter</button>
<div class="err">Incorrect password. Please try again.</div>
</form></body></html>`;
}

export async function middleware(req: NextRequest) {
  if (req.cookies.get(COOKIE)?.value === TOKEN) return NextResponse.next();

  const url = new URL(req.url);
  if (req.method === "POST" && url.pathname === "/__gate") {
    const form = await req.formData();
    const pw = String(form.get("password") || "");
    const next = url.searchParams.get("next") || "/";
    if (pw === PASSWORD) {
      const res = NextResponse.redirect(new URL(next, req.url), 303);
      res.cookies.set(COOKIE, TOKEN, {
        httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }
    return new NextResponse(gatePage(true, next), {
      status: 401, headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const next = url.pathname + url.search;
  return new NextResponse(gatePage(false, next), {
    status: 401, headers: { "content-type": "text/html; charset=utf-8" },
  });
}
