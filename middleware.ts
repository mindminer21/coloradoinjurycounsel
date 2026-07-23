import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "wmw_review";
const WHITEFORD_LOGO_SVG = `<svg class="mark" role="img" aria-label="Whiteford logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 317 71.67"><path fill="#fff" d="m18.99,20.64l3.55-1.08,7.91,23.45,9.21-23.85,9.61,23.85,7.5-23.45,3.55,1.08-10.51,31.94-10.15-24.08-9.57,24.08-11.1-31.94Z"/><path fill="#fff" d="m90.25,20.64l3.5-1.08v32.53h-3.5v-14.33h-19v14.33h-3.5v-31.45l3.5-1.08v15h19v-13.93Z"/><path fill="#fff" d="m103.86,20.64l3.5-1.08v32.53h-3.5v-31.45Z"/><path fill="#fff" d="m129.74,23.15v28.93h-3.5v-28.93h-11.01l1.08-3.19h24.44l-1.08,3.19h-9.93Z"/><path fill="#fff" d="m167.16,48.89l-1.08,3.19h-18.6V19.83h19.68l-1.08,3.19h-15.09v11.46h13.34l-1.08,3.14h-12.26v11.28h16.17Z"/><path fill="#fff" d="m192.09,34.65l-1.08,3.14h-12.26v14.29h-3.5V20.01h19.63l-1.08,3.19h-15.05v11.46h13.34Z"/><path fill="#fff" d="m200.5,36c0-9.25,7.55-16.8,16.8-16.8s16.8,7.55,16.8,16.8-7.59,16.8-16.8,16.8-16.8-7.55-16.8-16.8Zm30.01,0c0-7.37-5.84-13.57-13.21-13.57s-13.21,6.2-13.21,13.57,5.84,13.57,13.21,13.57,13.21-6.15,13.21-13.57Z"/><path fill="#fff" d="m262.72,28.95c0,5.44-2.97,7.73-7.01,8.58l8.76,12.85-2.7,2.2-9.79-14.65h-6.69v14.15h-3.55V19.96h9.48c6.11,0,11.5,1.66,11.5,8.99Zm-17.43,5.79h5.93c4.36,0,7.91-1.3,7.91-5.79s-3.55-5.8-7.91-5.8h-5.93v11.59Z"/><path fill="#fff" d="m297.98,35.96c.45,9.25-6.24,16.13-16.13,16.13h-9.97V19.83h9.97c9.88,0,16.58,6.33,16.13,16.13Zm-22.6,12.98h6.47c7.95,0,13.03-6.6,12.58-12.98.45-7.28-4.63-12.94-12.58-12.94h-6.47v25.92Z"/><path fill="#fff" d="m0,0v71.67h317V0H0Zm1.8,69.88V1.8h313.41v68.08H1.8Z"/></svg>`;

function secureEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function gatePage(returnTo: string, error = "", unavailable = false) {
  const safeReturnTo = escapeHtml(returnTo);
  const message = unavailable
    ? "Review access is not configured. Please contact Jeff Schell."
    : "Enter the password provided with the Month 2 Update.";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow,noarchive" />
  <title>Whiteford Mountain West | Leadership Review</title>
  <style>
    :root{--navy:#003756;--deep:#02243a;--paper:#f7f5f1;--gold:#c6a15b;--sky:#8fb8d4}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:linear-gradient(150deg,var(--deep),var(--navy));color:var(--paper);font-family:Arial,sans-serif;padding:28px}
    main{width:min(520px,100%);border:1px solid rgba(255,255,255,.24);background:rgba(2,36,58,.78);padding:42px;box-shadow:0 28px 80px rgba(0,0,0,.28)}
    .lockup{display:flex;align-items:center;gap:16px;margin-bottom:54px}.mark{display:block;width:162px;height:auto;flex:0 0 auto}.divider{width:1px;height:30px;background:rgba(255,255,255,.35)}.region{font-family:Georgia,serif;font-size:20px;font-weight:700}
    .eyebrow{color:#d9bc85;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}h1{font-family:Georgia,serif;font-size:42px;line-height:1.05;margin:14px 0 16px}p{color:rgba(255,255,255,.72);line-height:1.55;margin:0 0 28px}
    label{display:block;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:9px}input{width:100%;height:48px;border:1px solid rgba(255,255,255,.28);background:#fff;color:#021b2c;padding:0 14px;font-size:16px}
    button{width:100%;height:48px;border:0;background:var(--gold);color:var(--deep);font-weight:800;font-size:15px;margin-top:14px;cursor:pointer}.error{color:#ffd5cb;font-weight:700;margin:0 0 18px}.ridge{display:flex;align-items:end;height:70px;margin:38px -42px -42px;overflow:hidden}.ridge span{display:block;width:25%;height:70px;background:#155578;clip-path:polygon(50% 0,100% 100%,0 100%)}.ridge span:nth-child(even){height:54px;background:#02243a}
    footer{margin-top:24px;color:rgba(255,255,255,.45);font-size:10px}
  </style>
</head>
<body>
  <main>
    <div class="lockup">${WHITEFORD_LOGO_SVG}<div class="divider"></div><div class="region">Mountain West</div></div>
    <div class="eyebrow">Confidential leadership review</div>
    <h1>Private preview</h1>
    <p>${message}</p>
    ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
    ${unavailable ? "" : `<form method="post"><input type="hidden" name="returnTo" value="${safeReturnTo}" /><label for="password">Review password</label><input id="password" name="password" type="password" autocomplete="current-password" required autofocus /><button type="submit">View site</button></form>`}
    <footer>CONFIDENTIAL, Prepared by Jeff Schell, (720) 667-7721, jschell@whitefordlaw.com</footer>
    <div class="ridge"><span></span><span></span><span></span><span></span></div>
  </main>
</body>
</html>`;
}

function gateResponse(returnTo: string, error = "", unavailable = false, status = 401) {
  return new NextResponse(gatePage(returnTo, error, unavailable), {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store, max-age=0",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
  });
}

export default async function middleware(request: NextRequest) {
  const reviewPassword = process.env.REVIEW_PASSWORD;
  const reviewToken = process.env.REVIEW_AUTH_TOKEN;
  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (!reviewPassword || !reviewToken) {
    return gateResponse(returnTo, "", true, 503);
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (cookie && secureEqual(cookie, reviewToken)) {
    return NextResponse.next();
  }

  if (request.method === "POST") {
    const form = await request.formData();
    const suppliedPassword = String(form.get("password") ?? "");
    const requestedReturnTo = String(form.get("returnTo") ?? "/");
    const safeReturnTo = requestedReturnTo.startsWith("/") && !requestedReturnTo.startsWith("//")
      ? requestedReturnTo
      : "/";

    if (secureEqual(suppliedPassword, reviewPassword)) {
      const response = NextResponse.redirect(new URL(safeReturnTo, request.url), 303);
      response.cookies.set(COOKIE_NAME, reviewToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    return gateResponse(safeReturnTo, "That password was not recognized.", false, 401);
  }

  return gateResponse(returnTo);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
