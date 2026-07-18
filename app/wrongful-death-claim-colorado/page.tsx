import type { Metadata } from "next";
import BridgePage, { type BridgeContent } from "@/components/BridgePage";

export const metadata: Metadata = {
  title: "Losing Someone Was Not Supposed to Come With Paperwork | Whiteford",
  description:
    "A gentle, plain-English guide for Colorado families facing a wrongful death claim — what the law provides, who may bring a claim, and why there is no rush to decide today.",
  alternates: { canonical: "/wrongful-death-claim-colorado" },
};

const c: BridgeContent = {
  eyebrow: "Colorado · Wrongful death",
  h1: "Losing someone was not supposed to come with paperwork.",
  lede: "If you're reading this, something unthinkable has happened. This page won't pretend a legal claim is what matters most right now. It exists so that, when you're ready, you'll know what Colorado law provides for your family — without pressure and without hurry.",
  story: [
    {
      paragraphs: [
        "In the weeks after a death caused by someone else's choices, families describe the same strange split screen: grief on one side, and on the other an accumulating stack of practical matters no one feels able to face — insurance letters, bills, an employer calling, sometimes an adjuster expressing condolences and mentioning paperwork in the same breath.",
        "Here is what we most want grieving families to know: you do not have to engage with any of it this week. The important protections in Colorado law do not evaporate in a month. What deserves gentle attention at some point — not today — is that filing windows do exist, they vary with the circumstances, and a conversation well before they close keeps every option open while asking nothing of you.",
      ],
    },
    {
      heading: "What Colorado law provides — in one calm paragraph",
      paragraphs: [
        "Colorado's wrongful-death law allows certain family members — in an order the statute sets out, recently expanded to include siblings in some circumstances — to bring a claim for both the financial losses a death causes and the profound human ones. The 2025 changes to Colorado law raised what may be recovered for those human losses substantially; the specifics are summarized further down this page. A claim cannot restore anything. What it can do is provide security, accountability, and — many families tell us — an official record that what happened mattered.",
        "When a family is ready, the work should be carried by people who do it with seriousness and care: preserving the evidence gently but early, dealing with insurers so the family doesn't have to, and preparing thoroughly enough that a fair resolution doesn't require a courtroom — while being fully ready for one if it does.",
      ],
    },
  ],
  doNow: [
    { t: "Let someone close to you screen the calls", d: "You are not obligated to speak with any insurer now. A trusted person can take messages while you focus on your family." },
    { t: "Keep, don't sort", d: "One box or folder for every document that arrives. No organizing required — just don't discard." },
    { t: "Don't sign anything yet", d: "Early offers in death cases are almost never based on a real accounting of the loss. There is no deadline measured in days." },
    { t: "When you're ready — one unhurried conversation", d: "It costs nothing, commits you to nothing, and can simply be a deadline check so nothing is lost while you grieve." },
  ],
  snapshotPitch: "When you're ready — and only then — we're here for an unhurried conversation.",
};

export default function Page() {
  return <BridgePage c={c} />;
}
