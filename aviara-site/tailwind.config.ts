import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Warm, livable-luxury palette tuned for staging/interiors
        bone: "#F4EFE8", // primary background, warm cream
        ivory: "#FBF8F2", // soft secondary background
        linen: "#EBE3D6", // subtle divider tone
        ink: "#1C1815", // near-black brand text
        slate: "#2E2823", // body text on light bgs (WCAG AAA)
        mute: "#544C42", // muted body, darkened for AA contrast on bone
        sand: "#A89A86", // warm taupe accent
        brass: "#9A7B3D", // metallic accent for buttons / lines / dark bgs
        brassDeep: "#6E5421", // brass for small text on light bgs (AA)
        brassSoft: "#D9C394", // soft metallic for dark bgs
        line: "#DDD3C2", // hairline borders
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28,24,21,0.04), 0 8px 24px rgba(28,24,21,0.06)",
        lift: "0 6px 18px rgba(28,24,21,0.08), 0 24px 48px rgba(28,24,21,0.10)",
      },
      maxWidth: {
        wide: "82rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        kenburns: {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.15)" },
        },
        scrollline: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out forwards",
        kenburns: "kenburns 18s ease-in-out infinite alternate",
        scrollline: "scrollline 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
