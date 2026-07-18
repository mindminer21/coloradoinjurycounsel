"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/car-accidents", label: "Car Accidents" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/case-estimator", label: "Case Estimator" },
  { href: "/about", label: "Our Attorneys" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-navy shadow-[0_1px_0_rgba(255,255,255,0.08),0_8px_30px_rgba(2,27,44,0.35)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:px-6">
        <Link href="/" aria-label="Whiteford Mountain West — home" className="flex items-center gap-3">
          <Image src="/brand/whiteford_header_logo.svg" alt="Whiteford" width={150} height={34} priority className="h-7 w-auto md:h-8" />
          <span className="hidden border-l border-white/25 pl-3 font-display text-[0.8rem] leading-tight tracking-wide text-sky sm:block">
            Mountain West
            <br />
            <span className="text-white/70">Personal Injury</span>
          </span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-white/85 transition-colors hover:text-gold-soft">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={SITE.phoneHref}
            className="cta-gold hidden items-center gap-2 rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-navy-ink transition-transform hover:-translate-y-px sm:inline-flex"
          >
            <PhoneIcon /> {SITE.phone}
          </a>
          <a href={SITE.phoneHref} className="inline-flex rounded-sm bg-gold p-2.5 text-navy-ink sm:hidden" aria-label={`Call ${SITE.phone}`}>
            <PhoneIcon />
          </a>
          <button
            className="inline-flex flex-col gap-[5px] p-2 md:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            <span className={`h-[2px] w-6 bg-white transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-[2px] w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-[2px] w-6 bg-white transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-white/10 bg-navy-deep px-6 py-4 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-3 text-[0.95rem] font-medium text-white/90">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" />
    </svg>
  );
}
