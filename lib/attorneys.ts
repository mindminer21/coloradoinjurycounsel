import fs from "fs";
import path from "path";

export type Attorney = {
  slug: string;
  profileUrl: string;
  name: string;
  title: string;
  role: string;
  location: string;
  admissions: string[];
  bio: string[];
  initials: string;
  photo?: string; // populated when /public/brand/attorneys/<slug>.jpg exists
};

const BASE: Omit<Attorney, "photo">[] = [
  {
    slug: "jeffrey-schell",
    profileUrl: "https://www.whitefordlaw.com/professionals/jeffrey-r-schell",
    name: "Jeffrey R. Schell",
    title: "Managing Director, Whiteford Mountain West",
    role: "Your Denver-based point of contact",
    location: "Denver, Colorado",
    admissions: ["Colorado", "Michigan", "U.S. District Court, District of Colorado"],
    bio: [
      "Jeff Schell is a Denver-based partner at Whiteford and the Managing Director of Whiteford Mountain West. A Colorado attorney, he was named one of ColoradoBiz Magazine's 25 Most Influential Young Professionals in Colorado.",
      "For injury matters, Jeff serves as the firm's Colorado front door: he meets with injured Coloradans, coordinates the right Whiteford trial resources for each case, and stays personally accessible throughout the engagement.",
    ],
    initials: "JS",
  },
  {
    slug: "masten-childers",
    profileUrl: "https://www.whitefordlaw.com/professionals/masten-childers-iii",
    name: "Masten Childers III",
    title: "Partner · Trial Counsel, Personal Injury & Catastrophic Harm",
    role: "Lead trial strategy",
    location: "Whiteford national trial platform",
    admissions: ["Kentucky", "District of Columbia", "U.S. Courts of Appeals (D.C. Cir., 6th Cir.)"],
    bio: [
      "Masten Childers III chairs Whiteford's Kentucky litigation practice and has been described as one of Kentucky's most formidable and versatile trial attorneys, with experience across state, federal, and appellate courts.",
      "After years defending major corporations and insurers, Masten now represents injured people — co-leading complex personal injury and catastrophic-harm cases, including current representation of more than one hundred individuals and entities in major aviation-disaster litigation.",
    ],
    initials: "MC",
  },
  {
    slug: "paul-nussbaum",
    profileUrl: "https://www.whitefordlaw.com/professionals/paul-m-nussbaum",
    name: "Paul M. Nussbaum",
    title: "Partner · Senior Litigation Counsel",
    role: "Complex litigation & financial recovery",
    location: "Whiteford national platform",
    admissions: ["New York", "Maryland", "New Jersey"],
    bio: [
      "Paul Nussbaum co-chairs Whiteford's Business Solutions, Restructuring & Financial Litigation section and co-manages the firm's New York City office, with decades of experience in high-stakes litigation involving multi-billion-dollar enterprises.",
      "For serious injury matters, Paul brings the financial-litigation depth that complex cases demand — tracing coverage, corporate responsibility, and recovery sources that less-resourced firms can miss.",
    ],
    initials: "PN",
  },
];

export function getAttorneys(): Attorney[] {
  return BASE.map((a) => {
    const rel = `/brand/attorneys/${a.slug}.jpg`;
    const abs = path.join(process.cwd(), "public", rel);
    return { ...a, photo: fs.existsSync(abs) ? rel : undefined };
  });
}

export const JURISDICTION_NOTE =
  "Attorneys are admitted in the jurisdictions listed in their official firm profiles. Colorado matters are led through Whiteford's Colorado-admitted attorneys; additional firm trial counsel appear in Colorado courts pro hac vice where appropriate and permitted.";
