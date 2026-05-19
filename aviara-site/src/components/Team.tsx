import Image from "next/image";
import Reveal from "./Reveal";
import { team, founder, type TeamMember } from "@/data/team";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function MemberPortrait({ m }: { m: TeamMember }) {
  if (m.photoUrl) {
    return (
      <div className="photo-frame photo-frame--dark relative aspect-[3/4] overflow-hidden bg-linen">
        <Image
          src={m.photoUrl}
          alt={`Portrait of ${m.name}`}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 50vw"
          className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
        />
      </div>
    );
  }
  return (
    <div className="photo-frame photo-frame--dark relative aspect-[3/4] overflow-hidden bg-bone flex items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #f4efe8 0%, #ebe3d6 100%)" }}
      />
      <span
        aria-hidden="true"
        className="relative z-10 font-display text-[3rem] sm:text-[3.5rem] lg:text-[4rem] leading-none text-brass/40"
      >
        {initials(m.name)}
      </span>
    </div>
  );
}

export default function Team() {
  const everyone = [founder, ...team];
  return (
    <section id="team" className="section relative bg-ivory border-y border-line overflow-hidden">
      <div className="container-wide">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow flex items-center justify-center gap-3">
              <span className="gold-rule" /> The Team <span className="gold-rule" />
            </p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] text-ink">
              Family owned. Every project is
              <span className="italic text-brass"> hands-on.</span>
            </h2>
            <p className="mt-5 text-lg text-mute">
              Aviara is run by Brooklyn alongside her husband and brother. You'll
              meet the same three faces from the first walkthrough to the final
              styled vignette. No layered hand-offs, no template installs.
            </p>
          </div>
        </Reveal>

        <ul
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-12 sm:gap-8 max-w-5xl mx-auto"
          data-testid="team-grid"
        >
          {everyone.map((m, i) => (
            <Reveal key={m.name} as="li" delay={i * 80}>
              <div className="group">
                <MemberPortrait m={m} />
                <h3 className="mt-4 font-display text-lg sm:text-xl text-ink">{m.name}</h3>
                <p className="mt-1 text-[0.66rem] sm:text-[0.7rem] uppercase tracking-widest text-brassDeep">
                  {m.role}
                </p>
                <p className="mt-3 text-[0.82rem] sm:text-sm text-mute leading-relaxed">{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
