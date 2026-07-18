import type { Metadata } from "next";
import BridgePage, { type BridgeContent } from "@/components/BridgePage";

export const metadata: Metadata = {
  title: "After a Car Accident in Colorado: The First 14 Days | Whiteford",
  description:
    "The crash takes seconds. What you do in the next two weeks shapes everything after. A plain-English guide to the first 14 days after a Colorado car accident.",
  alternates: { canonical: "/after-a-car-accident-in-colorado" },
};

const c: BridgeContent = {
  eyebrow: "Colorado · After the crash",
  h1: "The crash took four seconds. The next fourteen days decide almost everything else.",
  lede: "Nobody plans for the week after a car accident. Here's what it usually looks like — and the quiet decisions inside it that shape what happens to you for the next year.",
  story: [
    {
      paragraphs: [
        "The first day is adrenaline and logistics. Police, tow trucks, phone calls, a rental car if you're lucky. You feel shaken but mostly okay, and you tell everyone so — the officer, your family, the other driver's insurance adjuster who calls with impressive speed and remarkable friendliness.",
        "The second week is where it actually gets decided. The soreness that was 'probably nothing' is still there. The adjuster calls again — they'd just like a quick recorded statement, purely routine. There's a settlement figure mentioned, casually, that would cover the ER visit and a bit more. It's all very reasonable-sounding. And this is the exact moment where people who've never done this before — which is nearly everyone — quietly give away most of the value of their claim.",
      ],
    },
    {
      heading: "What's really happening in that second week",
      paragraphs: [
        "Three clocks are running that nobody tells you about. Your medical picture is still developing — soft-tissue injuries, disc problems, and concussions routinely reveal themselves late, and any settlement you sign before you understand your injuries is final, no matter what shows up afterward. The evidence is decaying — nearby camera footage gets overwritten in days, the vehicles get repaired or scrapped, and witnesses' memories soften. And the record is being built — that friendly recorded statement, your quick 'I'm fine!' texts, the treatment gap while you waited to see if it would pass: all of it becomes the file the insurer uses to value your claim.",
        "None of this requires anyone to be villainous. Adjusters are doing their jobs, and their job is to close claims early and inexpensively. The system simply rewards the prepared — which is exactly why what you do in the first fourteen days matters more than almost anything after.",
      ],
    },
  ],
  doNow: [
    { t: "Get examined, even if you feel fine", d: "Today or tomorrow — for your health first, and because a same-week medical record is the foundation of any claim." },
    { t: "Write everything down and photograph everything", d: "The scene, the cars, your injuries as they develop, every receipt, every missed workday." },
    { t: "Report to your own insurer — politely decline the other side's recorded statement", d: "You're required to notify yours. You are not required to give the other driver's insurer a recording, and it's reasonable to wait until you've had advice." },
    { t: "Learn your deadlines before deciding anything", d: "Colorado's filing windows vary by claim type, and some — like government-vehicle claims — are far shorter than people assume." },
  ],
  snapshotPitch: "Two minutes from now, you can know what actually drives the value of a case like yours.",
};

export default function Page() {
  return <BridgePage c={c} />;
}
