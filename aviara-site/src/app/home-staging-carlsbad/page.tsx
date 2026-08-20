import type { Metadata } from "next";
import CityPage, { buildCityFaqJsonLd } from "@/components/CityPage";
import { findCity } from "@/data/cities";
import { notFound } from "next/navigation";

const city = findCity("home-staging-carlsbad");

export const metadata: Metadata = {
  title: { absolute: city?.metaTitle ?? "Home Staging in Carlsbad, CA" },
  description: city?.metaDescription,
  alternates: { canonical: "/home-staging-carlsbad/" },
  openGraph: {
    title: city?.metaTitle,
    description: city?.metaDescription,
    url: "/home-staging-carlsbad/",
    images: [{ url: "/images/stagedlivingroom_stonefireplace_aviaradesignco_homestaging-og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  if (!city) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCityFaqJsonLd(city)) }}
      />
      <CityPage city={city} />
    </>
  );
}
