import Image from "next/image";

type LogoProps = {
  variant?: "ink" | "ivory";
  className?: string;
};

export default function Logo({ variant = "ink", className = "" }: LogoProps) {
  return (
    <span
      className={`relative inline-block w-12 h-12 md:w-14 md:h-14 shrink-0 ${className}`}
      aria-label="Aviara Design Co."
      role="img"
      style={{
        // Invert the dark monogram for the ivory variant so it reads on dark backgrounds.
        filter: variant === "ivory" ? "invert(1) brightness(1.05)" : "none",
      }}
    >
      <Image
        src="/images/aviara-monogram.png"
        alt=""
        fill
        sizes="(min-width: 768px) 56px, 48px"
        className="object-contain"
        priority
      />
    </span>
  );
}
