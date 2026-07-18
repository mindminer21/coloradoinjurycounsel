"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Scroll-scrubbed frame film (courtroom sequence).
 * - Pinned section: scrolling scrubs through /film/frame-XXX.webp
 * - Frames lazy-load only when the section nears the viewport
 * - Lerped frame index (no jank), sliding decode window
 * - prefers-reduced-motion or fetch failure → static poster
 */
const FRAME_COUNT = 80;
const framePath = (i: number) => `/film/frame-${String(i + 1).padStart(3, "0")}.webp`;

export default function ScrollFilm() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const [mode, setMode] = useState<"film" | "poster">("film");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("poster");
      return;
    }
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let started = false;
    let raf = 0;
    let disposed = false;

    const draw = (idx: number) => {
      const img = imagesRef.current[Math.round(idx)];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
      const scale = Math.max((w * dpr) / img.naturalWidth, (h * dpr) / img.naturalHeight);
      const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w * dpr - dw) / 2, (h * dpr - dh) / 2, dw, dh);
    };

    const load = (i: number) => {
      if (i < 0 || i >= FRAME_COUNT || imagesRef.current[i]) return;
      const img = new Image();
      img.src = framePath(i);
      img.onerror = () => { if (i === 0 && !disposed) setMode("poster"); };
      imagesRef.current[i] = img;
    };

    const tick = () => {
      if (disposed) return;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
      targetRef.current = p * (FRAME_COUNT - 1);
      // sliding decode window
      const c = Math.round(targetRef.current);
      for (let k = -4; k <= 12; k++) load(c + k);
      // lerp
      currentRef.current += (targetRef.current - currentRef.current) * 0.16;
      if (Math.abs(targetRef.current - currentRef.current) < 0.01) currentRef.current = targetRef.current;
      draw(currentRef.current);
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started) {
          started = true;
          for (let i = 0; i < 16; i++) load(i);
          raf = requestAnimationFrame(tick);
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(wrap);
    return () => { disposed = true; io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const beats = [
    { at: 0.05, title: "Prepared like it's going to trial", sub: "Because sometimes it should." },
    { at: 0.45, title: "A team, not a referral mill", sub: "Denver leadership. National trial depth." },
    { at: 0.82, title: "Your case, argued like it matters", sub: "Free consultation · (720) 821-3784" },
  ];

  if (mode === "poster") {
    return (
      <section className="relative bg-navy-ink text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/film/poster.webp" alt="Whiteford attorneys at work in a courtroom (dramatization)" className="h-[70vh] w-full object-cover opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center bg-navy-ink/40">
          <div className="max-w-xl px-6 text-center">
            <h2 className="font-display text-3xl md:text-4xl">Prepared like it&apos;s going to trial</h2>
            <p className="mt-3 text-white/75">Denver leadership. National trial depth. Free consultation · (720) 821-3784</p>
          </div>
        </div>
        <p className="absolute bottom-3 right-4 text-[0.65rem] uppercase tracking-wide text-white/40">Dramatization</p>
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="relative" style={{ height: "260vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-navy-ink">
        <canvas ref={canvasRef} className="h-full w-full" aria-label="Scroll-driven film of Whiteford attorneys in a courtroom (dramatization)" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,27,44,0.55),transparent_30%,transparent_65%,rgba(2,27,44,0.75))]" aria-hidden />
        {beats.map((b, i) => {
          const active = Math.abs(progress - b.at) < 0.16;
          return (
            <div
              key={i}
              className="pointer-events-none absolute inset-x-0 bottom-[14%] px-6 text-center text-white transition-all duration-700"
              style={{ opacity: active ? 1 : 0, transform: `translateY(${active ? 0 : 18}px)` }}
            >
              <h2 className="font-display text-3xl drop-shadow-lg md:text-5xl">{b.title}</h2>
              <p className="mt-2 text-white/85 md:text-lg">{b.sub}</p>
            </div>
          );
        })}
        <div className="absolute bottom-4 left-1/2 h-[2px] w-40 -translate-x-1/2 overflow-hidden rounded bg-white/20">
          <div className="h-full bg-gold" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="absolute bottom-3 right-4 text-[0.65rem] uppercase tracking-wide text-white/40">Dramatization</p>
      </div>
    </div>
  );
}
