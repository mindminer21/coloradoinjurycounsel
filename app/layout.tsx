import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/archivo";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: { default: "Whiteford Mountain West — Colorado Personal Injury Attorneys", template: "%s" },
  description:
    "Denver-based injury counsel backed by Whiteford's national trial platform. Free consultations and an educational case-value estimator for Colorado injury claims.",
  openGraph: {
    siteName: "Whiteford Mountain West",
    type: "website",
    images: [{ url: "/brand/whiteford_og_logo.jpg", width: 1200, height: 630, alt: "Whiteford" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
