import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceCityCombos, findServiceCity } from "@/data/serviceCities";
import { site } from "@/data/site";
import ServiceCityPage from "@/components/ServiceCityPage";

// dynamicParams = false + a generateStaticParams list means this catch-all
// dynamic segment ONLY matches the slugs we've explicitly enumerated.
// Static routes (/, /portfolio/, /journal/, /service-areas/, etc.) win
// before this route ever sees the request.
export const dynamicParams = false;

export async function generateStaticParams() {
  return serviceCityCombos.map((c) => ({ serviceCity: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serviceCity: string }>;
}): Promise<Metadata> {
  const { serviceCity } = await params;
  const combo = findServiceCity(serviceCity);
  if (!combo) return { title: "Not found" };

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
      images: [{ url: combo.service.imageUrl }],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ serviceCity: string }>;
}) {
  const { serviceCity } = await params;
  const combo = findServiceCity(serviceCity);
  if (!combo) notFound();
  return <ServiceCityPage combo={combo} />;
}
