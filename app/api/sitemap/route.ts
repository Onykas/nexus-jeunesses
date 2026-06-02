import { NextResponse } from 'next/server';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://nexusjeunesses.org';

const pages = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/spectacle', priority: 0.9, changefreq: 'weekly' },
  { url: '/media', priority: 0.8, changefreq: 'daily' },
  { url: '/olympiques', priority: 0.6, changefreq: 'monthly' },
  { url: '/rapport', priority: 0.7, changefreq: 'monthly' },
  { url: '/diner', priority: 0.7, changefreq: 'weekly' },
];

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(({ url, priority, changefreq }) => `  <url>
    <loc>${BASE}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
