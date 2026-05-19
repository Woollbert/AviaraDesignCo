export type Project = {
  slug: string;
  title: string;
  location: string;
  category: "Vacant Staging" | "Occupied Staging" | "Interior Design";
  imageUrl: string;
  imageAlt: string;
};

export const projects: Project[] = [
  {
    slug: "fallbrook-estate",
    title: "Fallbrook Estate",
    location: "Fallbrook, CA",
    category: "Vacant Staging",
    imageUrl: "/images/A7405914.jpeg",
    imageAlt: "Open-concept kitchen, dining, and living room staged with brass and warm neutrals",
  },
  {
    slug: "menifee-family-home",
    title: "Menifee Family Home",
    location: "Menifee, CA",
    category: "Interior Design",
    imageUrl: "/images/IMG_9822.jpeg",
    imageAlt: "Cream sectional with chocolate throw, marble side table, and warm plank flooring",
  },
  {
    slug: "temeku-hills-golf-estate",
    title: "Temeku Hills Golf Estate",
    location: "Temecula, CA",
    category: "Occupied Staging",
    imageUrl: "/images/IMG_9465.jpeg",
    imageAlt: "Black dining table styled with brass flatware and a vase of deep red hydrangeas",
  },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I cannot say enough about how professional and accommodating this owner and staff are! With short notice and a home to stage for pictures she did an amazing job with a personal touch and went above the call of service! As a real estate professional I highly recommend.",
    author: "Missy D.",
    role: "Real Estate Professional · Temecula, CA · Yelp · 5 stars",
  },
];
