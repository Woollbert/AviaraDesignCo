import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PuckRender from "@/components/PuckRender";
import ServiceCityPage from "@/components/ServiceCityPage";
import CityPage, { buildCityFaqJsonLd } from "@/components/CityPage";
import { loadPage, listPageSlugs } from "@/lib/pages";
import { cities, findCity } from "@/data/cities";
import { serviceCityCombos, findServiceCity } from "@/data/serviceCities";
import { site } from "@/data/site";

// This single dynamic route handles THREE unrelated source-of-truth concerns
// at the same URL depth, because Next.js permits only one dynamic-param
// name per routing level (you can't have both [slug] and [serviceCity]).
//
// On render we try in order:
//   1. city hub page (home-staging-temecula, etc.) from src/content/cities/
//   2. service × city combo (vacant-home-staging-temecula, etc.)
//   3. a Puck-managed page from src/content/pages/<slug>.json
//   4. 404
//
// City hubs used to be one hand-written route file each; they moved here so
// a city created in the CMS goes live without a code change.
//
// dynamicParams=false means the route ONLY matches the slugs we enumerate
// in generateStaticParams below — every other unmatched top-level URL
// falls through to the 404 page.
export const dynamicParams = false;

export async function generateStaticParams() {
  const puckSlugs = (await listPageSlugs()).filter((s) => s !== "home");
  const citySlugs = cities.map((c) => c.slug);
  const serviceCitySlugs = serviceCityCombos.map((c) => c.slug);
  return [...puckSlugs, ...citySlugs, ...serviceCitySlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = findCity(slug);
  if (city) {
    return {
      title: { absolute: city.metaTitle },
      description: city.metaDescription,
      alternates: { canonical: `/${city.slug}/` },
      openGraph: {
        title: city.metaTitle,
        description: city.metaDescription,
        url: `/${city.slug}/`,
        images: [
          {
            url: "/images/stagedlivingroom_stonefireplace_aviaradesignco_homestaging-og.jpg",
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  }
  const combo = findServiceCity(slug);
  if (!combo) {
    // Puck pages don't currently emit metadata; let layout defaults apply.
    return {};
  }
  const title = `${combo.service.name} in ${combo.city.city}, CA`;
  const description = `${combo.service.name.toLowerCase()} in ${combo.city.city} from ${site.name} — ${combo.service.short}`;
  return {
    title,
    description,
    alternates: { canonical: `/${combo.slug}/` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: `${site.url}/${combo.slug}/`,
      images: [{ url: combo.service.imageUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. City hub
  const city = findCity(slug);
  if (city) {
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

  // 2. Service × city
  const combo = findServiceCity(slug);
  if (combo) {
    const base = site.url.replace(/\/$/, "");
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: `Home staging in ${combo.city.city}`,
          item: `${base}/${combo.city.slug}/`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${combo.service.name} in ${combo.city.city}`,
          item: `${base}/${combo.slug}/`,
        },
      ],
    };
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
        <ServiceCityPage combo={combo} />
      </>
    );
  }

  // 3. Puck-managed page
  const data = await loadPage(slug);
  if (data) return <PuckRender data={data} />;

  // 4. Not found
  notFound();
}
