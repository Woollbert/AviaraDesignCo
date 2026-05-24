import type { Metadata } from "next";
import CityPage, { buildCityFaqJsonLd } from "@/components/CityPage";
import { findCity } from "@/data/cities";
import { notFound } from "next/navigation";

const city = findCity("home-staging-big-bear-lake");

export const metadata: Metadata = {
  title: city?.metaTitle ?? "Home Staging in Big Bear Lake, CA",
  description: city?.metaDescription,
  alternates: { canonical: "/home-staging-big-bear-lake/" },
  openGraph: {
    title: city?.metaTitle,
    description: city?.metaDescription,
    url: "/home-staging-big-bear-lake/",
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
