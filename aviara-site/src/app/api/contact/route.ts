import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/data/site";

export const runtime = "nodejs";

type InquiryPayload = {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  city?: string;
  squareFootage?: string;
  stagingDate?: string;
  rooms?: string[];
  message?: string;
  // honeypot — bots fill this, real users don't see it
  website?: string;
};

function esc(v: unknown): string {
  if (v == null) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmail(p: InquiryPayload) {
  const rooms = Array.isArray(p.rooms) ? p.rooms.join(", ") : "";
  const rows: Array<[string, string]> = [
    ["Name", p.name ?? ""],
    ["Email", p.email ?? ""],
    ["Phone", p.phone ?? ""],
    ["Project Type", p.projectType ?? ""],
    ["Property City", p.city ?? ""],
    ["Square Footage", p.squareFootage ?? ""],
    ["Desired Staging Date", p.stagingDate ?? ""],
    ["Rooms to Stage", rooms],
    ["Message", p.message ?? ""],
  ];

  const subject = `New inquiry — ${p.name || "Unknown"}${p.projectType ? ` (${p.projectType})` : ""}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; color: #1c1815;">
      <h2 style="font-family: Georgia, serif; color: #1c1815; border-bottom: 1px solid #ddd3c2; padding-bottom: 8px;">
        New project inquiry — ${esc(site.name)}
      </h2>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                 <td style="padding:8px 12px 8px 0; vertical-align:top; color:#6b6157; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; width:180px;">${esc(k)}</td>
                 <td style="padding:8px 0; vertical-align:top; color:#1c1815; font-size:14px; white-space:pre-wrap;">${esc(v) || "—"}</td>
               </tr>`,
          )
          .join("")}
      </table>
      <p style="margin-top:24px; font-size:12px; color:#6b6157;">
        Sent from the contact form on ${esc(site.url)} — reply directly to respond to the inquirer.
      </p>
    </div>
  `;

  const text = rows.map(([k, v]) => `${k}: ${v || "—"}`).join("\n");

  return { subject, html, text };
}

export async function POST(req: Request) {
  let body: InquiryPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // honeypot: silently accept and discard
  if (body.website) {
    return NextResponse.json({ ok: true, discarded: true });
  }

  if (!body.name?.trim() || !body.email?.trim() || !body.projectType?.trim()) {
    return NextResponse.json(
      { ok: false, error: "missing_required_fields" },
      { status: 400 },
    );
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.error("[contact] SMTP not configured");
    return NextResponse.json(
      { ok: false, error: "email_not_configured" },
      { status: 500 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || site.email || user;
  const { subject, html, text } = buildEmail(body);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
  });

  try {
    const info = await transporter.sendMail({
      from: `"${site.name}" <${user}>`,
      to,
      replyTo: body.email,
      subject,
      html,
      text,
    });
    return NextResponse.json({ ok: true, id: info.messageId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[contact] sendMail failed:", msg);
    return NextResponse.json(
      { ok: false, error: "delivery_failed", detail: msg },
      { status: 502 },
    );
  }
}
