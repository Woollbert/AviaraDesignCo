# Old WordPress site archive

**Source:** https://aviaradesignco.com (WordPress + Elementor, hosted on Bluehost Cloud)
**Captured:** 2026-05-19
**Captured by:** [scripts/backup-old-wordpress-site.mjs](../../scripts/backup-old-wordpress-site.mjs)

## What's in here

A static archive of the publicly-visible old Aviara Design Co. website, captured before the migration to the new Next.js site on Vercel.

| Type | Count | Notes |
|---|---|---|
| HTML pages | 21 | All pages + 5 blog posts from the WordPress sitemap |
| Images | 37 | Mostly portfolio shots from `/wp-content/uploads/2026/03/` |
| Videos | 1 | `wp-content/uploads/2026/05/modern_video_compressed_3_5mb.mp4` (hero background) |
| CSS / JS / fonts | ~200 | Elementor + plugin assets, may or may not be useful |
| **Total** | **177 files, ~20 MB** | |

## What this is NOT

- **Not a WordPress backup.** No MySQL database, no admin settings, no plugin configs, no form submissions, no draft/unpublished pages. To restore the site as a runnable WordPress install, you'd need access to Bluehost cPanel → Backup or a plugin like UpdraftPlus.
- **Not a perfectly-rendering site.** The HTML references absolute URLs at `aviaradesignco.com`, so once DNS flips to Vercel, opening these files in a browser may fail to load CSS/images. Open them via raw file view to see content.

## Why we kept this

- Reference for content, copy, photos, design choices
- Audit trail in case the new site is missing something the owner liked
- Insurance against accidental data loss during the Bluehost cancellation

## When to delete

Once the new site has been live for ~30 days and you're sure nothing's missing, this archive can be safely removed from the repo. Estimated removal date: late June 2026. Consider keeping a copy offline (Google Drive, external disk) before deleting from Git.

## Errors during capture (informational)

The scraper logged 119 "errors" but all were false positives — meta-tag content strings that an over-broad regex tried to download as URLs. No actual page assets are missing. The 245 successful asset downloads cover everything the browser actually fetches.
