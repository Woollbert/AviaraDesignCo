import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journalPosts, findJournalPost } from "@/data/journal";
import { site } from "@/data/site";
import { services, servicePath } from "@/data/services";
import { parseInlineLinks, stripBrand } from "@/lib/seo";
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
    // stripBrand: the layout appends the brand, so drop it if the editor
    // also typed it into the SEO Title field.
    title: stripBrand(post.metaTitle?.trim() || post.title, site.name),
    description: post.metaDescription,
    alternates: { canonical: `/journal/${post.slug}/` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `/journal/${post.slug}/`,
      type: "article",
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      images: [{ url: post.coverImage ?? "/images/stagedlivingroom_stonefireplace_aviaradesignco_homestaging-og.jpg", width: 1200, height: 630 }],
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
  // BlogPosting is a sub-type of Article — slightly stronger signal for
  // Google that this is a journal/blog entry. The image field is what makes
  // the post eligible for the visual rich-result treatment in search.
  const articleImage = post.coverImage
    ? `${baseUrl}${post.coverImage.startsWith("/") ? "" : "/"}${post.coverImage}`
    : `${baseUrl}/images/stagedlivingroom_stonefireplace_aviaradesignco_homestaging-og.jpg`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: [articleImage],
    ...(post.publishedAt
      ? { datePublished: post.publishedAt, dateModified: post.publishedAt }
      : {}),
    author: {
      "@type": "Organization",
      name: site.name,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${baseUrl}/logo-512.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/journal/${post.slug}/`,
    },
    articleSection: "Home Staging",
    inLanguage: "en-US",
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
              {post.publishedAt && (
                <>
                  <span className="mx-3 text-ivory/40">·</span>
                  {formatDate(post.publishedAt)}
                </>
              )}
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
              // Paragraphs may contain [label](/path/) links, typed in the
              // CMS, so posts can point readers (and Google) at the service
              // and city pages they talk about.
              return (
                <p key={i} className="mt-5 text-slate leading-relaxed text-lg">
                  {parseInlineLinks(block.text).map((part, j) =>
                    part.href ? (
                      <a
                        key={j}
                        href={part.href}
                        className="text-brass hover:text-ink transition-colors underline underline-offset-4 decoration-brass/40 hover:decoration-ink"
                        {...(/^https?:/i.test(part.href)
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {part.text}
                      </a>
                    ) : (
                      part.text
                    ),
                  )}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      {/* Related services: every post links on to the service pages */}
      {services.length > 0 && (
        <section className="section border-t border-line bg-ivory" data-testid="journal-services">
          <div className="container-wide max-w-5xl">
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              Our services
            </p>
            <ul className="mt-8 grid sm:grid-cols-2 gap-x-10 gap-y-6">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={servicePath(s)} className="block border-t border-line pt-5 group">
                    <p className="font-display text-2xl text-ink group-hover:text-brass transition-colors">
                      {s.name}
                    </p>
                    <p className="mt-2 text-sm text-slate leading-relaxed">{s.short}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

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
