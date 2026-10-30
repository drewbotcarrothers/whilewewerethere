# While We Were There

Family travel journal for [whilewewerethere.com](https://whilewewerethere.com). Andrew, Michelle, Harrison, Sullivan, and Maeve, based in Toronto, write up the trips and the close-to-home days, and link each story to its film on [YouTube](https://www.youtube.com/@Whilewewerethere).

The public site uses first names only. Do not add a surname to pages, posts, or images.

Stories go up after the family has actually been there. The two sample posts in `src/content/blog/` are templates (`draft: true` and `sample: true`). They are not published.

## Stack

- [Astro](https://astro.build) 5, static output in `dist/`
- Markdown and MDX content collections
- Self-hosted fonts (Fraunces and Source Sans 3)
- No server, no contact backend, no checkout

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview
```

`npm run dev` includes draft and sample entries so you can preview a template. `npm run build` leaves them out.

## Add a story

Create `src/content/blog/your-story.md` (or `.mdx`):

```yaml
---
title: A real day we had
description: One or two sentences for the card, the RSS feed, and Google.
date: 2026-06-01
heroImage: ../../assets/blog/your-story.jpg
heroAlt: Describe the photograph for someone who cannot see it.
destination: Toronto Islands
region: Toronto
tripType: day-trip          # family-trip, day-trip, or local
tags:
  - islands
  - beach
youtubeId: abcdefghijk      # optional, 11-character YouTube id
draft: false
sample: false
---
```

`date` is a calendar date. It is shown in UTC so the day does not shift with the server timezone.

`tripType` is one of:

| Value | Use it for |
|---|---|
| `family-trip` | Overnights and longer trips |
| `day-trip` | Outings that end at home |
| `local` | Parks, museums, and other close-to-home days |

The blog index links to a page for each trip type, each region, and each combination that has a published story. Destination pages are generated from `destination`. Tags get their own archives. A `youtubeId` embeds that video on the post (via youtube-nocookie) and lists the story under Latest videos on the home page. Every page already links to the channel.

Put photographs in `src/assets/blog/` and point `heroImage` at them with a path relative to the Markdown file. Use a picture from the day. Do not publish a story for a place the family has not been.

To hide a story, set `draft: true`. Files with `sample: true` are templates and are also excluded from production.

## Add a guide

Create `src/content/products/your-guide.md`:

```yaml
---
title: A guide we actually wrote
description: What it covers and who it is for.
date: 2026-06-01
price: CA$18
buyUrl: https://pay.example-checkout.invalid/your-guide
affiliate: false
draft: false
sample: false
---
```

`buyUrl` is optional until the external checkout exists. There is no cart on this site. The button sends readers to that URL. Set `affiliate: true` when the link pays a commission. That shows the affiliate disclosure on the guide. The sample product in `src/content/products/sample-guide.md` is a draft and is not for sale.

`src/content/products/sample-guide.md` uses a placeholder price on purpose. Replace the whole file rather than publishing it.

## Ads and affiliate disclosure

Both are off in `src/config.ts`:

```ts
export const monetization = {
  ads: false,
  affiliateDisclosure: false,
};
```

`AdSlot` is already placed on stories, the blog index, and the shop. Setting `ads` to `true` shows a labeled reserved slot. It does not load an ad network. When you have one, paste the snippet into `src/components/AdSlot.astro`.

Setting `affiliateDisclosure` to `true` shows the disclosure on stories and on the shop. A guide with `affiliate: true` shows it on that guide even if the site-wide switch is off.

## Other pages to keep current

- **About** and **FAQ** include the kids' ages as of 2026 (`agesAsOf` in `src/config.ts`). Update them.
- **Contact email** is `hello@whilewewerethere.com` in `src/config.ts`. Create that mailbox, or change the address, before you rely on the contact page.
- **Work with us** (`/work-with-us/`) has yellow TODO blocks for audience numbers, who the readers are, and past sponsors. Replace those with real figures before sending the page to a brand. Do not invent stats.
- **Privacy** describes the site as it works today, including ads, affiliates, sponsorships, and external checkouts that are not switched on yet. Update the date if that changes.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) runs on every push to `main` and on pull requests.

1. Install dependencies and run `npm run build`.
2. On a push to `main` only, publish the contents of `dist/` (including `public/.htaccess`) by force-pushing them to the `deploy` branch.

Pull requests build the site and do not update `deploy`. Hostinger should track `deploy`, not `main`, because `main` is the Astro source and `deploy` is the built site.

`public/.htaccess` is copied into `dist/`. It redirects `www` to the apex domain, redirects HTTP to HTTPS, serves `404.html`, and prefers `index.html` over a leftover WordPress `index.php`.

### Hostinger setup

Do this once in hPanel for **whilewewerethere.com**. It matches the Git deploy used for the sibling project `aitoolsoptimizer`: the host pulls a branch of built files and does not run Node.

1. Merge this project to `main` and wait for the **Build and deploy** action to finish. That creates the `deploy` branch.
2. In hPanel, open **Websites → whilewewerethere.com → Advanced → Git**.
3. Connect `https://github.com/drewbotcarrothers/whilewewerethere.git`.
4. Branch: `deploy`. Directory: empty, so the files land in `public_html` (the document root).
5. Turn on auto-deployment. Copy the webhook URL Hostinger shows into the GitHub repo under **Settings → Webhooks**.
6. Remove the unused WordPress install from that document root so old PHP files are not left beside the static site. `.htaccess` already prefers `index.html`, but leftover `wp-admin` files should not stay on the server.
7. Confirm SSL is on for the domain, and that both `whilewewerethere.com` and `www.whilewewerethere.com` point at this site. The `.htaccess` rules send `www` and `http` to `https://whilewewerethere.com`.
8. After the first deploy, open the live homepage, `/blog/`, `/sitemap.xml`, `/rss.xml`, and `/robots.txt`. The sample stories should not be there.

The first GitHub Action run happens when `main` is updated. Until then, `deploy` does not exist and Hostinger has nothing to pull.

## Brand images

`npm run brand` redraws `public/og.png`, the favicon PNGs, and the sample-post illustrations from the SVGs in `src/assets/`. The committed PNGs are what the site uses. You do not need to run it for a normal content update.
