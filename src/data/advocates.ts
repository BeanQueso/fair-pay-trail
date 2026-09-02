export interface Advocate {
  id: string;
  name: string;
  kind: "Legal aid" | "Workers' center" | "Law school clinic" | "Government";
  region: string;
  states: string[];
  languages: string[];
  services: string[];
  phone?: string;
  website: string;
  cost: string;
}

/**
 * Publicly listed organisations that take wage-and-hour matters at no cost.
 * Static reference data — always confirm details with the organisation itself.
 */
export const advocates: Advocate[] = [
  {
    id: "nelp",
    name: "National Employment Law Project",
    kind: "Legal aid",
    region: "Nationwide",
    states: ["Nationwide"],
    languages: ["English", "Spanish"],
    services: ["Wage theft policy help", "Referrals to local advocates"],
    website: "https://www.nelp.org",
    cost: "Free",
  },
  {
    id: "whd",
    name: "U.S. Dept. of Labor — Wage & Hour Division",
    kind: "Government",
    region: "Nationwide",
    states: ["Nationwide"],
    languages: ["English", "Spanish", "200+ via interpreter line"],
    services: ["Files federal wage complaints", "Investigates unpaid overtime"],
    phone: "1-866-487-9243",
    website: "https://www.dol.gov/agencies/whd/contact/local-offices",
    cost: "Free",
  },
  {
    id: "lsc",
    name: "Legal Services Corporation — Find Legal Aid",
    kind: "Legal aid",
    region: "Nationwide",
    states: ["Nationwide"],
    languages: ["Varies by office"],
    services: ["Directory of local civil legal aid", "Income-based eligibility"],
    website: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help",
    cost: "Free if you qualify",
  },
  {
    id: "interfaith",
    name: "Interfaith Worker Justice network",
    kind: "Workers' center",
    region: "Nationwide",
    states: ["Nationwide"],
    languages: ["English", "Spanish"],
    services: ["Worker centers", "Wage claim clinics", "Group organising"],
    website: "https://www.iwj.org",
    cost: "Free",
  },
  {
    id: "make-the-road-ny",
    name: "Make the Road New York",
    kind: "Workers' center",
    region: "New York City & Long Island",
    states: ["NY"],
    languages: ["English", "Spanish"],
    services: ["Wage claim help", "Know-your-rights clinics", "Immigration-safe intake"],
    phone: "(718) 418-7690",
    website: "https://maketheroadny.org",
    cost: "Free",
  },
  {
    id: "legal-aid-at-work",
    name: "Legal Aid at Work",
    kind: "Legal aid",
    region: "California",
    states: ["CA"],
    languages: ["English", "Spanish", "Chinese"],
    services: ["Free workers' rights helpline", "Unpaid wages", "Retaliation"],
    phone: "(415) 864-8848",
    website: "https://legalaidatwork.org",
    cost: "Free",
  },
  {
    id: "trla",
    name: "Texas RioGrande Legal Aid",
    kind: "Legal aid",
    region: "Texas",
    states: ["TX"],
    languages: ["English", "Spanish"],
    services: ["Wage theft representation", "Farmworker & construction cases"],
    phone: "1-888-988-9996",
    website: "https://www.trla.org",
    cost: "Free",
  },
  {
    id: "raise-the-floor",
    name: "Raise the Floor Alliance",
    kind: "Workers' center",
    region: "Chicago & Illinois",
    states: ["IL"],
    languages: ["English", "Spanish", "Polish"],
    services: ["Wage claim support", "Worker center referrals"],
    phone: "(312) 795-9115",
    website: "https://www.raisetheflooralliance.org",
    cost: "Free",
  },
  {
    id: "brazilian-worker-center",
    name: "Brazilian Worker Center",
    kind: "Workers' center",
    region: "Greater Boston",
    states: ["MA"],
    languages: ["Portuguese", "Spanish", "English"],
    services: ["Wage theft clinics", "Cleaning & construction workers"],
    phone: "(617) 783-8001",
    website: "https://www.braziliancenter.org",
    cost: "Free",
  },
  {
    id: "casa",
    name: "CASA",
    kind: "Workers' center",
    region: "Maryland, Virginia, Pennsylvania",
    states: ["MD", "VA", "PA"],
    languages: ["Spanish", "English", "French"],
    services: ["Wage recovery", "Day laborer support"],
    phone: "(301) 431-4185",
    website: "https://wearecasa.org",
    cost: "Free",
  },
  {
    id: "nw-justice",
    name: "Northwest Justice Project — CLEAR",
    kind: "Legal aid",
    region: "Washington State",
    states: ["WA"],
    languages: ["English", "Spanish", "Interpreters available"],
    services: ["Statewide intake line", "Unpaid wages", "Employment"],
    phone: "1-888-201-1014",
    website: "https://nwjustice.org",
    cost: "Free if you qualify",
  },
  {
    id: "gwrp",
    name: "Georgetown Law — Workers' Rights Clinic",
    kind: "Law school clinic",
    region: "Washington, D.C. metro",
    states: ["DC", "MD", "VA"],
    languages: ["English", "Spanish"],
    services: ["Student attorneys under supervision", "Wage claims", "Hearings"],
    website: "https://www.law.georgetown.edu/experiential-learning/clinics/",
    cost: "Free",
  },
];

export const advocateKinds = ["Legal aid", "Workers' center", "Law school clinic", "Government"] as const;
