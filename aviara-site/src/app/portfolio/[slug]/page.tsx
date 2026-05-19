import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { projects, getProjectBySlug } from "@/data/portfolio";
import { site } from "@/data/site";
import Reveal from "@/components/Reveal";
import ProjectGallery from "@/components/ProjectGallery.client";

export const dynamicParams = false;

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} | ${site.name}`,
      description: project.shortDescription,
      images: [{ url: project.coverImage }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  // Find the project's index for prev/next navigation at page bottom
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <main className="bg-bone">
      {/* Hero — cover photo + project metadata */}
      <section className="relative h-[75svh] min-h-[520px] w-full overflow-hidden bg-ink text-ivory">
        <div className="absolute inset-0 z-0">
          <Image
            src={project.coverImage}
            alt={project.coverImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(28,24,21,0.55) 0%, rgba(28,24,21,0.35) 40%, rgba(28,24,21,0.88) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-wide h-full flex flex-col justify-end pb-16">
          <Link
            href="/portfolio/"
            className="self-start inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-widest text-ivory/70 hover:text-brassSoft transition-colors mb-8"
          >
            <span aria-hidden="true">←</span> Back to all projects
          </Link>
          <p className="eyebrow !text-brassSoft flex items-center gap-3">
            <span className="inline-block w-10 h-px bg-brassSoft" />
            {project.category}
          </p>
          <h1
            className="mt-4 font-display text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.02] text-ivory max-w-4xl"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}
          >
            {project.title}
          </h1>
          <p className="mt-4 text-base md:text-lg text-ivory/85" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}>
            {project.location} · {project.photos.length} photos
          </p>
        </div>
      </section>

      {/* Description band */}
      <section className="section">
        <div className="container-wide max-w-4xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              About this project
            </p>
            <p className="mt-6 font-display text-2xl md:text-3xl leading-snug text-ink">
              {project.shortDescription}
            </p>
            <p className="mt-6 text-lg text-mute leading-relaxed">{project.longDescription}</p>
          </Reveal>
        </div>
      </section>

      {/* Photo gallery */}
      <section className="section border-t border-line">
        <div className="container-wide">
          <Reveal>
            <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
              <div>
                <p className="eyebrow flex items-center gap-3">
                  <span className="gold-rule" />
                  Gallery
                </p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl text-ink">
                  {project.photos.length} photos
                </h2>
              </div>
              <p className="text-sm text-mute max-w-xs">
                Click any photo to open the fullscreen gallery. Zoom, swipe, and step
                through every shot.
              </p>
            </div>
          </Reveal>
          <ProjectGallery photos={project.photos} projectTitle={project.title} />
        </div>
      </section>

      {/* Prev / next nav + back-to-portfolio CTA */}
      <section className="section border-t border-line bg-ivory">
        <div className="container-wide grid sm:grid-cols-2 gap-8 items-stretch">
          {prev ? (
            <Link
              href={`/portfolio/${prev.slug}/`}
              className="group block p-8 border border-line hover:border-brass transition-colors"
            >
              <p className="text-[0.65rem] uppercase tracking-widest text-mute mb-3">
                ← Previous project
              </p>
              <p className="font-display text-2xl text-ink group-hover:text-brass transition-colors">
                {prev.title}
              </p>
              <p className="text-sm text-mute mt-1">{prev.category}</p>
            </Link>
          ) : (
            <div className="p-8" />
          )}
          {next ? (
            <Link
              href={`/portfolio/${next.slug}/`}
              className="group block p-8 border border-line hover:border-brass transition-colors text-right"
            >
              <p className="text-[0.65rem] uppercase tracking-widest text-mute mb-3">
                Next project →
              </p>
              <p className="font-display text-2xl text-ink group-hover:text-brass transition-colors">
                {next.title}
              </p>
              <p className="text-sm text-mute mt-1">{next.category}</p>
            </Link>
          ) : (
            <Link
              href="/portfolio/"
              className="group block p-8 border border-line hover:border-brass transition-colors text-right"
            >
              <p className="text-[0.65rem] uppercase tracking-widest text-mute mb-3">
                Back to all projects →
              </p>
              <p className="font-display text-2xl text-ink group-hover:text-brass transition-colors">
                Browse the full portfolio
              </p>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
