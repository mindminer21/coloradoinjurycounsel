export const SITE = {
  name: "Whiteford Mountain West",
  legal: "Whiteford Mountain West — Personal Injury",
  phone: "(720) 821-3784",
  phoneHref: "tel:+17208213784",
  address: { street: "2128 W. 32nd Ave., Suite 200", city: "Denver", state: "CO", zip: "80211" },
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://coloradoinjurycounsel.com",
  attorneys: [
    { name: "Jeffrey Schell", title: "Managing Director, Whiteford Mountain West", initials: "JS" },
    { name: "Masten Childers", title: "Attorney", initials: "MC" },
    { name: "Paul Nussbaum", title: "Attorney", initials: "PN" },
  ],
  calBookingUrl: "https://cal.com/jeffschell/free-injury-consultation-whiteford-mountain-west",
  offers: {
    snapshot: {
      name: "Colorado Case Value Snapshot",
      cta: "Get your free Case Value Snapshot",
      sub: "An educational value range for your case — free, confidential, about 2 minutes.",
    },
    session: {
      name: "Claim Game Plan Session",
      cta: "Book your free Claim Game Plan Session",
      sub: "30 minutes with our Colorado team. You leave with a plan — whether or not you hire us.",
      deliverables: [
        { t: "Your deadline check", d: "Exactly which Colorado filing deadlines apply to your claim type — and how much runway you actually have." },
        { t: "Evidence-preservation checklist", d: "What to save, photograph, and request right now for your specific incident type, before it disappears." },
        { t: "A straight answer", d: "Whether your case actually needs a lawyer. If you'd do fine on your own, we'll tell you so — for free." },
        { t: "The insurer-conversation briefing", d: "What recorded statements do, what adjusters listen for, and how people accidentally shrink their own claims." },
      ],
    },
    guarantee: "You pay no fee unless we recover for you.",
    guaranteeNote: "Contingency-fee representation for injury cases — fee structure and any case costs explained clearly, in writing, before you sign anything.",
  },
  disclaimerShort:
    "Attorney Advertising. This website provides general information about Colorado law and is not legal advice. Viewing this site or using the case estimator does not create an attorney–client relationship. Prior results do not guarantee a similar outcome. Case outcomes depend on specific facts, insurance coverage, and applicable law.",
} as const;

export const HL_TAG = "Colorado Personal Injury Lead";
