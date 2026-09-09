import fs from 'node:fs';
import path from 'node:path';

const registryPath = path.resolve('lib/calculator-registry.ts');
const source = fs.readFileSync(registryPath, 'utf8');
const slugMatches = [...source.matchAll(/d\('[^']+','([^']+)'/g)].map((match) => match[1]);
const uniqueSlugs = [...new Set(slugMatches)];
const base = 'https://armannoyada.github.io/Finance-Calculator';

const urls = [
  `<url><loc>${base}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
  `<url><loc>${base}/calculators/</loc><changefreq>weekly</changefreq><priority>0.95</priority></url>`,
  ...uniqueSlugs.map((slug) => `<url><loc>${base}/calculators/${slug}/</loc><changefreq>monthly</changefreq><priority>0.75</priority></url>`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls.join('\n  ')}\n</urlset>\n`;
fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/sitemap.xml', xml);
console.log(`Generated sitemap with ${uniqueSlugs.length} calculator URLs.`);
