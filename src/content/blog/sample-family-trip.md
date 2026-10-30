---
title: "Sample: how a family-trip post is structured"
description: "A format sample, not a real trip. It shows the frontmatter fields a family-trip story uses."
date: 2026-02-18
heroImage: /images/sample-lake.svg
heroAlt: "Sample sketch of a canoe on a lake, used to demonstrate the hero image. Not a photograph from a trip."
destination: "Example Lake"
region: "Example Region"
tripType: family-trip
kidsAges:
  harrison: 9
  sullivan: 6
  maeve: 6
tags:
  - sample
  - format
featured: true
draft: true
# Optional. An 11-character YouTube video id. Leave it out until the film is really ours.
# youtubeId: youtubevideo
---

> **Sample draft. Not a real trip.** This file shows how a post is written. It is marked `draft: true`, so `npm run build` leaves it out of the site. Replace it with a real story, or delete it.

## What each field is for

The title is the h1. Do not add another h1 in the body. The description is the lede under the title, and it is also the summary on the blog card and in the RSS feed.

`date` is the day the story is about, or the day you publish it. Write it as `YYYY-MM-DD`. `heroImage` is a root-relative path to a file in `public/`, such as `/images/lake.jpg`. Landscape photos work best. The template frames them at 16:9. `heroAlt` is the image description. Say what is in the picture.

`destination` is the place name, spelled the same way every time you return to it. That spelling becomes the destination page. `region` is the broader area, used to group destinations and to filter the blog. `tripType` is one of `family-trip`, `day-trip`, or `local`.

`kidsAges` records Harrison, Sullivan, and Maeve on that day, not their ages when you finally type the story. The numbers in this sample are only here so the shape of the field is obvious.

`tags` are short labels. `featured: true` lets the home page prefer this destination once the post is public. Leave `youtubeId` unset until you have a real 11-character id from the While We Were There channel. When it is set, the story shows a play button that loads YouTube only after a click.

## Before you publish

Set `draft: false` only when the story is something that really happened. Read it once more for a surname, a school, or a home address. Then build the site and look at the page.
