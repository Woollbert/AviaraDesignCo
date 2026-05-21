import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journalPosts, findJournalPost } from "@/data/journal";
import { site } from "@/data/site";
import Reveal from "@/components/Reveal";

export const dynamicParams = false;

export async function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findJournalPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription,
    alternates: { canonical: `/journal/${post.slug}/` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `/journal/${post.slug}/`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = findJournalPost(slug);
  if (!post) notFound();

  const baseUrl = site.url.replace(/\/$/, "");
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${baseUrl}/logo-512.png` },
    },
    mainEntityOfPage: `${baseUrl}/journal/${post.slug}/`,
  };

  return (
    <main className="bg-bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Header */}
      <section className="section bg-ink text-ivory">
        <div className="container-wide max-w-3xl">
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-brassSoft">
              <Link href="/journal/" className="hover:text-ivory transition-colors">
                Journal
              </Link>
              <span className="mx-3 text-ivory/40">·</span>
              {formatDate(post.publishedAt)}
            </p>
            <h1 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl text-ivory leading-tight">
              {post.title}
            </h1>
            <p className="mt-6 text-lg text-ivory/85 leading-relaxed">{post.excerpt}</p>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <article className="section">
        <div className="container-wide max-w-3xl">
          <div className="prose-aviara">
            {post.blocks.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2
                    key={i}
                    className="mt-12 font-display text-2xl md:text-3xl text-ink leading-tight"
                  >
                    {block.text}
                  </h2>
                );
              }
              return (
                <p key={i} className="mt-5 text-slate leading-relaxed text-lg">
                  {block.text}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      {/* CTA + nav */}
      <section className="section border-t border-line bg-ink text-ivory">
        <div className="container-wide max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow !text-brassSoft">Begin</p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ivory leading-tight">
              Thinking about staging your next listing?
            </h2>
            <p className="mt-6 text-lg text-ivory/85">
              We work with sellers and listing agents across Temecula, Murrieta, Menifee, Fallbrook, and Southern California.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/#contact" className="btn btn-ink">
                Begin a Project
              </Link>
              <Link href="/journal/" className="btn btn-ghost-light">
                More Articles
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}
