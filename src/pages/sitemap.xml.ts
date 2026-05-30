import { getWpPosts } from '../data/wp-cms';
import { getWcProducts } from '../data/wc-cms';

export async function GET() {
  const posts = await getWpPosts();
  const products = await getWcProducts();

  const baseUrl = 'https://jayatamaborepile.com';

  const staticPages = [
    '',
    '/tentang-kami',
    '/layanan',
    '/blog',
    '/kontak',
    '/kebijakan-privasi',
    '/syarat-dan-ketentuan',
    '/sanggahan'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map((page) => {
          return `
            <url>
              <loc>${baseUrl}${page}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>${page === '' ? '1.0' : '0.8'}</priority>
            </url>
          `;
        })
        .join('')}
      ${posts
        .map((post) => {
          return `
            <url>
              <loc>${baseUrl}/blog/${post.id}</loc>
              <lastmod>${post.date.toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join('')}
      ${products
        .map((product: any) => {
          return `
            <url>
              <loc>${baseUrl}/layanan/${product.slug}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
