import type { Metadata } from "next";
import CityPage, { buildCityFaqJsonLd } from "@/components/CityPage";
import { findCity } from "@/data/cities";
import { notFound } from "next/navigation";

const city = findCity("home-staging-encinitas");

export const metadata: Metadata = {
  title: city?.metaTitle ?? "Home Staging in Encinitas, CA",
  description: city?.metaDescription,
  alternates: { canonical: "/home-staging-encinitas/" },
  openGraph: {
    title: city?.metaTitle,
    description: city?.metaDescription,
    url: "/home-staging-encinitas/",
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
