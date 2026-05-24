// City landing pages for local SEO. Each entry generates a static route at
// /home-staging-<city-slug>/ targeting queries like "home staging in <city>".
// Add a new city by appending to this array — sitemap.ts and the route folder
// pick it up automatically (route folder must be created manually).

export type CityFAQ = {
  question: string;
  answer: string;
};

export type CityServiceNote = {
  name: string;
  note: string;
};

export type CityMistake = {
  title: string;
  body: string;
};

export type City = {
  slug: string;
  city: string;
  county: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  // Longer market context (paragraphs). Drives the "Market Context" section.
  marketContext?: string[];
  whyStaging: string[];
  localProof: string;
  // Per-service local notes — how each Aviara service applies in this city.
  serviceNotes?: CityServiceNote[];
  neighborhoods: string[];
  // Common mistakes sellers/agents in this city make.
  commonMistakes?: CityMistake[];
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
    marketContext: [
      "Temecula is one of the most distinct real estate markets in Southern California — a mix of master-planned family neighborhoods, custom estates on the wine country foothills, and a steady inflow of move-up buyers from coastal San Diego and Orange County looking for more land and more home for the money. Pricing in the core resale market typically runs from the upper $700Ks for established three- and four-bedroom homes into the $2M+ range for newer luxury builds and view properties on the De Luz and Wine Country side.",
      "The buyer pool here skews toward growing families and remote-working professionals who prioritize indoor-outdoor flow, valley views, and a livable-luxury aesthetic — warm neutrals, natural materials, and brass or matte black accents rather than bright trend colors. Generic, transactional staging that works in a coastal market often misses in Temecula; the homes are larger, the entertaining spaces are central, and the photographs need to convey the lifestyle, not just the floor plan.",
      "Because Temecula buyers are typically comparing your listing to ten or fifteen similar floor plans before they ever schedule a tour, the photos do most of the heavy lifting. A staged Temecula home tends to photograph dramatically better — defined room purposes, clean sight lines, a sense of scale — and that translates directly into more saves on the listing portals, more showings booked, and a meaningfully shorter time-on-market in the $750K+ band where buyer expectations are highest.",
    ],
    whyStaging: [
      "Temecula buyers are comparing dozens of listings online before they ever schedule a tour. Listings that look bright, intentional, and move-in ready in photos win the clicks.",
      "The Temecula Valley market rewards a polished, livable-luxury aesthetic — neutral palettes, natural light, and outdoor flow. Generic staging templates miss the mark here.",
      "Properly staged Temecula homes typically photograph better, attract more showings, and reduce time on market — especially in the $750K+ price point where buyer expectations are highest.",
    ],
    localProof:
      "We've staged homes across Temecula including the Temeku Hills Golf Estate — a full vacant install for a luxury listing. View the project in our portfolio.",
    serviceNotes: [
      {
        name: "Vacant Home Staging",
        note: "The right choice for empty resale listings and new-construction homes in Sommers Bend, Roripaugh Ranch, and similar Temecula communities. We deliver a full inventory of furniture, art, and accessories so every key room reads with intention and scale in listing photos.",
      },
      {
        name: "Occupied Home Staging",
        note: "Common for established Temecula neighborhoods where homeowners are still living in the home. We edit existing furnishings, re-arrange for flow, and layer in our own accessories and art to elevate the impression without disrupting daily life.",
      },
      {
        name: "Interior Design",
        note: "For Temecula homeowners not yet listing — designing a wine country property or refining a long-term residence. Same livable-luxury sensibility, scaled to how the family actually lives in the home.",
      },
      {
        name: "Staging Consultations",
        note: "A focused 90-minute walkthrough for Temecula listing agents and sellers preparing to go live. You leave with a prioritized, room-by-room playbook: what to keep, edit, repair, repaint, and add before the photographer arrives.",
      },
    ],
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
      "Sommers Bend",
      "Roripaugh Ranch",
    ],
    commonMistakes: [
      {
        title: "Leaving the outdoor living spaces unstaged",
        body: "Temecula homes sell on indoor-outdoor flow. A staged great room with an empty patio behind the glass doors tells buyers the lifestyle stops at the wall. We stage exterior living areas, dining, and entertaining zones alongside the interior so the home reads as one continuous luxury experience.",
      },
      {
        title: "Skipping the primary suite",
        body: "Many sellers stage the public-facing rooms and assume the primary bedroom doesn't matter. In Temecula's $750K+ range, the primary suite is one of the most photographed and most scrutinized spaces. A flat, untouched primary makes the rest of the home feel less curated by association.",
      },
      {
        title: "Over-decorating with personal collections",
        body: "Family photos, religious art, kids' trophies, and oversized personal collections distract buyers from picturing themselves in the space. We help homeowners gracefully edit and store these items so the home photographs as a refined, neutral backdrop for whatever life the next owner imagines.",
      },
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
      {
        question: "Do you stage homes in Temecula Wine Country and De Luz?",
        answer:
          "Yes. Wine country and De Luz properties are some of our favorite projects — they tend to have the scale and architecture that reward a thoughtful staging approach. We have specific inventory and styling moves suited to larger custom homes with views, courtyards, and indoor-outdoor living.",
      },
      {
        question: "My Temecula listing already has newer floors and a fresh paint job — do I still need staging?",
        answer:
          "Good cosmetic prep helps, but it doesn't replace staging. New floors and paint give buyers a clean canvas; staging gives them an emotional reason to want the home. We see consistently stronger photos, more showings, and stronger offers when both are done together rather than relying on cosmetic prep alone.",
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
    marketContext: [
      "Murrieta sits at the heart of the I-15 commuter corridor and has quietly become one of Southern California's strongest mid-tier family markets. The bulk of the resale inventory falls between the upper $500Ks and the low $1.2Ms — established four-bedroom homes in Greer Ranch and Copper Canyon, newer builds in Spencer's Crossing and the Mapleton corridor, and a luxury tier in Bear Creek that runs well above the median.",
      "Buyer demographics here are heavily families: young households moving up from townhomes in coastal San Diego or Orange County, two-income couples chasing the value-per-square-foot equation, and a growing number of remote-working families who've discovered they can have a yard, a pool, and a fourth bedroom in Murrieta for what a two-bedroom condo costs them in Irvine. Those buyers are decisive when they fall in love with a home — but they fall in love through the listing photos first.",
      "Because so much of Murrieta is master-planned, your listing is often competing with three or four nearly identical floor plans on the same MLS update. Presentation is the entire differentiator. Staged Murrieta homes consistently outperform unstaged comps on time-on-market and final-to-list ratio — not because the staging changes the home, but because it changes how buyers feel about the home in the seven seconds it takes them to scroll past or click through.",
    ],
    whyStaging: [
      "Murrieta's competitive listing market means buyers often see your home in photos first. Staged listings consistently get more saves and showings than unstaged ones.",
      "Move-up buyers in Murrieta are looking for homes that feel ready and well-cared-for. Staging removes the visual clutter and helps buyers imagine their own lives in the space.",
      "Whether you're listing a new-build in Greer Ranch or an estate in Bear Creek, staging tailored to the property and the local buyer pool delivers a stronger first impression.",
    ],
    localProof:
      "We work across the Murrieta market regularly and partner with local realtors throughout the I-15 corridor. View our portfolio for recent installs.",
    serviceNotes: [
      {
        name: "Vacant Home Staging",
        note: "Most-requested service for Murrieta's master-planned communities where empty resale homes can read as a builder spec sheet. A full vacant install defines room purposes, demonstrates scale, and gives the photographs the lived-in warmth buyers respond to.",
      },
      {
        name: "Occupied Home Staging",
        note: "A great fit for Murrieta families who need to keep living in the home while it's actively listed. We work with your existing pieces, edit and re-arrange for buyer flow, and supplement with our own accessories and art so the home photographs as polished without forcing a full move-out.",
      },
      {
        name: "Interior Design",
        note: "For Murrieta homeowners settling in long-term who want a home that feels designed rather than decorated. Same livable-luxury approach scaled to family life — durable materials, calm palettes, rooms that work hard but read soft.",
      },
      {
        name: "Staging Consultations",
        note: "A budget-friendly option for Murrieta sellers who want professional eyes without a full staging install. Ninety minutes onsite, room-by-room recommendations, and a clear playbook of what to address before photos.",
      },
    ],
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
      "Central Park",
    ],
    commonMistakes: [
      {
        title: "Staging only the public-facing rooms",
        body: "We see Murrieta listings every week where the living room and kitchen are beautifully staged and the primary bedroom is left with the homeowner's existing mattress on the floor and a partially empty closet. Buyers look at every room. A flat primary or unfinished secondary bedroom tells buyers the seller cut corners — and quietly invites them to make a lower offer.",
      },
      {
        title: "Pricing the staging budget too low",
        body: "Renting cheap furniture yourself and arranging it like a model home rarely works. The pieces are out of scale, the styling reads as generic, and the photos look like a furnished spec house instead of a home. The right investment in real staging for a $800K Murrieta listing typically returns multiples in faster sale and stronger offers.",
      },
      {
        title: "Listing without staging because the market 'feels hot'",
        body: "Even in a strong Murrieta market, two listings on the same street at the same price will perform very differently when one is staged and one isn't. The hot-market argument leaves money on the table — buyers may still bid, but they bid less aggressively on a home that doesn't make them emotionally commit.",
      },
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
      {
        question: "Is staging worth it for entry-level Murrieta homes under $700K?",
        answer:
          "Yes — arguably more so. Lower price points have wider buyer pools and more competing listings, which makes presentation an even sharper differentiator. A modest staging investment on a $650K Murrieta listing often returns several times over in offer strength and reduced time-on-market.",
      },
      {
        question: "Can I just rent furniture myself and skip professional staging?",
        answer:
          "You can, but the math rarely works out. Furniture-rental-only solutions miss the styling, art, and accessory layering that make staged homes photograph well. Buyers can immediately tell the difference between a real staging install and a half-furnished house — and they discount the home accordingly.",
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
    marketContext: [
      "Menifee has been one of the fastest-growing cities in Southern California for most of the last decade. New construction continues to expand the Audie Murphy Ranch, Heritage Lake, and Spencer's Crossing footprints, and active-adult communities like Sun City and The Lakes have steady resale turnover. Pricing across the city typically runs from the high $400Ks for entry-level resales into the high $800Ks for newer family homes — with the 55+ communities trading in their own distinct band.",
      "The Menifee buyer pool is more diverse than most Riverside markets: first-time buyers from the IE and east LA priced out of closer-in cities, families relocating from the coast for value and yard space, and retirees actively trading down from larger homes elsewhere into Sun City or Heritage Lake. Each of those buyer types responds to staging differently, and a one-size-fits-all aesthetic underperforms in this market.",
      "Because Menifee has so much master-planned new construction, your listing is frequently going head-to-head with three or four virtually identical floor plans listed within the same week. The differentiator is almost never the floor plan or even the upgrades — it's how the home photographs and how it feels when buyers walk in. That's the entire job of staging.",
    ],
    whyStaging: [
      "Menifee has more new construction and resale inventory than ever, which makes presentation the differentiator. A staged home reads as cared-for and ready in a sea of similar floor plans.",
      "First-time and move-up buyers in Menifee respond strongly to homes that feel warm and family-friendly. Our livable-luxury aesthetic lands well with this buyer pool.",
      "Vacant installs in Menifee help buyers understand scale and flow in newer floor plans where empty rooms can feel disorienting.",
    ],
    localProof:
      "We've completed projects in Menifee including the Menifee family home featured in our portfolio — a full occupied staging that helped present the property at its best.",
    serviceNotes: [
      {
        name: "Vacant Home Staging",
        note: "The most common Menifee staging service — empty new-build and resale homes benefit enormously from a full install that defines purpose and adds warmth. Without staging, Menifee's open-concept floor plans tend to read as confusing in photos because buyers can't anchor scale.",
      },
      {
        name: "Occupied Home Staging",
        note: "Used regularly in older Menifee neighborhoods and 55+ communities where homeowners are still living in the home. We edit, re-arrange, and supplement with curated accessories so the property reads market-ready without disrupting the seller's daily life.",
      },
      {
        name: "Interior Design",
        note: "For Menifee homeowners customizing builder-grade interiors into something that feels distinctly theirs. We work with what the home gives you — fixed cabinetry, builder neutrals — and add the layers that turn a stock floor plan into a home with character.",
      },
      {
        name: "Staging Consultations",
        note: "Especially popular with Menifee 55+ sellers downsizing — we walk the home and help prioritize what to keep, sell, donate, or repair before listing. A clean playbook saves weeks of decision fatigue.",
      },
    ],
    neighborhoods: [
      "Menifee Lakes",
      "Audie Murphy Ranch",
      "Heritage Lake",
      "Sun City",
      "Romoland",
      "Sun Vista",
      "The Lakes",
      "Quail Valley",
      "Spencer's Crossing",
    ],
    commonMistakes: [
      {
        title: "Leaving the model-home builder furniture as inspiration",
        body: "It's tempting to walk through the builder's model and try to copy what's there. The issue is buyers can immediately tell — model-home furniture is generic by design, scaled for a sales center, and reads as 'spec' rather than 'home.' A real staging install with curated, livable furnishings out-performs the model-home look every time.",
      },
      {
        title: "Not addressing builder-grade neutrals",
        body: "Most Menifee new builds ship with the same builder-neutral palette: light cabinets, cool gray walls, beige carpet. Without intentional layering, photos of these homes all look identical. Staging adds the warmth, texture, and considered styling that makes one Audie Murphy Ranch listing stand out from the other thirty.",
      },
      {
        title: "Assuming 55+ buyers don't care about staging",
        body: "Active-adult buyers in Sun City and The Lakes care deeply about presentation — they're often selling a larger home and moving into something they want to feel emotionally settled in. Skipping staging on a 55+ Menifee listing because the buyer is older is a fast way to leave money on the table.",
      },
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
      {
        question: "How does staging differ for Menifee new construction vs. resale?",
        answer:
          "New construction needs warmth, scale, and personality layered into builder-neutral interiors. Resale homes often need editing and updating — removing dated elements, refreshing color stories, and adding visual cohesion across rooms decorated over many years. We approach each accordingly.",
      },
      {
        question: "Do you handle staging for Menifee homes being sold as part of a downsize?",
        answer:
          "Yes. Downsize sellers are a meaningful share of our Menifee work. We can stage with a mix of your existing pieces and our inventory, and our consultation service is specifically designed to help sellers prioritize what stays with the home, what goes to the next residence, and what should be sold or donated before listing.",
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
    marketContext: [
      "Fallbrook is one of North County San Diego's most distinct real estate markets — rural-luxury, agriculturally rooted, and unmistakably its own thing. The bulk of the inventory worth staging falls between the low $1Ms and well into the $5M+ band for full estate properties on multiple acres, with avocado, citrus, and equestrian properties trading at premiums for the land and lifestyle they offer.",
      "Buyer demographics skew significantly affluent: families relocating from coastal San Diego seeking acreage and privacy, second-home buyers from Los Angeles and Orange County, equestrians, hobby farmers, and retirees from across California looking for a quieter version of the Southern California dream. These buyers are typically comparing your Fallbrook estate against options in Rancho Santa Fe, Olivenhain, and even further afield. The bar for presentation is high and the buyer pool is small enough that every listing needs to be a real contender.",
      "What makes Fallbrook distinct from other luxury markets is the importance of the land itself. Buyers aren't just buying a house — they're buying a vineyard, a citrus grove, a guest house, a barn, a view. Staging that ignores the outdoor living spaces, the gardens, and the supporting buildings misses the entire reason buyers are even looking at Fallbrook. The best Fallbrook listings stage the whole property as a single unified estate experience.",
    ],
    whyStaging: [
      "Fallbrook's luxury and estate buyers expect homes that feel curated and intentional. Empty or underdressed homes can struggle to compete in this price band.",
      "Larger Fallbrook homes need careful scale and proportion — generic staging often makes rooms feel smaller, not bigger. Our work emphasizes the architecture and views.",
      "Indoor-outdoor flow is a major selling point in Fallbrook. We stage exterior living spaces alongside the interior to communicate the full lifestyle.",
    ],
    localProof:
      "We've staged in Fallbrook including the Fallbrook Estate featured in our portfolio — a luxury install showcasing the home's full estate-living potential.",
    serviceNotes: [
      {
        name: "Vacant Home Staging",
        note: "Essential for vacant Fallbrook estate listings. Without staging, large custom homes can read as cavernous and unloved in photos. A full install with appropriately scaled furniture, layered art, and considered styling restores the human scale buyers need to imagine living in the property.",
      },
      {
        name: "Occupied Home Staging",
        note: "A frequent ask for long-tenured Fallbrook owners with character pieces, accumulated art, and meaningful collections. We respect what's already in the home, edit the volume, and supplement where the property needs more cohesion or contemporary balance.",
      },
      {
        name: "Interior Design",
        note: "For new Fallbrook residents personalizing an estate they've just acquired, or long-time owners ready to refresh. We work in close partnership with the architecture — Spanish revival, ranch, contemporary, modern farmhouse — and honor the property's bones while delivering livable luxury.",
      },
      {
        name: "Staging Consultations",
        note: "For Fallbrook listing agents who need a high-end playbook before the listing photographer arrives. A focused walkthrough produces room-by-room recommendations specific to the estate, the price point, and the comparable Fallbrook competition.",
      },
    ],
    neighborhoods: [
      "Champagne Crest",
      "Saratoga Estates",
      "Fallbrook Hills",
      "Live Oak Park",
      "Rancho Monserate",
      "Gird Valley",
      "Bonsall (adjacent)",
      "De Luz (adjacent)",
    ],
    commonMistakes: [
      {
        title: "Furnishing large estate rooms with small-scale pieces",
        body: "It's the single most common mistake we see in Fallbrook luxury listings: a 24-foot-ceiling great room staged with a standard-scale sofa and coffee table. The proportions broadcast 'this house is bigger than the furniture can fill,' which subconsciously tells buyers the home is too much. Estate-scale rooms need estate-scale staging.",
      },
      {
        title: "Ignoring the pools, vineyards, and outdoor living areas",
        body: "Fallbrook buyers are buying the lifestyle. An interior-only staging job in a property with a pool, vineyard, or significant outdoor entertaining area leaves the property's most distinctive selling features looking neglected in the listing photos. We stage these spaces alongside the interior so the listing tells one complete story.",
      },
      {
        title: "Forcing a contemporary aesthetic onto a Spanish revival or rancher",
        body: "Some Fallbrook homes are mid-century, some are Spanish, some are modern farmhouse, some are full Tuscan estates. Staging works best when it honors the architecture and the era of the home rather than trying to drag it into whatever's trendy on Instagram. We design staging that the home wants to wear, not staging that fights it.",
      },
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
      {
        question: "Do you stage Fallbrook properties with acreage, vineyards, or working groves?",
        answer:
          "Yes. These properties are some of our favorite to stage because the land itself is a major part of the value. We work with you to identify which outdoor spaces to feature — entertaining patios, vineyards, mature gardens, guest houses — and stage them alongside the interior so the listing communicates the whole estate.",
      },
      {
        question: "How do you handle staging for very large Fallbrook estates?",
        answer:
          "Estate-scale homes get estate-scale planning. We typically conduct a longer initial walkthrough, identify the rooms with the highest impact on buyer decisions (great room, primary suite, kitchen, entertaining areas, key outdoor spaces), and design the staging to feel cohesive across the whole property. Our inventory is sized for large rooms — appropriately scaled sofas, art, and accessories.",
      },
    ],
    nearbyCitySlugs: ["home-staging-temecula", "home-staging-murrieta", "home-staging-menifee"],
  },
];

export function findCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
