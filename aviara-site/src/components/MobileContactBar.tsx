"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { track } from "@/lib/track";

/*
 * Sticky bottom bar on phones with one-tap Call + Text actions. Most
 * staging inquiries on mobile end with a phone call, not a form fill —
 * this puts the number permanently in thumb reach as the visitor scrolls
 * the portfolio. Hidden as soon as the on-page contact section enters
 * the viewport so it doesn't compete with the proper form there.
 *
 * Desktop/tablet (md+) never sees it. Safe-area inset keeps it above
 * the iOS home indicator.
 */
export default function MobileContactBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setHidden(e.isIntersecting)),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={hidden ? "true" : undefined}
      className={[
        "md:hidden fixed inset-x-0 bottom-0 z-40 bg-ink/95 backdrop-blur",
        "border-t border-brass/30 text-ivory",
        "transition-transform duration-300",
        hidden ? "translate-y-full" : "translate-y-0",
      ].join(" ")}
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-2 divide-x divide-brass/20">
        <a
          href={`tel:${site.phoneTel}`}
          onClick={() => track("phone_click", { surface: "mobile_bar" })}
          className="flex items-center justify-center gap-3 py-3.5 text-sm font-medium tracking-wide hover:text-brassSoft transition-colors"
          aria-label={`Call ${site.phone}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
          </svg>
          Call
        </a>
        <a
          href={site.smsHref}
          onClick={() => track("sms_click", { surface: "mobile_bar" })}
          className="flex items-center justify-center gap-3 py-3.5 text-sm font-medium tracking-wide hover:text-brassSoft transition-colors"
          aria-label="Text us"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Text
        </a>
      </div>
    </div>
  );
}
