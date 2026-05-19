import { notFound } from 'next/navigation';
import PuckRender from '@/components/PuckRender';
import { loadPage, listPageSlugs } from '@/lib/pages';

// Statically generate Puck-managed pages on build. NOTE: Aviara has existing
// hand-coded pages (page.tsx, etc.) — those win against any same-slug Puck
// page. To make an existing page Puck-managed, delete the hand-coded version
// and add src/content/pages/<slug>.json.
export async function generateStaticParams() {
  const slugs = await listPageSlugs();
  return slugs.filter((s) => s !== 'home').map((slug) => ({ slug }));
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadPage(slug);
  if (!data) notFound();
  return <PuckRender data={data} />;
}
