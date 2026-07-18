import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { JURISDICTION_NOTE } from "@/lib/attorneys";

export const metadata: Metadata = {
  title: "Legal Disclaimer & Attorney Advertising Notice | Whiteford Mountain West",
  description: "Attorney advertising disclosures, no-attorney-client-relationship notice, and case estimator disclaimers for this website.",
  alternates: { canonical: "/disclaimer" },
  robots: { index: false },
};

export default function DisclaimerPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <div className="prose-wm">
        <h1 className="font-display text-3xl text-navy">Legal Disclaimer</h1>
        <h2>Attorney advertising</h2>
        <p>
          This website is attorney advertising for {SITE.name}, {SITE.address.street}, {SITE.address.city},{" "}
          {SITE.address.state} {SITE.address.zip}, {SITE.phone}. It is designed for general information only.
        </p>
        <h2>No legal advice; no attorney–client relationship</h2>
        <p>
          The information on this website — including every practice-area page, law summary, and the case value
          estimator — is general information about Colorado law, not legal advice about your situation. Reading this
          site, submitting a form, or using the estimator does not create an attorney–client relationship. An
          attorney–client relationship is formed only by a signed engagement agreement.
        </p>
        <h2>About the case value estimator</h2>
        <p>
          The estimator produces an educational range from simplified assumptions. It is not a valuation, appraisal,
          or prediction of any claim&apos;s worth, and it is not an offer of representation. Real case outcomes depend on
          facts, evidence, insurance policy limits, comparative fault, statutory caps and their exceptions, filing
          deadlines, and many factors no questionnaire can capture. Cases can be worth more, less, or nothing.
        </p>
        <h2>No guarantees; prior results</h2>
        <p>
          We make no guarantees about the outcome of any matter. Prior results do not guarantee a similar outcome.
          Nothing on this site should be read as a promise of recovery or a claim that we are specialists or
          &quot;the best&quot; at anything — choosing a lawyer is an important decision that should not be based solely on
          advertising.
        </p>
        <h2>Jurisdictions</h2>
        <p>{JURISDICTION_NOTE}</p>
        <h2>Statements about Colorado law</h2>
        <p>
          Summaries of Colorado statutes and caps on this site are believed accurate as of publication and are
          sourced from official legislative materials, but laws change and exceptions apply. Always confirm how the
          law applies to your specific situation with a licensed Colorado attorney.
        </p>
      </div>
    </section>
  );
}
