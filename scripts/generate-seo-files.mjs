import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const siteUrl = (
  process.env.VITE_SITE_URL ||
  process.env.DEPLOY_PRIME_URL ||
  process.env.URL ||
  'http://localhost:5173'
).replace(/\/+$/, '');

const pages = [
  '/',
  '/about',
  '/contact',
  '/development',
  '/schemes',
  '/tenders',
  '/gallery',
  '/grievance',
  '/rti',
  '/transparency/gram-sabha',
  '/transparency/budget',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${siteUrl}${page}</loc></url>`).join('\n')}
</urlset>
`;

const outputDirectory = join(process.cwd(), 'dist');
await mkdir(outputDirectory, { recursive: true });
await writeFile(join(outputDirectory, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(
  join(outputDirectory, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
  'utf8'
);

console.log(`Generated sitemap.xml and robots.txt for ${siteUrl}`);
