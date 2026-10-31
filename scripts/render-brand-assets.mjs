import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const jobs = [
  ['src/assets/brand/og.svg', 'public/og.png', 1200],
  ['src/assets/samples/local-day.svg', 'src/assets/samples/local-day.png', 1600],
  ['src/assets/samples/family-trip.svg', 'src/assets/samples/family-trip.png', 1600],
];

for (const [svgPath, outPath, width] of jobs) {
  const resvg = new Resvg(readFileSync(svgPath), {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true, defaultFontFamily: 'Liberation Sans' },
  });
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, resvg.render().asPng());
  console.log(`wrote ${outPath}`);
}
