const WP_URL = import.meta.env.WORDPRESS_URL;
const WP_TOKEN = import.meta.env.WORDPRESS_TOKEN;

const headers: HeadersInit = {
  'Content-Type': 'application/json',
};

if (WP_TOKEN && WP_TOKEN !== 'your_application_password_or_token_here') {
  // If it's a WordPress Application Password, it usually needs to be Base64 encoded: "user:pass"
  // For simplicity and flexibility, we assume the user provides the full "Bearer <token>" or "Basic <base64>" 
  // or we can just try to pass it as is if it's a pre-formatted header value.
  headers['Authorization'] = WP_TOKEN;
}

export async function getWpPosts() {
  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?_embed`, { headers });
    if (!res.ok) throw new Error('Failed to fetch WP posts');
    const posts = await res.json();
    return posts.map((post: any) => ({
      id: post.slug,
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
      date: new Date(post.date),
      author: post._embedded?.author?.[0]?.name || 'Tim Jayatama',
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      content: post.content.rendered,
      tags: [], // Can be expanded to fetch categories/tags
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getWpPostBySlug(slug: string) {
  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`, { headers });
    if (!res.ok) throw new Error('Failed to fetch WP post');
    const posts = await res.json();
    if (posts.length === 0) return null;
    const post = posts[0];
    return {
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
      date: new Date(post.date),
      author: post._embedded?.author?.[0]?.name || 'Tim Jayatama',
      content: post.content.rendered,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
