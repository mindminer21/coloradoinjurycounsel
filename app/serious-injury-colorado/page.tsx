import type { Metadata } from "next";
import BridgePage, { type BridgeContent } from "@/components/BridgePage";

export const metadata: Metadata = {
  title: "Seriously Injured in Colorado? Read This Before Deciding Anything | Whiteford",
  description:
    "When an injury changes your life, the claim stops being about the crash and starts being about your future. What families facing serious injury in Colorado should understand first.",
  alternates: { canonical: "/serious-injury-colorado" },
};

const c: BridgeContent = {
  eyebrow: "Colorado · Serious & catastrophic injury",
  h1: "When the injury is serious, the claim stops being about the accident. It becomes about the rest of your life.",
  lede: "Brain injuries. Spinal damage. Surgeries with more surgeries behind them. When the stakes look like this, the way claims usually get handled is not good enough — and families deserve to know that early.",
  story: [
    {
      paragraphs: [
        "In a serious-injury case, the real question is almost never what the last six months cost. It's what the next thirty years will cost: revision surgeries, rehabilitation, equipment, home modification, care that a spouse can't provide forever, the career that was interrupted or ended. Insurers understand this arithmetic perfectly — which is why their early offers so often focus on the bills that already exist, while the future goes quietly unpriced.",
        "Families in this situation are exhausted, frightened, and being asked to make permanent financial decisions in the least clear-headed season of their lives. That's not a character flaw; it's the design of the moment. And it's precisely why serious cases deserve a different level of preparation from day one.",
      ],
    },
    {
      heading: "What changes when a case is prepared like it's going to trial",
      paragraphs: [
        "Life-care planners model future medical needs. Economists price the interrupted career. Specialists connect the medical evidence to the life that changed. Coverage gets traced through every layer that applies — not just the obvious policy. This is slow, expensive, unglamorous work, and it is exactly what a national trial platform exists to do. Insurers can see preparation in a file, and prepared files are valued differently. That's the entire, unexciting secret.",
        "One more thing families should hear plainly: Colorado law changed in 2025 in ways that meaningfully raised what may be recovered for the human losses in the most serious cases — the details are summarized further down this page. Decisions made on old assumptions leave real money on the table at exactly the moment a family needs it most.",
      ],
    },
  ],
  doNow: [
    { t: "Stabilize first — everything else waits", d: "No claim decision matters more than treatment. Nothing below should compete with care." },
    { t: "Don't sign or accept anything yet", d: "Releases are permanent. A serious case cannot be fairly valued until the future-care picture exists." },
    { t: "Start one folder", d: "Every record, bill, denial letter, and name. Serious cases are won on documentation, and it's easier to keep than to reconstruct." },
    { t: "Get the deadline map early", d: "Long recoveries burn filing windows quietly. Knowing your specific deadlines costs nothing and forecloses nothing." },
  ],
  snapshotPitch: "Start with an honest, educational read on what drives value in cases like this — then talk to a human.",
};

export default function Page() {
  return <BridgePage c={c} />;
}
