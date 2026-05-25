import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Aviara Design Co. collects, uses, and protects information from visitors to aviaradesignco.com, including California Consumer Privacy Act (CCPA) rights.",
  alternates: { canonical: "/privacy/" },
  robots: { index: true, follow: true },
};

// Last update — bump when the policy is materially changed. Shown to visitors
// so they can see how current it is.
const LAST_UPDATED = "May 24, 2026";

export default function PrivacyPage() {
  return (
    <main className="bg-bone">
      <section className="section">
        <div className="container-wide max-w-3xl">
          <p className="eyebrow flex items-center gap-3">
            <span className="gold-rule" />
            Privacy
          </p>
          <h1 className="mt-5 font-display text-4xl md:text-5xl text-ink leading-[1.05]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-mute">Last updated: {LAST_UPDATED}</p>

          <div className="mt-12 space-y-10 text-slate leading-relaxed">
            <section>
              <h2 className="font-display text-2xl text-ink">Overview</h2>
              <p className="mt-3">
                {site.name} (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;)
                runs the website at{" "}
                <a
                  href={site.url}
                  className="text-brass hover:text-ink underline underline-offset-4 decoration-brass/40 hover:decoration-ink transition-colors"
                >
                  {site.url.replace(/^https?:\/\//, "")}
                </a>
                . This page explains what information we collect when you visit
                the site or contact us, how we use it, and the choices you have.
              </p>
              <p className="mt-3">
                The short version: we collect the minimum needed to run the site
                and respond to inquiries. We don&apos;t sell your information,
                and we don&apos;t share it with advertisers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink">
                Information we collect
              </h2>
              <p className="mt-3">There are two ways we collect information:</p>
              <ul className="mt-4 space-y-3 list-disc pl-6">
                <li>
                  <strong className="text-ink">When you contact us</strong> —
                  the inquiry form on our site collects your name, email,
                  phone number (if you provide it), property city, square
                  footage, target staging date, the rooms you want staged, and
                  any message you write. This is sent directly to our email
                  inbox and is used only to respond to your inquiry.
                </li>
                <li>
                  <strong className="text-ink">When you browse</strong> — we
                  use Google Analytics 4 to understand which pages visitors
                  read and how they found us. This collects standard analytics
                  data: pages visited, time on page, approximate location
                  (city-level, not address), device type, and referring site.
                  IP addresses are anonymized before they reach our reports.
                  Google Analytics may set cookies in your browser as part of
                  this; see{" "}
                  <a
                    href="https://policies.google.com/technologies/partner-sites"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brass hover:text-ink underline underline-offset-4 decoration-brass/40 hover:decoration-ink transition-colors"
                  >
                    Google&apos;s policy
                  </a>{" "}
                  for details.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink">
                How we use information
              </h2>
              <ul className="mt-4 space-y-3 list-disc pl-6">
                <li>To respond to project inquiries you send us through the form.</li>
                <li>
                  To understand which pages and topics on the site are useful, so
                  we can improve them.
                </li>
                <li>
                  To maintain the security and proper functioning of the site.
                </li>
              </ul>
              <p className="mt-4">
                We do not use your information for advertising, retargeting, or
                profiling. We do not sell or rent your information to anyone.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink">
                Who we share information with
              </h2>
              <p className="mt-3">
                We don&apos;t share inquiry-form data with third parties. The
                only processors that touch your data in any form are:
              </p>
              <ul className="mt-4 space-y-3 list-disc pl-6">
                <li>
                  <strong className="text-ink">Google (Analytics)</strong> — for
                  aggregated traffic measurement only.
                </li>
                <li>
                  <strong className="text-ink">Google (Gmail)</strong> — the
                  inquiry form delivers email to our Gmail inbox.
                </li>
                <li>
                  <strong className="text-ink">Vercel</strong> — the company
                  that hosts the website.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink">
                Your California (CCPA / CPRA) rights
              </h2>
              <p className="mt-3">
                If you&apos;re a California resident, the California Consumer
                Privacy Act and California Privacy Rights Act give you the
                right to:
              </p>
              <ul className="mt-4 space-y-3 list-disc pl-6">
                <li>Know what personal information we have collected about you.</li>
                <li>Request that we delete personal information we have collected from you.</li>
                <li>Correct inaccurate personal information we hold.</li>
                <li>
                  Opt out of any sale or sharing of personal information. As
                  noted above, we do not sell or share personal information,
                  so there is nothing to opt out of — but you can confirm in
                  writing if you&apos;d like.
                </li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, email us at{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-brass hover:text-ink underline underline-offset-4 decoration-brass/40 hover:decoration-ink transition-colors"
                >
                  {site.email}
                </a>
                . We&apos;ll respond within 45 days as required by California law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink">
                Cookies and analytics
              </h2>
              <p className="mt-3">
                We use Google Analytics 4 with IP anonymization enabled. If you
                prefer not to be measured, you can:
              </p>
              <ul className="mt-4 space-y-3 list-disc pl-6">
                <li>
                  Enable &quot;Do Not Track&quot; in your browser (some browsers
                  hide this option in advanced settings).
                </li>
                <li>
                  Install Google&apos;s{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brass hover:text-ink underline underline-offset-4 decoration-brass/40 hover:decoration-ink transition-colors"
                  >
                    Analytics opt-out browser add-on
                  </a>
                  , which blocks GA on every site.
                </li>
                <li>
                  Block third-party cookies in your browser settings (this
                  blocks GA among other things).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink">
                Children
              </h2>
              <p className="mt-3">
                Our services are for adults purchasing or selling residential
                real estate. We don&apos;t knowingly collect information from
                children under 13. If a parent or guardian believes a child
                has submitted information through our site, contact us at{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-brass hover:text-ink underline underline-offset-4 decoration-brass/40 hover:decoration-ink transition-colors"
                >
                  {site.email}
                </a>{" "}
                and we&apos;ll delete it.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink">
                Changes to this policy
              </h2>
              <p className="mt-3">
                If we change how we handle information, we&apos;ll update this
                page and the &quot;Last updated&quot; date at the top. Material
                changes will be flagged on the homepage for at least 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink">Contact</h2>
              <p className="mt-3">
                Questions about privacy or these terms? Reach us at{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-brass hover:text-ink underline underline-offset-4 decoration-brass/40 hover:decoration-ink transition-colors"
                >
                  {site.email}
                </a>{" "}
                or{" "}
                <a
                  href={`tel:${site.phoneTel}`}
                  className="text-brass hover:text-ink underline underline-offset-4 decoration-brass/40 hover:decoration-ink transition-colors"
                >
                  {site.phone}
                </a>
                .
              </p>
            </section>

            <section className="pt-8 border-t border-line">
              <Link
                href="/"
                className="text-sm text-brass hover:text-ink transition-colors underline underline-offset-4 decoration-brass/40 hover:decoration-ink"
              >
                ← Back to home
              </Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
