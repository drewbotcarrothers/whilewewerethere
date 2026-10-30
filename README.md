# While We Were There

Family travel journal for [whilewewerethere.com](https://whilewewerethere.com). Andrew, Michelle, Harrison, Sullivan, and Maeve, in Toronto. The site uses first names only.

Stories cover family trips, day trips, and local days. A page is published only when it describes something that actually happened. The two files in `src/content/blog/` are format samples with `draft: true`. They are visible in `npm run dev` and omitted from `npm run build`.

## Stack

- [Astro](https://astro.build) 7, static output in `dist/`
- Markdown and MDX posts via a content collection (`src/content.config.ts`)
- Self-hosted Fraunces and Figtree
- No accounts, comments, analytics, ads, or affiliate links

Ads and affiliate disclosure exist as components and are switched off in `src/data/site.ts`. Published HTML does not include the slots while those flags are false.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # writes dist/ and checks that drafts were not published
npm run preview
npm run check
```

Node 22 or newer.

Local preview lists the sample drafts on the blog index and marks them. Open them directly:

- http://localhost:4321/blog/sample-family-trip/
- http://localhost:4321/blog/sample-day-trip/

The home page, destinations, RSS feed, and sitemap stay limited to published posts, including during `npm run dev`.

## Add a post

1. Put a landscape photo in `public/images/`. A 16:9 crop fits the hero frame.
2. Create `src/content/blog/your-story.md` (or `.mdx` if you need a component in the body).
3. Start from `draft: true`. Set `draft: false` only when the outing is real and you have read it for surnames, schools, and addresses.
4. Use the same spelling for `destination` and `region` every time you return to a place. The destination page is built from that spelling.

```yaml
---
title: A real title
description: One or two sentences. This is the card text and the search summary.
date: 2026-10-30
heroImage: /images/your-photo.jpg
heroAlt: What is actually in the photograph.
destination: Place name
region: Ontario
tripType: family-trip   # family-trip, day-trip, or local
kidsAges:
  harrison: 9
  sullivan: 6
  maeve: 6
tags:
  - shore
youtubeId: youtubevideo  # optional, 11 characters, from the family's own channel
featured: false          # true to prefer this place on the home page
draft: true
---
```

Do not put an h1 in the body. The template renders the title. Ages are the ages on the day of the trip.

`youtubeId`, when set, adds a play button. The YouTube player loads only after a click, from `youtube-nocookie.com`. There is always a plain link to the film as well.

The blog index filters by trip type and region in the browser, and a tag links to `/blog/?tag=that-tag`. Destination pages are generated for every published place. The home page shows the latest posts and, once any exist, featured destinations (or the most recent places if none are marked featured).

Update the ages on the About and FAQ pages as birthdays pass. They are written as “as of 2026” on purpose.

Delete `sample-family-trip.md`, `sample-day-trip.mdx`, and the two sample SVGs in `public/images/` when you no longer need the format examples.

## YouTube

The channel is [youtube.com/@Whilewewerethere](https://www.youtube.com/@Whilewewerethere). It is linked in the header, the footer, the home page, and every story.

## Ads and affiliate links

Both are off.

- `adsEnabled` in `src/data/site.ts` — when true, `src/components/AdSlot.astro` renders a labeled slot on the home page and at the end of a story. Paste the ad snippet into that component in the same change, and update the privacy page.
- `affiliatesEnabled` — when true, `src/components/AffiliateDisclosure.astro` renders on each story. Turn it on only when a published story contains a real affiliate link, and update the privacy page in that same change.

`npm run build` fails if ad markup or the affiliate disclosure shows up in `dist/` while this repository still expects them to be off. If you enable either flag on purpose, update `scripts/check-dist.mjs` in the same commit.

## Deploy

Production is a static folder on Hostinger shared hosting. GitHub Actions builds on every push to `main` and force-pushes `dist/` (including `.htaccess`) to the `deploy` branch. Hostinger’s Git deployment pulls that branch into `public_html`. The server does not need Node.

The workflow is `.github/workflows/deploy.yml`. It matches the Hostinger setup used by [aitoolsoptimizer](https://github.com/drewbotcarrothers/aitoolsoptimizer): build, then publish the built files on a `deploy` branch. This site does not also publish a GitHub Pages demo.

After this project is merged to `main`:

1. Confirm the workflow finished and the `deploy` branch exists. Until that first run, Hostinger has nothing to pull.
2. In hPanel, open the website for **whilewewerethere.com** (the empty WordPress site this replaces — not another domain).
3. Advanced → **Git**. Connect `https://github.com/drewbotcarrothers/whilewewerethere.git`, branch `deploy`, install path empty so the files land in `public_html`.
4. Turn on auto-deployment and add the webhook URL under the GitHub repo → Settings → Webhooks.
5. Deploy once, then load `https://whilewewerethere.com/`.
6. Create the mailbox `hello@whilewewerethere.com` if it does not exist yet. The contact page and the privacy page use that address.
7. Remove leftover WordPress files from that site’s `public_html` if the Git pull did not delete them (`index.php`, `wp-admin`, `wp-content`, `wp-includes`, `wp-config.php`, and the rest). An unused WordPress copy is a security problem. `.htaccess` sets `DirectoryIndex index.html` so the Astro page wins if `index.php` is still sitting beside it. That is a safety net, not a cleanup.

`.htaccess` also redirects `www` and `http` to `https://whilewewerethere.com`, serves `404.html`, and redirects `/sitemap.xml` to `/sitemap-index.xml`.

The `deploy` branch should stay unprotected enough for `GITHUB_TOKEN` to force-push, or the workflow needs a token that can. Do not commit that branch from a laptop over the top of a deploy; the next push to `main` replaces it.

## SEO

Canonical URLs use `https://whilewewerethere.com`. The build also writes:

- `sitemap-index.xml`
- `robots.txt`
- `rss.xml`
- Open Graph and Twitter card tags
- JSON-LD for the organization, the website, breadcrumbs, and `BlogPosting` on stories

## Brand images

`scripts/render-brand-assets.py` redraws `public/og.png` and the PNG icons. It needs Pillow and the fonts named in the script. The SVG favicon is hand-written.
