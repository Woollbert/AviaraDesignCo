/* One-off: email the SEO handoff doc to aviaradesignco@gmail.com.
 * Reads SMTP creds from aviara-site/.env.local. Not committed to prod.
 *
 * Run: node scripts/send-handoff-email.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..");

// Load .env.local manually (no dotenv dep)
const envPath = resolve(__dirname, "..", ".env.local");
if (!existsSync(envPath)) {
  console.error("Missing .env.local at", envPath);
  process.exit(1);
}
for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const mdPath = resolve(repoRoot, "seo-handoff-brooklyn.md");
const markdown = readFileSync(mdPath, "utf8");

const renderedBody = marked.parse(markdown, { gfm: true, breaks: false });

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1c1815; max-width: 720px; margin: 0 auto; padding: 32px 24px; background: #fbf8f2; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 28px; margin: 0 0 24px; padding-bottom: 12px; border-bottom: 1px solid #ddd3c2; color: #1c1815; }
  h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 22px; margin: 36px 0 14px; color: #1c1815; }
  h3 { font-family: Georgia, 'Times New Roman', serif; font-size: 17px; margin: 24px 0 10px; color: #1c1815; }
  p { margin: 0 0 14px; }
  ul, ol { margin: 0 0 16px; padding-left: 24px; }
  li { margin-bottom: 6px; }
  a { color: #997a47; text-decoration: underline; }
  strong { color: #1c1815; }
  blockquote { margin: 14px 0; padding: 10px 16px; border-left: 3px solid #997a47; background: #f4efe8; color: #4a4039; font-style: italic; }
  code { background: #efe9dd; padding: 2px 6px; border-radius: 3px; font-size: 0.92em; font-family: 'SF Mono', Menlo, Consolas, monospace; }
  hr { border: 0; border-top: 1px solid #ddd3c2; margin: 32px 0; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd3c2; color: #6b6157; font-size: 12px; }
</style>
</head>
<body>
${renderedBody}
<p class="footer">Sent from the Aviara Design Co. dev environment. Source markdown is also attached so you can keep an editable copy.</p>
</body>
</html>`;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const info = await transporter.sendMail({
  from: `"Aviara Design Co." <${process.env.SMTP_USER}>`,
  to: "aviaradesignco@gmail.com",
  subject: "SEO action list for Aviara — what to do next (Google Business Profile, reviews, directories)",
  text: markdown,
  html,
  attachments: [{ filename: "seo-handoff-brooklyn.md", content: markdown }],
});

console.log("Sent. Message ID:", info.messageId);
