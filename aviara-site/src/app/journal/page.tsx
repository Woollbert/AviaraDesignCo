import type { Metadata } from "next";
import Link from "next/link";
import { journalPosts } from "@/data/journal";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Journal | Home Staging & Design Insights",
  description:
    "Articles from Aviara Design Co. on home staging in Temecula, Murrieta, Menifee, Fallbrook, and across Southern California — practical insight for sellers and realtors.",
  alternates: { canonical: "/journal/" },
};

export default function JournalIndexPage() {
  return (
    <main className="bg-bone">
      {/* Header */}
      <section className="section relative overflow-hidden bg-ink text-ivory">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,24,21,0.96) 0%, rgba(28,24,21,1) 100%)",
          }}
        />
        <div className="container-wide relative z-10 max-w-4xl">
          <Reveal>
            <p className="eyebrow !text-brassSoft flex items-center gap-3">
              <span className="inline-block w-10 h-px bg-brassSoft" />
              Journal
            </p>
            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] text-ivory">
              Notes on staging, selling, and{" "}
              <span className="italic text-brassSoft">livable luxury.</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-ivory/85 max-w-2xl leading-relaxed">
              Practical guidance for homeowners and listing agents preparing properties across Temecula, Southern California, and beyond.
            </p>
          </Reveal>
        </div>
      </section>

      {/* List */}
      <section className="section">
        <div className="container-wide max-w-5xl">
          {journalPosts.length === 0 ? (
            <p className="text-slate">No articles yet — check back soon.</p>
          ) : (
            <ul className="grid md:grid-cols-2 gap-10 md:gap-14">
              {journalPosts.map((post, i) => (
                <Reveal key={post.slug} as="li" delay={i * 80}>
                  <Link href={`/journal/${post.slug}/`} className="block group">
                    <p className="text-[0.7rem] uppercase tracking-[0.28em] text-mute">
                      {formatDate(post.publishedAt)}
                    </p>
                    <h2 className="mt-3 font-display text-2xl md:text-3xl text-ink group-hover:text-brass transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="mt-4 text-slate leading-relaxed">{post.excerpt}</p>
                    <p className="mt-5 text-[0.72rem] uppercase tracking-[0.28em] text-brass">
                      Read more →
                    </p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
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
