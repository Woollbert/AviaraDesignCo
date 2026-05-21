// City landing pages for local SEO. Each entry generates a static route at
// /home-staging-<city-slug>/ targeting queries like "home staging in <city>".
// Add a new city by appending to this array — sitemap.ts and the route folder
// pick it up automatically (route folder must be created manually).

export type CityFAQ = {
  question: string;
  answer: string;
};

export type City = {
  slug: string;
  city: string;
  county: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  whyStaging: string[];
  localProof: string;
  neighborhoods: string[];
  faqs: CityFAQ[];
  nearbyCitySlugs: string[];
};

export const cities: City[] = [
  {
    slug: "home-staging-temecula",
    city: "Temecula",
    county: "Riverside County",
    metaTitle: "Home Staging in Temecula, CA | Aviara Design Co.",
    metaDescription:
      "Licensed and insured home staging in Temecula, CA. Family-owned studio offering vacant and occupied staging that helps homes sell faster across the Temecula Valley.",
    h1: "Home Staging in Temecula, CA",
    intro:
      "Aviara Design Co. is a family-owned home staging and interior design studio based in Temecula. We help Temecula Valley homeowners and listing agents present their properties at their absolute best — from full vacant installs in the wine country foothills to occupied edits in established neighborhoods. Every project is led by the same three faces from first walkthrough to final styled vignette.",
    whyStaging: [
      "Temecula buyers are comparing dozens of listings online before they ever schedule a tour. Listings that look bright, intentional, and move-in ready in photos win the clicks.",
      "The Temecula Valley market rewards a polished, livable-luxury aesthetic — neutral palettes, natural light, and outdoor flow. Generic staging templates miss the mark here.",
      "Properly staged Temecula homes typically photograph better, attract more showings, and reduce time on market — especially in the $750K+ price point where buyer expectations are highest.",
    ],
    localProof:
      "We've staged homes across Temecula including the Temeku Hills Golf Estate — a full vacant install for a luxury listing. View the project in our portfolio.",
    neighborhoods: [
      "Temeku Hills",
      "Redhawk",
      "Wolf Creek",
      "Paseo del Sol",
      "Vail Ranch",
      "Crowne Hill",
      "Morgan Hill",
      "Meadowview",
      "De Luz",
      "Wine Country",
    ],
    faqs: [
      {
        question: "How much does home staging cost in Temecula?",
        answer:
          "Staging investment depends on the home's square footage, the number of rooms staged, and whether the property is vacant or occupied. Vacant installs in Temecula typically include the living room, dining room, primary bedroom, and key supporting spaces. Reach out for a no-obligation walkthrough and quote.",
      },
      {
        question: "Do you serve all of the Temecula Valley?",
        answer:
          "Yes. We regularly stage in Temecula, Murrieta, Menifee, and Fallbrook, plus surrounding wine country properties. We're licensed and insured and can travel for the right project anywhere in Southern California.",
      },
      {
        question: "How quickly can you stage a Temecula listing?",
        answer:
          "For most Temecula projects we can hold a walkthrough within a few days of inquiry and install within one to two weeks, depending on scope and inventory availability. Time-sensitive listings can often be accommodated — call us to discuss.",
      },
    ],
    nearbyCitySlugs: ["home-staging-murrieta", "home-staging-menifee", "home-staging-fallbrook"],
  },
  {
    slug: "home-staging-murrieta",
    city: "Murrieta",
    county: "Riverside County",
    metaTitle: "Home Staging in Murrieta, CA | Aviara Design Co.",
    metaDescription:
      "Family-owned home staging in Murrieta, CA. Vacant and occupied staging that helps listings sell faster across Murrieta and the I-15 corridor.",
    h1: "Home Staging in Murrieta, CA",
    intro:
      "Aviara Design Co. stages homes throughout Murrieta — from family properties in established neighborhoods like Greer Ranch and Copper Canyon to luxury listings in Bear Creek and the Murrieta hot springs corridor. As a family-owned studio just minutes south in Temecula, we're a true local partner for Murrieta listing agents and homeowners.",
    whyStaging: [
      "Murrieta's competitive listing market means buyers often see your home in photos first. Staged listings consistently get more saves and showings than unstaged ones.",
      "Move-up buyers in Murrieta are looking for homes that feel ready and well-cared-for. Staging removes the visual clutter and helps buyers imagine their own lives in the space.",
      "Whether you're listing a new-build in Greer Ranch or an estate in Bear Creek, staging tailored to the property and the local buyer pool delivers a stronger first impression.",
    ],
    localProof:
      "We work across the Murrieta market regularly and partner with local realtors throughout the I-15 corridor. View our portfolio for recent installs.",
    neighborhoods: [
      "Greer Ranch",
      "Bear Creek",
      "Copper Canyon",
      "California Oaks",
      "Murrieta Hot Springs",
      "Spencer's Crossing",
      "The Colony",
      "Mapleton",
      "Antelope Hills",
    ],
    faqs: [
      {
        question: "Do you stage occupied homes in Murrieta?",
        answer:
          "Yes. Occupied staging is one of our most-requested services in Murrieta — we work with your existing furniture, edit and re-arrange for flow, and supplement with our own accessories and art where needed. It's a budget-friendly way to get the benefits of staging without a full furniture rental.",
      },
      {
        question: "Can you stage just the main living areas?",
        answer:
          "Absolutely. Many Murrieta listings benefit from a partial install — typically the living room, dining area, kitchen styling, and primary bedroom. We tailor scope to your budget and the rooms that will most impact buyer perception.",
      },
      {
        question: "How far in advance should I book staging?",
        answer:
          "For Murrieta listings we recommend reaching out 2–3 weeks before your target listing date so we can schedule the walkthrough, finalize design, and install before photos. We can sometimes accommodate faster timelines — please ask.",
      },
    ],
    nearbyCitySlugs: ["home-staging-temecula", "home-staging-menifee", "home-staging-fallbrook"],
  },
  {
    slug: "home-staging-menifee",
    city: "Menifee",
    county: "Riverside County",
    metaTitle: "Home Staging in Menifee, CA | Aviara Design Co.",
    metaDescription:
      "Home staging in Menifee, CA from a licensed, family-owned studio. Vacant and occupied staging tailored to Menifee's growing family neighborhoods.",
    h1: "Home Staging in Menifee, CA",
    intro:
      "Aviara Design Co. serves Menifee homeowners and agents with home staging that translates cleanly to camera and to life. Menifee is one of Southern California's fastest-growing cities, and that means a steady stream of fresh new-build inventory competing for buyer attention. We help your listing stand out.",
    whyStaging: [
      "Menifee has more new construction and resale inventory than ever, which makes presentation the differentiator. A staged home reads as cared-for and ready in a sea of similar floor plans.",
      "First-time and move-up buyers in Menifee respond strongly to homes that feel warm and family-friendly. Our livable-luxury aesthetic lands well with this buyer pool.",
      "Vacant installs in Menifee help buyers understand scale and flow in newer floor plans where empty rooms can feel disorienting.",
    ],
    localProof:
      "We've completed projects in Menifee including the Menifee family home featured in our portfolio — a full occupied staging that helped present the property at its best.",
    neighborhoods: [
      "Menifee Lakes",
      "Audie Murphy Ranch",
      "Heritage Lake",
      "Sun City",
      "Romoland",
      "Sun Vista",
      "The Lakes",
      "Quail Valley",
    ],
    faqs: [
      {
        question: "Is staging worth it for newer Menifee homes?",
        answer:
          "Yes — especially for newer Menifee homes. New construction can feel sterile or generic in listing photos when empty. Staging adds warmth, defines room purposes, and helps buyers connect emotionally with the space.",
      },
      {
        question: "Do you work with Menifee listing agents?",
        answer:
          "Regularly. We partner with realtors across Menifee and the wider Riverside County market. Agents appreciate our clear pricing, predictable schedule, and consistent quality.",
      },
      {
        question: "Can you stage homes in active 55+ communities?",
        answer:
          "Yes. We've staged homes in Sun City and other Menifee 55+ communities. Staging in these neighborhoods often centers on creating a calm, easy-living aesthetic that resonates with active adult buyers.",
      },
    ],
    nearbyCitySlugs: ["home-staging-temecula", "home-staging-murrieta", "home-staging-fallbrook"],
  },
  {
    slug: "home-staging-fallbrook",
    city: "Fallbrook",
    county: "San Diego County",
    metaTitle: "Home Staging in Fallbrook, CA | Aviara Design Co.",
    metaDescription:
      "Home staging in Fallbrook, CA. Aviara Design Co. — a family-owned studio specializing in luxury estate staging across Fallbrook's avocado country and gated communities.",
    h1: "Home Staging in Fallbrook, CA",
    intro:
      "Aviara Design Co. brings livable-luxury staging to Fallbrook estates, custom homes, and avocado country properties. Fallbrook listings often require a more elevated staging approach — larger square footage, indoor-outdoor flow, and a buyer pool that's actively comparing your home to other luxury options across North County San Diego.",
    whyStaging: [
      "Fallbrook's luxury and estate buyers expect homes that feel curated and intentional. Empty or underdressed homes can struggle to compete in this price band.",
      "Larger Fallbrook homes need careful scale and proportion — generic staging often makes rooms feel smaller, not bigger. Our work emphasizes the architecture and views.",
      "Indoor-outdoor flow is a major selling point in Fallbrook. We stage exterior living spaces alongside the interior to communicate the full lifestyle.",
    ],
    localProof:
      "We've staged in Fallbrook including the Fallbrook Estate featured in our portfolio — a luxury install showcasing the home's full estate-living potential.",
    neighborhoods: [
      "Champagne Crest",
      "Saratoga Estates",
      "Fallbrook Hills",
      "Live Oak Park",
      "Rancho Monserate",
      "Gird Valley",
      "Bonsall (adjacent)",
    ],
    faqs: [
      {
        question: "Do you stage estate homes in Fallbrook?",
        answer:
          "Yes — luxury and estate staging is one of our strongest specialties. We tailor inventory, scale, and styling to homes in the $1.5M+ band where presentation directly impacts both speed of sale and final offers.",
      },
      {
        question: "Can you stage outdoor living areas?",
        answer:
          "Absolutely. Fallbrook properties often have pools, patios, vineyards, and entertaining areas that are central to the lifestyle. We stage these spaces alongside interiors to convey the full value of the home.",
      },
      {
        question: "How long is a Fallbrook staging install live?",
        answer:
          "Staging is typically installed for the duration of your active listing, with monthly extensions if needed. Most Fallbrook listings sell well within the initial term — we'll discuss timing during the walkthrough.",
      },
    ],
    nearbyCitySlugs: ["home-staging-temecula", "home-staging-murrieta", "home-staging-menifee"],
  },
];

export function findCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
