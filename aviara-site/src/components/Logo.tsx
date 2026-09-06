import Image from "next/image";

type LogoProps = {
  variant?: "ink" | "ivory";
  className?: string;
};

export default function Logo({ variant = "ink", className = "" }: LogoProps) {
  return (
    // Box matches the trimmed monogram's 1.3:1 shape so the mark fills it
    // instead of floating inside square padding. Heights are unchanged
    // (48px / 56px), so the navbar and everything keyed to it stay put.
    <span
      className={`relative inline-block w-[62px] h-12 md:w-[72px] md:h-14 shrink-0 ${className}`}
      aria-label="Aviara Design Co."
      role="img"
      style={{
        // Invert the dark monogram for the ivory variant so it reads on dark backgrounds.
        filter: variant === "ivory" ? "invert(1) brightness(1.05)" : "none",
      }}
    >
      <Image
        src="/images/aviara-monogram-nav.png"
        alt=""
        fill
        sizes="(min-width: 768px) 72px, 62px"
        className="object-contain"
        priority
      />
    </span>
  );
}
