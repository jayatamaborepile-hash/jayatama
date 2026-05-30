const WP_URL = import.meta.env.WORDPRESS_URL?.replace(/\/$/, '');
const WP_TOKEN = import.meta.env.WORDPRESS_TOKEN;

export async function getWpPosts() {
  try {
    if (!WP_URL) {
      console.warn('WORDPRESS_URL missing in environment variables. Blog posts will not be fetched.');
      return [];
    }

    const url = `${WP_URL}/wp-json/wp/v2/posts?_embed&status=publish&per_page=100`;
    console.log('Fetching WP posts from:', url);
    
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (WP_TOKEN && WP_TOKEN !== 'your_application_password_or_token_here') {
      headers['Authorization'] = WP_TOKEN;
    }

    const res = await fetch(url, { headers });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`WP API Error: ${res.status} ${res.statusText}`, errorText);
      return [];
    }

    const posts = await res.json();
    if (!Array.isArray(posts)) {
      console.error('WP API returned non-array:', posts);
      return [];
    }

    return posts.map((post: any) => ({
      id: post.slug,
      title: post.title.rendered,
      description: (post.excerpt?.rendered || '').replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
      date: new Date(post.date),
      author: post._embedded?.author?.[0]?.name || 'Tim Jayatama',
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      content: post.content.rendered,
      tags: [],
    }));
  } catch (e) {
    console.error('Error fetching WP posts:', e);
    return [];
  }
}

export async function getWpPostBySlug(slug: string) {
  try {
    if (!WP_URL) return null;

    const url = `${WP_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`;
    
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (WP_TOKEN && WP_TOKEN !== 'your_application_password_or_token_here') {
      headers['Authorization'] = WP_TOKEN;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`WP API Error: ${res.status} ${res.statusText}`);
      return null;
    }
    const posts = await res.json();
    if (!posts || posts.length === 0) return null;
    const post = posts[0];
    return {
      title: post.title.rendered,
      description: (post.excerpt?.rendered || '').replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
      date: new Date(post.date),
      author: post._embedded?.author?.[0]?.name || 'Tim Jayatama',
      content: post.content.rendered,
    };
  } catch (e) {
    console.error(`Error fetching WP post with slug ${slug}:`, e);
    return null;
  }
}
