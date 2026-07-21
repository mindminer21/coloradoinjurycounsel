import { NextRequest, NextResponse } from "next/server";

// Site-wide password gate (pre-launch). Password only — no username.
const PASSWORD = "SchellWhiteford2026";
const COOKIE = "wf_gate";
const TOKEN = "granted-wf-2026";

const LOGO = `<svg viewBox="0 0 317 71.67" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Whiteford"><path fill="#fff" d="m18.99,20.64l3.55-1.08,7.91,23.45,9.21-23.85,9.61,23.85,7.5-23.45,3.55,1.08-10.51,31.94-10.15-24.08-9.57,24.08-11.1-31.94Z"/><path fill="#fff" d="m90.25,20.64l3.5-1.08v32.53h-3.5v-14.33h-19v14.33h-3.5v-31.45l3.5-1.08v15h19v-13.93Z"/><path fill="#fff" d="m103.86,20.64l3.5-1.08v32.53h-3.5v-31.45Z"/><path fill="#fff" d="m129.74,23.15v28.93h-3.5v-28.93h-11.01l1.08-3.19h24.44l-1.08,3.19h-9.93Z"/><path fill="#fff" d="m167.16,48.89l-1.08,3.19h-18.6V19.83h19.68l-1.08,3.19h-15.09v11.46h13.34l-1.08,3.14h-12.26v11.28h16.17Z"/><path fill="#fff" d="m192.09,34.65l-1.08,3.14h-12.26v14.29h-3.5V20.01h19.63l-1.08,3.19h-15.05v11.46h13.34Z"/><path fill="#fff" d="m200.5,36c0-9.25,7.55-16.8,16.8-16.8s16.8,7.55,16.8,16.8-7.59,16.8-16.8,16.8-16.8-7.55-16.8-16.8Zm30.01,0c0-7.37-5.84-13.57-13.21-13.57s-13.21,6.2-13.21,13.57,5.84,13.57,13.21,13.57,13.21-6.15,13.21-13.57Z"/><path fill="#fff" d="m262.72,28.95c0,5.44-2.97,7.73-7.01,8.58l8.76,12.85-2.7,2.2-9.79-14.65h-6.69v14.15h-3.55V19.96h9.48c6.11,0,11.5,1.66,11.5,8.99Zm-17.43,5.79h5.93c4.36,0,7.91-1.3,7.91-5.79s-3.55-5.8-7.91-5.8h-5.93v11.59Z"/><path fill="#fff" d="m297.98,35.96c.45,9.25-6.24,16.13-16.13,16.13h-9.97V19.83h9.97c9.88,0,16.58,6.33,16.13,16.13Zm-22.6,12.98h6.47c7.95,0,13.03-6.6,12.58-12.98.45-7.28-4.63-12.94-12.58-12.94h-6.47v25.92Z"/><path fill="#fff" d="m0,0v71.67h317V0H0Zm1.8,69.88V1.8h313.41v68.08H1.8Z"/></svg>`;

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
.mark{margin:0 auto 1.15rem}
.mark svg{height:30px;width:auto;display:block;margin:0 auto}
h1{font-size:1.15rem;font-weight:600;margin:0 0 1.35rem;color:#fff}
input{width:100%;padding:.8rem .9rem;border-radius:8px;border:1px solid rgba(255,255,255,.22);
background:#0b1a29;color:#fff;font-size:1rem;text-align:center}
input:focus{outline:2px solid var(--gold);outline-offset:2px}
button{width:100%;margin-top:.85rem;padding:.8rem;border:0;border-radius:8px;background:var(--gold);
color:#14233a;font-weight:700;font-size:1rem;cursor:pointer}
.err{color:#ffb4a8;font-size:.85rem;margin-top:.8rem;${error ? "" : "display:none"}}
</style></head><body>
<form class="card" method="POST" action="${action}">
<div class="mark">${LOGO}</div>
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
