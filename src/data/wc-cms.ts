const WP_URL = import.meta.env.WORDPRESS_URL?.replace(/\/$/, '');
const CK = import.meta.env.WC_CONSUMER_KEY;
const CS = import.meta.env.WC_CONSUMER_SECRET;

export async function getWcProducts() {
  try {
    if (!WP_URL || !CK || !CS) {
      console.warn('WooCommerce config missing in .env');
      return [];
    }

    // Using Query Parameters for auth (more reliable on various server configs)
    const url = `${WP_URL}/wp-json/wc/v3/products?consumer_key=${CK}&consumer_secret=${CS}&status=publish&per_page=100`;
    
    console.log('Fetching WC products...');
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`WC API Error: ${res.status} ${res.statusText}`, errorText);
      return [];
    }

    const products = await res.json();
    return products.map((product: any) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      short_description: (product.short_description || '').replace(/<[^>]*>?/gm, ''),
      price: product.price,
      image: product.images?.[0]?.src || null,
      categories: product.categories?.map((c: any) => c.name) || [],
      tags: product.tags?.map((t: any) => t.name) || [],
      sku: product.sku
    }));
  } catch (e) {
    console.error('Error fetching WC products:', e);
    return [];
  }
}

export async function getWcProductBySlug(slug: string) {
  try {
    if (!WP_URL || !CK || !CS) return null;

    const url = `${WP_URL}/wp-json/wc/v3/products?consumer_key=${CK}&consumer_secret=${CS}&slug=${slug}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`WC API Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const products = await res.json();
    if (!products || products.length === 0) return null;
    
    const product = products[0];
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      short_description: (product.short_description || '').replace(/<[^>]*>?/gm, ''),
      price: product.price,
      image: product.images?.[0]?.src || null,
      categories: product.categories?.map((c: any) => c.name) || [],
      tags: product.tags?.map((t: any) => t.name) || [],
      sku: product.sku,
      permalink: product.permalink
    };
  } catch (e) {
    console.error(`Error fetching WC product with slug ${slug}:`, e);
    return null;
  }
}
