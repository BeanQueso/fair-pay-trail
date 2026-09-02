export interface SimilarCase {
  id: string;
  number: number;
  name: string;
  court: string;
  year: string;
  link: string;
  topics: string[];
  summary: string;
  relevance: string;
}

export const similarCases: SimilarCase[] = [
  {
    id: "c1",
    number: 1,
    name: "Anderson v. Mt. Clemens Pottery Co.",
    court: "U.S. Supreme Court",
    year: "1946",
    link: "https://supreme.justia.com/cases/federal/us/328/680/",
    topics: ["Burden of proof", "Missing records"],
    summary:
      "A landmark Supreme Court decision establishing the evidentiary standard for FLSA claims. When an employer fails to keep accurate records of hours worked, the employee cannot be denied recovery simply because they cannot prove the precise extent of uncompensated work. The employee need only show the amount and extent of unpaid work \"as a matter of just and reasonable inference\" — then the burden shifts to the employer to produce exact records or disprove that inference.",
    relevance:
      "The legal bedrock for this app: workers do not need perfect corporate timecards. Gathering messy, incomplete evidence — texts, photos of schedules — into a structured timeline is how the \"just and reasonable inference\" gets built.",
  },
  {
    id: "c2",
    number: 2,
    name: "Tyson Foods, Inc. v. Bouaphakeo",
    court: "U.S. Supreme Court",
    year: "2016",
    link: "https://supreme.justia.com/cases/federal/us/577/442/",
    topics: ["Class actions", "Representative evidence"],
    summary:
      "The Supreme Court confirmed that liability can be established using a \"representative sample\" of evidence, especially where that is the only feasible route because the employer kept no accurate records. Representative evidence was used to show uncompensated time spent donning and doffing protective gear.",
    relevance:
      "If several workers from the same employer document their experience, the aggregated picture can serve as the representative sample advocates need to build a collective or class action.",
  },
  {
    id: "c3",
    number: 3,
    name: "Kuebel v. Black & Decker (U.S.) Inc.",
    court: "Second Circuit",
    year: "2011",
    link: "https://law.justia.com/cases/federal/appellate-courts/ca2/10-2273/10-2273_opn-2011-05-05.html",
    topics: ["Off-the-clock work", "Digital records"],
    summary:
      "The Second Circuit held that an employee raised genuine issues of fact on \"off-the-clock\" claims through just and reasonable inference. It was common for the employee to sync his PDA late at night at home, and the employer's failure to keep proper records entitled him to a lenient burden of proof in estimating that time.",
    relevance:
      "Direct support for digital off-the-clock work: email timestamps, app logs, and after-hours messages are a legally valid way to estimate uncompensated time.",
  },
  {
    id: "c4",
    number: 4,
    name: "Allen v. Board of Public Education",
    court: "Eleventh Circuit",
    year: "2007",
    link: "https://law.justia.com/cases/federal/appellate-courts/ca11/495/1306/",
    topics: ["Constructive knowledge", "Overtime policy"],
    summary:
      "The Eleventh Circuit addressed when an employer has \"suffered or permitted\" off-the-clock work. A formal policy for reporting overtime does not protect an employer that practically prevents, discourages, or ignores accurate reporting. Constructive knowledge is imputed when the employer has reason to believe employees work beyond their shifts — for example, receiving work product after hours.",
    relevance:
      "If manager texts show work being requested or received after hours while the pay stub shows exactly forty hours, that discrepancy is evidence of constructive knowledge — not a worker's failure to file the right form.",
  },
  {
    id: "c5",
    number: 5,
    name: "Monroe v. FTS USA, LLC",
    court: "Sixth Circuit",
    year: "2021",
    link: "https://law.justia.com/cases/federal/appellate-courts/ca6/20-6289/20-6289-2021-11-08.html",
    topics: ["Time shaving", "Willful violations"],
    summary:
      "Cable technicians were subject to a company-wide time-shaving policy requiring them to underreport overtime. The jury determined average unrecorded hours using representative testimony, and the court affirmed willful FLSA violations — which extended the recovery window from two years to three.",
    relevance:
      "Comparing scheduled hours against pay stub hours across pay periods is how systemic time-shaving shows up. A willful pattern can widen the recovery window to three years.",
  },
  {
    id: "c6",
    number: 6,
    name: "Gamero v. Koodo Sushi Corp.",
    court: "S.D.N.Y. (district court)",
    year: "2019",
    link: "https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1:2019cv08549/522815/69/",
    topics: ["Wage notices", "Statutory penalties"],
    summary:
      "A district court found willful violations of the FLSA and New York Labor Law, awarding liquidated damages, back wages, and statutory penalties for the employer's failure to provide proper, accurate wage statements and spread-of-hours pay.",
    relevance:
      "Pay stubs themselves are evidence. Missing employer addresses, wrong hourly rates, or absent dates on a stub can carry their own statutory penalties on top of the unpaid wages.",
  },
  {
    id: "c7",
    number: 7,
    name: "Braun v. Wal-Mart Stores, Inc.",
    court: "Pennsylvania Supreme Court",
    year: "2014",
    link: "https://law.justia.com/cases/pennsylvania/supreme-court/2014/33-eap-2012.html",
    topics: ["Missed breaks", "Aggregate damages"],
    summary:
      "A class action where employees proved they were forced to miss paid rest breaks and meal breaks and to work off the clock. Liability was computed class-wide from average pay rates multiplied by hours that should have been paid, and the court rejected the argument that this was an improper \"trial by formula.\"",
    relevance:
      "Small, repeated violations add up. Consistently missed fifteen-minute breaks across a timeline can become a substantial claim, which is why break time is worth recording.",
  },
  {
    id: "c8",
    number: 8,
    name: "Brock v. Seto",
    court: "Ninth Circuit",
    year: "1988",
    link: "https://law.justia.com/cases/federal/appellate-courts/F2/850/586/3448/",
    topics: ["Approximate damages", "False payroll records"],
    summary:
      "Where an employer's payroll records are inaccurate or false, the employee meets their burden by showing the extent of work through just and reasonable inference. Damages may be awarded even if the final figure is only approximate, relying on consistent employee testimony and partial records.",
    relevance:
      "An estimate does not have to be exact to the minute. Pattern-based estimates — \"about six hours every Saturday, per these texts\" — can still produce a defensible claim value.",
  },
  {
    id: "c9",
    number: 9,
    name: "Donovan v. New Floridian Hotel, Inc.",
    court: "Eleventh Circuit",
    year: "1982",
    link: "https://law.justia.com/cases/federal/appellate-courts/F2/676/468/51393/",
    topics: ["Misclassification", "Economic realities"],
    summary:
      "The Eleventh Circuit applied the \"economic realities\" test and found that people labeled \"associates,\" \"volunteers,\" or \"independent contractors\" at a commercial enterprise were statutory employees under the FLSA, fully entitled to minimum wage and back pay.",
    relevance:
      "A job title does not decide the question. Workers called contractors, trainees, or volunteers may still be employees — set schedules and employer-provided tools point that way.",
  },
  {
    id: "c10",
    number: 10,
    name: "Chao v. Gotham Registry, Inc.",
    court: "Second Circuit",
    year: "2011",
    link: "https://law.justia.com/cases/federal/appellate-courts/ca2/06-2432/06-2432-cv_opn-2011-03-27.html",
    topics: ["Unapproved overtime"],
    summary:
      "A medical staffing agency violated the FLSA by failing to pay overtime for unauthorized hours worked by nurses. Merely announcing a rule against overtime is not enough to avoid liability: if the employer suffers or permits the work and does not exercise reasonable diligence to prevent it, it must pay time and a half.",
    relevance:
      "\"We won't pay it because it wasn't pre-approved\" is not a defense. Documented hours worked count, regardless of internal approval policies.",
  },
  {
    id: "c11",
    number: 11,
    name: "Pruell v. Caritas Christi",
    court: "D. Mass. (district court)",
    year: "2013",
    link: "https://law.justia.com/cases/federal/district-courts/massachusetts/madce/1:2009cv11466/124199/142/",
    topics: ["Auto-deductions", "Meal breaks"],
    summary:
      "Hospital workers challenged a network-wide policy of automatically deducting thirty minutes for meal breaks that were often worked through, along with unpaid pre- and post-shift work such as mandatory training. The court addressed what must be pleaded to state a plausible unpaid overtime claim over systemic time deductions.",
    relevance:
      "Watch for automatic deductions: a stub showing 37.5 hours for a scheduled 40-hour week usually means a daily half-hour was removed. Messages or logs from that window can put the time back.",
  },
  {
    id: "c12",
    number: 12,
    name: "Ives v. Manchester Subaru, Inc.",
    court: "New Hampshire Supreme Court",
    year: "1985",
    link: "https://law.justia.com/cases/new-hampshire/supreme-court/1985/126-nh-796.html",
    topics: ["State law", "Liquidated damages"],
    summary:
      "The court defined a \"willful\" wage violation as a voluntary act committed with knowledge of the obligation and the financial ability to pay — which triggers additional liability for liquidated damages under state law.",
    relevance:
      "State rules differ from federal ones. In some states the worker must show willfulness to unlock double damages, which makes written refusals to pay especially worth saving.",
  },
];

export const caseTopics = Array.from(new Set(similarCases.flatMap((c) => c.topics))).sort();
