import { site } from './site';

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: readonly FaqItem[] = [
  {
    question: 'Who is this family?',
    answer:
      'Andrew and Michelle, and their children Harrison (9), Sullivan (6), and Maeve (6), as of 2026. We live in Toronto, Canada. The site uses first names only.',
  },
  {
    question: 'What is While We Were There?',
    answer:
      'A journal of the outings we actually do: longer family trips, day trips, and local days around home. The films from those same days are on our YouTube channel.',
  },
  {
    question: 'Do you write about places you have not been?',
    answer:
      'No. If a story is on this site, we were there. We do not publish itineraries for trips we have not taken, and we do not invent a place to fill an empty week.',
  },
  {
    question: "What do the ages on a post mean?",
    answer:
      "They are the kids' ages on that trip, not their ages today. A walk that is easy at nine can be a carry at six, and we want the story to stay true to the day.",
  },
  {
    question: 'Will you share a last name, a school, or a home address?',
    answer:
      'No. Please do not send us those details either. Photos, when a story has them, are chosen with that in mind.',
  },
  {
    question: 'Where are the videos?',
    answer: `On YouTube: ${site.youtube}. The same link is in the header and footer of every page. If a story includes a film, the player loads only after you press play.`,
  },
  {
    question: 'Do you use ads or affiliate links?',
    answer:
      'Not now. The site has a place reserved for both, and both are switched off. If we turn them on, the story will say so in plain language, and the privacy page will be updated. A sponsored outing will never be written up as an ordinary one.',
  },
  {
    question: 'How do I contact you?',
    answer: `Email ${site.email}. There is no contact form and no account. The message goes through your own email app to our inbox.`,
  },
  {
    question: 'Can I suggest a place?',
    answer:
      'Yes, especially if you have been there with children around these ages. We cannot promise we will go, and we only write about a place after we have actually been.',
  },
  {
    question: 'May I reuse your photos or writing?',
    answer: `Ask first, at ${site.email}. Please do not republish photos of the children.`,
  },
];

export type LinkPart =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string; href: string; external: boolean };

const LINK_RE =
  /(https:\/\/www\.youtube\.com\/@Whilewewerethere|https:\/\/policies\.google\.com\/privacy|hello@whilewewerethere\.com)/g;

export function linkParts(text: string): LinkPart[] {
  const parts: LinkPart[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_RE)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ type: 'text', value: text.slice(last, index) });
    const value = match[0];
    parts.push({
      type: 'link',
      value,
      href: value.startsWith('http') ? value : `mailto:${value}`,
      external: value.startsWith('http'),
    });
    last = index + value.length;
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
}
