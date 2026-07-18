import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Whiteford Mountain West",
  description: "How Whiteford Mountain West collects, uses, and protects information submitted through this website and its case estimator.",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <div className="prose-wm">
        <h1 className="font-display text-3xl text-navy">Privacy Policy</h1>
        <p><em>Last updated: July 2026 · Draft pending attorney review</em></p>
        <h2>Information we collect</h2>
        <p>
          When you use this website&apos;s case estimator or contact forms, we collect the information you choose to
          provide: your name, email address, optional phone number, and your answers to estimator questions. We also
          collect standard technical information (page visited, referring source, and campaign parameters) to
          understand how visitors find us.
        </p>
        <h2>How we use it</h2>
        <p>
          Information you submit is used to respond to your inquiry, evaluate whether we can help with your potential
          matter, and — with your consent — contact you by email or phone. Submissions are stored in our client
          relationship management system. We do not sell your personal information, and we do not purchase or sell
          third-party legal leads.
        </p>
        <h2>What submitting does not do</h2>
        <p>
          Submitting information through this website does not create an attorney–client relationship and does not
          make you a client of Whiteford. Please do not submit confidential or time-sensitive details through the
          estimator — call {SITE.phone} instead.
        </p>
        <h2>Retention and choices</h2>
        <p>
          You may request access to, correction of, or deletion of information you submitted by contacting us at our
          Denver office: {SITE.address.street}, {SITE.address.city}, {SITE.address.state} {SITE.address.zip}, or by
          phone at {SITE.phone}.
        </p>
      </div>
    </section>
  );
}
