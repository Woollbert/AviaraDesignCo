export type ProcessStep = {
  number: string;
  title: string;
  body: string;
};

export const process: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    body: "We meet you on-site, walk every room, and listen to the home's bones, the buyer it deserves, and the timeline you're working against. For busy agents, we also offer virtual consultations so a project can move forward without slowing your week down.",
  },
  {
    number: "02",
    title: "Design",
    body: "Our team curates a palette of furnishings, textiles, art, and accessories tuned to the architecture, the market, and the asking price.",
  },
  {
    number: "03",
    title: "Install",
    body: "A coordinated install day transforms the space. Every detail is set, styled, and photographed to its best advantage.",
  },
  {
    number: "04",
    title: "Deliver",
    body: "We hand the home back ready for the lens, the listing, and the open house. Your only job is to greet the offers.",
  },
];

export const valueProps: { title: string; body: string }[] = [
  {
    title: "Livable, Not Loud",
    body: "Our staging reads as a home people want to live in, not a showroom. That's what makes buyers stay an extra ten minutes.",
  },
  {
    title: "Editorial Eye",
    body: "Every accessory, frame, and fold is placed with intention. The result photographs beautifully and shows beautifully.",
  },
  {
    title: "Boutique Service",
    body: "You work directly with our principal designer and a small, senior team. No hand-offs, no template installs.",
  },
  {
    title: "Faster Sales",
    body: "Our staged listings consistently move faster and stronger than market averages. The data backs it up.",
  },
  {
    title: "Family Owned",
    body: "We're a family-owned, licensed and insured studio. We treat every home like it's the most important one we've staged.",
  },
];
