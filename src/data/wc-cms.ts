const WP_URL = import.meta.env.WORDPRESS_URL;
const CK = import.meta.env.WC_CONSUMER_KEY;
const CS = import.meta.env.WC_CONSUMER_SECRET;

// Basic Auth for WooCommerce
const auth = btoa(`${CK}:${CS}`);
const headers = {
  'Authorization': `Basic ${auth}`,
  'Content-Type': 'application/json'
};

export async function getWcProducts() {
  try {
    const res = await fetch(`${WP_URL}/wp-json/wc/v3/products?status=publish&per_page=100`, { headers });
    if (!res.ok) throw new Error('Failed to fetch WooCommerce products');
    const products = await res.json();
    
    return products.map((product: any) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      short_description: product.short_description.replace(/<[^>]*>?/gm, ''),
      price: product.price,
      image: product.images[0]?.src || null,
      categories: product.categories.map((c: any) => c.name),
      tags: product.tags.map((t: any) => t.name),
      sku: product.sku
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getWcProductBySlug(slug: string) {
  try {
    const res = await fetch(`${WP_URL}/wp-json/wc/v3/products?slug=${slug}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch WooCommerce product');
    const products = await res.json();
    if (products.length === 0) return null;
    
    const product = products[0];
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      short_description: product.short_description.replace(/<[^>]*>?/gm, ''),
      price: product.price,
      image: product.images[0]?.src || null,
      categories: product.categories.map((c: any) => c.name),
      tags: product.tags.map((t: any) => t.name),
      sku: product.sku,
      permalink: product.permalink
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
