# Editing the Aviara website — Brooklyn's walkthrough

This is the short version of "how to actually use the editor." It assumes the SEO action list (the longer doc emailed earlier) is the *why*; this is the *how*.

You don't need to know anything about code. The whole thing is a web form. You log in, you fill in fields, you hit Publish, and the live site updates ~60 seconds later.

---

## Logging in

1. Open **https://aviaradesignco.com/admin/** in a browser. (Bookmark this.)
2. You'll see "Aviara Editor" with a password box.
3. Enter the editor passphrase. (Darren has this — get it from him the first time. It's the same one every time afterwards.)
4. You'll land on the editor dashboard with a grid of tiles.

If you're using a shared computer, click **Log out** in the top-right when you're done.

---

## The dashboard

The dashboard has 8 tiles. Each one opens an editor for a different part of the site.

| Tile | What it edits |
|---|---|
| **Site Settings** | Business name, phone, email, hours, social links, the headline + intro copy for each homepage section |
| **Homepage Layout** | The drag-and-drop visual editor for the homepage (Hero, About, Services, Process, Team, etc.) |
| **Services** | The 4 service offerings (Vacant Staging, Occupied Staging, Interior Design, Consultations) |
| **Team** | Founder bio + supporting team members |
| **Projects (Portfolio)** | Each staged home with photo galleries — becomes a /portfolio/&lt;slug&gt;/ page |
| **Testimonials** | Client quotes |
| **City Landing Pages** | The 14 city pages (Temecula, Murrieta, Carlsbad, etc.) |
| **Journal (Blog)** | Blog posts at /journal/&lt;slug&gt;/ |

When you click a tile, you'll see a form. Make your changes, scroll to the bottom, click the **Publish** button in the dark bar. Wait ~60 seconds, then refresh the live site to see your changes.

---

## Editing your business info (Site Settings)

This is the one you'll touch most often. Phone, email, hours, social links, and the headline copy that appears across the homepage all live here.

1. Click **Site Settings** on the dashboard.
2. Edit any field on the page.
3. Click **Publish** at the bottom.

Things to keep in mind:
- **Phone number formatting matters.** The "Phone (display)" field is what shows on the page — write it nicely, like `(949) 697-1618`. The "Phone (tel link)" is what dialing apps use — write it as `+19496971618` (no spaces, no parens, country code).
- **Email** updates the contact form's reply-to. If you change this, the contact form will start sending inquiries to the new address.
- **Service Areas** is a separate field that controls the "Serving X, Y, Z" line in the hero. It doesn't add city landing pages — those are a separate editor (see below).
- **Homepage section copy** (the eyebrows, headlines, and intro paragraphs for About, Services, Process, etc.) all live further down the form, grouped under "Homepage Section Copy."

---

## Editing the homepage layout (visual editor)

The homepage has 8 sections: Hero, About, Services, Process, Team, Portfolio, Testimonials, Contact. The visual editor lets you reorder them, hide some, or change the photo backgrounds.

1. Click **Homepage Layout** on the dashboard.
2. The current homepage shows on the right. The left sidebar shows the available sections and the section list.
3. To **swap an image** — click on the section, find the image field in the right panel, click the image, choose a new one from the picker (or upload a new one).
4. To **reorder sections** — drag them up or down in the section list on the left.
5. To **change text** — click on a section, edit the field, see the change live in the preview.
6. Click **Publish** to push to the live site.

The visual editor is more powerful than the form-based editors but takes a little longer to learn. **You don't have to use it.** The form-based "Site Settings" editor can change all the homepage copy without going through the visual editor.

---

## Editing a city landing page

These are the pages that target Google searches like "staging temecula." Each city has its own page with market context, why-staging points, neighborhoods, common mistakes, FAQs, and cross-links to nearby cities.

1. Click **City Landing Pages** on the dashboard.
2. Click any city tile (e.g. "Temecula").
3. The editor shows every editable field in sections. Scroll through and update what you want.
4. Click **Publish** at the bottom.

Tips:
- **FAQs are special** — each Q&A you add here also goes into the Google rich-result FAQ schema. Five strong FAQs per city is the sweet spot. Real questions clients ask, real answers in your voice.
- **Neighborhoods** is a flat list. Add the names buyers search for (e.g. "Temeku Hills," "Wine Country"). Don't list every street.
- **Common Mistakes** and **Market Context** are optional — if you delete all of them, that section just doesn't render on the live page.
- **Nearby Cities** are slugs (e.g. `home-staging-murrieta`), not display names. The page picks up the display name from each linked city automatically.

Don't change the **URL Slug** field on an existing city — that breaks Google's indexing and any external links pointing to that page. If you want to rename, ask Darren to do it as a proper move.

To **add a brand-new city** that doesn't exist yet:
1. Click **+ Add City** at the top of the cities list.
2. Fill in the form (URL slug as `home-staging-<city>`, e.g. `home-staging-vista`).
3. Publish.
4. **Tell Darren** — he needs to create one matching code file before the new page goes live. (The editor saves your data; the route file is a one-line code change.)

---

## Adding a journal post

The journal is your blog. Each post is built from a series of paragraphs and section headings — no rich-text editor; you write the text and choose paragraph or heading for each piece.

1. Click **Journal (Blog)** on the dashboard.
2. Click **+ Add Post** at the top.
3. Fill in:
   - **URL Slug** — lowercase with dashes (e.g. `staging-tips-for-fallbrook-listings`)
   - **Title** — the headline of the post
   - **Published Date** — pick the date in the calendar
   - **SEO Title + Description** — these are what show in Google search results
   - **Excerpt** — 2–3 sentence summary shown on the /journal/ index card
   - **Cover Image** — optional
4. Build the body by clicking **+ Paragraph** for a paragraph and **+ Section Heading** for a subheader. You can reorder, edit, and remove blocks one at a time.
5. Click **Publish**.

A good cadence is 1–2 posts per month. Google rewards active sites. Topic ideas:
- "5 things to do before staging photos in Murrieta"
- "What I tell every Temecula seller about their primary suite"
- "Vacant vs. occupied staging — when each one wins"
- Anything that answers a question buyers actually Google

---

## Editing other things

- **Services** — the 4 offerings shown on the homepage. Edit name, description, feature bullets, image.
- **Team** — founder bio plus a list of other team members.
- **Projects (Portfolio)** — each completed project with full photo gallery. Each becomes its own /portfolio/&lt;slug&gt;/ page. Use **+ Add Project** to add a new staged home.
- **Testimonials** — client quotes. Add the quote, the author name, and a short role/context line.

All of these follow the same pattern: click tile → fill form → click Publish.

---

## Image uploads

Anywhere you see an image field (cover photo, hero background, etc.), clicking it opens a picker:
- The **thumbnail grid** shows every image already in the site (from past projects).
- The **upload button** at the top lets you add a new image from your computer.
- Once an image is in the library, any image field on any page can use it.

**Image tips:**
- **Landscape orientation** works better than portrait for hero/cover images.
- **Optimize before uploading** if the file is >2MB — most camera photos are 8–12MB. There are free tools (tinypng.com, squoosh.app) that compress without visible quality loss.
- **Use descriptive alt text** — every image field has an "Alt text" companion field. Write what the image shows in plain language. Improves both accessibility and SEO.

---

## What "Publish" actually does

When you click Publish, three things happen in this order:
1. Your changes save to GitHub (the code home of the site).
2. Vercel notices the change and starts a new build.
3. The live site at aviaradesignco.com updates with your changes.

The whole thing usually takes 30–90 seconds end to end. If the live site doesn't show your changes after ~2 minutes, hard-refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows) — your browser might be showing a cached version.

If you make a mistake, the previous version is still in GitHub — Darren can roll back in under a minute. So don't be afraid to experiment.

---

## When to ask for help

- "I want to add a new city page that doesn't exist yet" → you can fill the form, but Darren needs to add one code file before it goes live.
- "I changed the URL slug of a city and now the page won't load" → tell Darren immediately. Slug changes need a few coordinated edits.
- "I deleted a project / city / journal post and need it back" → Darren can recover from git history in under a minute.
- "The Publish button is showing an error" → check what the error says first (usually it's a missing required field on the form). If unclear, screenshot it for Darren.

---

## The bigger SEO picture

This editor lets you control the *content* on the site. The bigger SEO wins — the ones from the action list emailed earlier — happen *outside* the site:

1. **Google Business Profile** — fix the hours, add secondary categories, upload 10+ photos, post weekly. This is the #1 lever for "staging temecula" type searches.
2. **Reviews** — get to 25+ Google reviews. Ask the last 10 happy clients via text.
3. **Directory listings** — Yelp, Houzz, Angi, BBB, local chamber sites. Use the exact same business name, phone, and address everywhere.

The editor changes the website. The action list changes how Google finds and ranks the website. You need both.

---

## Quick reference

| Want to... | Open this editor |
|---|---|
| Change your phone number | Site Settings |
| Change "Serving X, Y, Z" line under the hero | Site Settings → Service Areas |
| Add a new client testimonial | Testimonials |
| Add a new completed project | Projects (Portfolio) → + Add Project |
| Write a blog post | Journal → + Add Post |
| Update the FAQs for a city | City Landing Pages → [city] → FAQs |
| Add a new city the site doesn't cover yet | City Landing Pages → + Add City (then tell Darren) |
| Change the homepage layout / swap hero image | Homepage Layout |
| Change a homepage section's headline or intro | Site Settings → Homepage Section Copy |

That's everything you can do through the editor. Anything else is a code change — text me.
