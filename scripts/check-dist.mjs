import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const required = [
  'index.html',
  'blog/index.html',
  'destinations/index.html',
  'about/index.html',
  'contact/index.html',
  'faq/index.html',
  'privacy/index.html',
  '404.html',
  '.htaccess',
  'robots.txt',
  'rss.xml',
  'favicon.svg',
  'og.png',
  'sitemap-index.xml',
];

const failures = [];
const fail = (message) => failures.push(message);

for (const file of required) {
  if (!existsSync(join(dist, file))) fail(`missing ${file}`);
}

if (existsSync(join(dist, '404/index.html'))) {
  fail('404 was emitted as a directory; Apache ErrorDocument expects dist/404.html');
}
if (existsSync(join(dist, 'blog/sample-family-trip/index.html'))) {
  fail('sample family-trip draft was published');
}
if (existsSync(join(dist, 'blog/sample-day-trip/index.html'))) {
  fail('sample day-trip draft was published');
}

const pages = [
  'index.html',
  'blog/index.html',
  'destinations/index.html',
  'about/index.html',
  'contact/index.html',
  'faq/index.html',
  'privacy/index.html',
  '404.html',
];

for (const file of pages) {
  const html = readFileSync(join(dist, file), 'utf8');
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) fail(`${file} has ${h1s.length} h1 elements`);
  if (!html.includes('lang="en-CA"')) fail(`${file} is missing lang="en-CA"`);
  if (!html.includes('rel="canonical"')) fail(`${file} is missing a canonical link`);
  if (!html.includes('https://whilewewerethere.com')) fail(`${file} is missing the production origin`);
  if (!html.includes('property="og:image"')) fail(`${file} is missing og:image`);
  if (!html.includes('name="twitter:card"')) fail(`${file} is missing a Twitter card`);
  if (!html.includes('application/ld+json')) fail(`${file} is missing JSON-LD`);
}

const home = readFileSync(join(dist, 'index.html'), 'utf8');
if (!home.includes('https://www.youtube.com/@Whilewewerethere')) {
  fail('home page is missing the YouTube channel link');
}
if (!home.includes('No published stories yet.')) {
  fail('home page should not invent trips while the journal is empty');
}

const contact = readFileSync(join(dist, 'contact/index.html'), 'utf8');
if (!contact.includes('mailto:hello@whilewewerethere.com')) {
  fail('contact page is missing the mailto link');
}

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: https://whilewewerethere.com/sitemap-index.xml')) {
  fail('robots.txt is missing the sitemap URL');
}

const htaccess = readFileSync(join(dist, '.htaccess'), 'utf8');
if (!htaccess.includes('whilewewerethere.com') || !htaccess.includes('404.html')) {
  fail('.htaccess is missing the host redirect or the 404 document');
}

const rss = readFileSync(join(dist, 'rss.xml'), 'utf8');
if (!rss.includes('<title>While We Were There</title>')) fail('RSS feed is missing the site title');

const forbidden = ['example lake', 'example harbour', 'not a real trip', 'lorem ipsum', 'data-ad-placement', 'affiliate-disclosure', 'sample draft'];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
      continue;
    }
    if (!/\.(html|xml|txt)$/i.test(entry)) continue;
    const text = readFileSync(path, 'utf8').toLowerCase();
    for (const phrase of forbidden) {
      if (text.includes(phrase)) fail(`${path.slice(dist.length)} contains “${phrase}”`);
    }
  }
}

walk(dist);

if (failures.length) {
  console.error(failures.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log('dist check passed');
