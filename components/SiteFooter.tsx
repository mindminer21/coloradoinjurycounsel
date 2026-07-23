import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="bg-navy-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <Image src="/brand/whiteford_header_logo.svg" alt="Whiteford" width={160} height={36} className="h-8 w-auto" />
          <p className="mt-2 font-display text-sm text-sky">Mountain West · Personal Injury</p>
          <address className="mt-5 text-sm not-italic leading-relaxed text-white/70">
            {SITE.address.street}
            <br />
            {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            <br />
            <a href={SITE.phoneHref} className="mt-2 inline-block font-semibold text-gold-soft hover:text-gold">
              {SITE.phone}
            </a>
          </address>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 text-sm md:col-span-1">
          <div>
            <p className="mb-3 font-semibold text-white/90">Injury cases</p>
            {[
              ["/denver/car-accident-lawyer", "Car accidents"],
              ["/truck-accidents", "Truck accidents"],
              ["/denver/motorcycle-accident-lawyer", "Motorcycle accidents"],
              ["/wrongful-death", "Wrongful death"],
              ["/ski-accidents", "Ski accidents"],
              ["/practice-areas", "All practice areas →"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="block py-1 text-white/60 hover:text-gold-soft">
                {label}
              </Link>
            ))}
          </div>
          <div>
            <p className="mb-3 font-semibold text-white/90">Resources</p>
            {[
              ["/case-estimator", "Case Value Snapshot"],
              ["/after-a-car-accident-in-colorado", "After a crash: first 14 days"],
              ["/personal-injury-laws-2025", "2025 law changes"],
              ["/statute-of-limitations-car-accidents", "Filing deadlines"],
              ["/about", "Our attorneys"],
              ["/privacy", "Privacy policy"],
              ["/disclaimer", "Legal disclaimer"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="block py-1 text-white/60 hover:text-gold-soft">
                {label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="text-xs leading-relaxed text-white/45">
          <p className="mb-3 font-semibold uppercase tracking-wide text-white/60">Attorney Advertising</p>
          <p>{SITE.disclaimerShort}</p>
          <p className="mt-3">
            © {new Date().getFullYear()} Whiteford. All rights reserved. Whiteford Mountain West is part of the
            Whiteford family of firms.
          </p>
        </div>
      </div>
    </footer>
  );
}
