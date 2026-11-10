// Everything Thelma may want to edit lives in this one file.

export const site = {
  name: "Thelma Bamanteeh Naroog",
  firstName: "Thelma",
  role: "Digital Marketer",
  tagline: "Building brands that people remember.",
  description:
    "Digital marketing portfolio of Thelma Bamanteeh Naroog — social media, content strategy, SEO and analytics.",
  url: "https://thelma-portfolio.vercel.app", // update after first Vercel deploy / custom domain

  contact: {
    email: "tnaroog@gmail.com",
    phone: "+233 20 250 8302",
    linkedin: "", // e.g. "https://www.linkedin.com/in/your-handle" — card hides while empty
    resume: "", // e.g. a Google Drive share link or "/Thelma-Naroog-CV.pdf" placed in /public
    location: "Accra, Ghana",
  },
};

export const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "videos", label: "Videos" },
  { id: "growth", label: "Growth" },
  { id: "contact", label: "Contact" },
];

export const skills = [
  "Social Media Marketing",
  "Content Strategy & Creation",
  "Search Engine Optimisation",
  "Keyword Research",
  "Email Marketing",
  "Paid Advertising",
  "Audience Research",
  "Digital Marketing Analytics",
  "Canva Design",
];

export const toolkit = [
  "Canva",
  "Google Analytics",
  "Google Search Console",
  "Meta Business Suite",
  "Google Ads",
  "Mailchimp",
  "Google Trends",
  "CapCut",
  "Facebook",
  "Instagram",
  "Google Sheets",
  "ChatGPT",
  "Semrush",
];

export type Stat = { label: string; value: string; note: string; tone: "dark" | "light" | "lilac" | "violet" | "blue" | "gold" };

export const caseStudies: {
  id: string;
  tag: string;
  kind: "Campaign" | "Assignment";
  title: string;
  meta: string[];
  summary: string;
  images: { src: string; alt: string; w: number; h: number }[];
  stats: Stat[];
  highlight?: string;
  footnote?: string;
}[] = [
  {
    id: "stukent",
    tag: "Simulation results",
    kind: "Assignment",
    title: "Social Media Simulation",
    meta: ["Stukent Mimic Simternship", "Facebook · Instagram · TikTok · Pinterest"],
    summary:
      "Planned and ran organic, paid and influencer social campaigns across ten simulated rounds — choosing channels, posting frequency and content mix to hit impression and revenue goals.",
    images: [
      { src: "/images/work/stukent-round3.webp", alt: "Stukent dashboard, round 3: 119,972 impressions and $20,130 revenue", w: 414, h: 896 },
      { src: "/images/work/stukent-round10.webp", alt: "Stukent dashboard, round 10: 1,560,987 impressions and $110,756 revenue", w: 414, h: 896 },
    ],
    stats: [
      { label: "Round 3 · Revenue", value: "$20,130", note: "447% of $4,500 goal", tone: "dark" },
      { label: "Round 3 · Impressions", value: "119,972", note: "200% of 60,000 goal", tone: "light" },
      { label: "Round 10 · Revenue", value: "$110,756", note: "222% of $50,000 goal", tone: "lilac" },
      { label: "Round 10 · Impressions", value: "1,560,987", note: "156% of 1,000,000 goal", tone: "dark" },
    ],
    highlight: "+$75,386 above goal across both rounds",
    footnote: "Simulated campaigns, not live client results.",
  },
  {
    id: "klm",
    tag: "Campaign brief",
    kind: "Campaign",
    title: "KLM Creative Studio Campaign",
    meta: ["7-day social media campaign", "Instagram + TikTok", "5–11 October 2026"],
    summary:
      "A one-week campaign brief for professional portrait photography, built around the theme “Your First Impression Starts Here” — with a posting calendar, captions and clear conversion goals.",
    images: [{ src: "/images/work/klm-brief.webp", alt: "KLM Creative Studio campaign brief document on a phone", w: 384, h: 758 }],
    stats: [
      { label: "Goal · Enquiries", value: "10", note: "qualified photography enquiries", tone: "violet" },
      { label: "Goal · Bookings", value: "3", note: "confirmed bookings by 18 Oct", tone: "blue" },
      { label: "Duration", value: "7 days", note: "Mon 5 – Sun 11 October 2026", tone: "lilac" },
    ],
    highlight: "“Your First Impression Starts Here”",
  },
  {
    id: "seo",
    tag: "Assignment",
    kind: "Assignment",
    title: "SEO Keyword Research",
    meta: ["Semrush + Google Trends", "Luxury hotels in Accra, Ghana", "US data"],
    summary:
      "Researched search demand for luxury hotels in Accra to find a realistic, high-intent keyword to target — balancing volume, difficulty, cost per click and rising trends.",
    images: [
      { src: "/images/work/semrush-overview.webp", alt: "Semrush keyword overview for luxury hotels in accra ghana", w: 532, h: 275 },
      { src: "/images/work/trends-rising.webp", alt: "Google Trends rising queries for hotels in Ghana", w: 470, h: 280 },
      { src: "/images/work/keyword-table.webp", alt: "Semrush keyword table with volumes and difficulty", w: 525, h: 350 },
    ],
    stats: [
      { label: "Target keyword", value: "luxury hotels in accra ghana", note: "Transactional search intent", tone: "violet" },
      { label: "Volume", value: "110", note: "searches / month", tone: "dark" },
      { label: "Difficulty", value: "23%", note: "Semrush: easy", tone: "gold" },
      { label: "CPC", value: "$1.02", note: "per click", tone: "lilac" },
      { label: "Trends", value: "+90%", note: "hotels in ghana accra", tone: "violet" },
    ],
  },
];

export const certificates = [
  { org: "Stukent", title: "Social Media Simternship", date: "Oct 31, 2026", img: "/images/certs/stukent.webp", tone: "violet" },
  { org: "Semrush Academy", title: "SEO Crash Course with Brian Dean", date: "Valid until Sep 2027", img: "/images/certs/semrush.webp", tone: "dark" },
  { org: "Forage", title: "Omnichannel Marketing Job Simulation", date: "Oct 10, 2026", img: "/images/certs/forage.webp", tone: "gold" },
  { org: "DataCamp", title: "Analyzing Social Media Data in R", date: "4 hrs · Oct 7, 2026", img: "/images/certs/datacamp.webp", tone: "lilac" },
] as const;
