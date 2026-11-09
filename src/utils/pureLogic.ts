/**
 * Pure business logic and utilities for Sales GoPay Spiker
 * Handles currency formatting, WhatsApp link generation, phone validation,
 * dynamic sitemap/robots generation, Schema.org generation, and setup progress.
 */

export interface StoreIdentity {
  storeName: string;
  ownerName: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  operatingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  status: 'Tersedia' | 'Pre-Order' | 'Stok Habis';
  imageUrl: string;
  shortDescription: string;
  specifications: string[];
  sortOrder: number;
}

export interface SeoSettings {
  seoTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleSearchConsoleVerification: string;
  googleAnalyticsId: string;
  canonicalDomain: string;
  localSeoCity: string;
  localSeoProvince: string;
}

export interface WhatsAppSettings {
  whatsappNumber: string;
  orderMessageTemplate: string;
  floatingButtonEnabled: boolean;
  floatingButtonText: string;
  floatingMessage: string;
  productButtonEnabled: boolean;
}

/**
 * Format numeric value to Indonesian Rupiah (e.g. 499000 -> "Rp 499.000")
 */
export function formatRupiah(value: number): string {
  if (typeof value !== 'number' || isNaN(value) || value < 0) {
    return 'Rp 0';
  }
  const formatted = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

/**
 * Validate and sanitize Indonesian phone/WhatsApp numbers
 * Converts formats like '0812-3456-7890' or '+62 812...' to '6281234567890'
 */
export function validateIndonesianPhone(input: string): {
  valid: boolean;
  formatted: string;
  error?: string;
} {
  if (!input || typeof input !== 'string') {
    return { valid: false, formatted: '', error: 'Nomor WhatsApp belum diisi' };
  }

  // Strip spaces, dashes, parentheses, plus
  let cleaned = input.replace(/[\s\-\(\)\+]/g, '');

  // If starts with 08..., convert to 628...
  if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.slice(2);
  }

  // Indonesian mobile numbers are usually 628 + 8 to 11 digits (total 11 to 14 digits)
  const indonesianRegex = /^628\d{8,11}$/;
  if (!indonesianRegex.test(cleaned)) {
    return {
      valid: false,
      formatted: cleaned,
      error: 'Nomor WhatsApp harus berformat Indonesia (contoh: 08123456789 atau 628123456789)',
    };
  }

  return { valid: true, formatted: cleaned };
}

/**
 * Build a WhatsApp direct click-to-chat URL with templated variables
 */
export function formatWhatsAppUrl(
  phone: string,
  template: string,
  variables: Record<string, string>
): string {
  const sanitized = phone.replace(/[\s\-\(\)\+]/g, '');
  if (!sanitized) return '';

  let message = template || 'Halo, saya tertarik dengan produk GoPay Spiker.';
  for (const [key, val] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\{${key}\\}`, 'g');
    message = message.replace(placeholder, val);
  }

  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate XML Sitemap for search engines
 */
export function generateSitemapXml(
  domain: string,
  articles: Array<{ slug: string; updatedAt?: string }> = []
): string {
  const baseDomain = (domain || 'https://salesgopayspiker.com').replace(/\/+$/, '');
  const now = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseDomain}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseDomain}/#produk</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseDomain}/#kontak</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  for (const article of articles) {
    if (article.slug) {
      const artDate = article.updatedAt ? article.updatedAt.split('T')[0] : now;
      xml += `
  <url>
    <loc>${baseDomain}/artikel/${encodeURIComponent(article.slug)}</loc>
    <lastmod>${artDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
  }

  xml += `
</urlset>`;

  return xml.trim();
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(domain: string): string {
  const baseDomain = (domain || 'https://salesgopayspiker.com').replace(/\/+$/, '');
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin

Sitemap: ${baseDomain}/sitemap.xml
`;
}

/**
 * Generate Schema.org JSON-LD structured data using only real user data
 */
export function generateJsonLdSchema(
  identity: Partial<StoreIdentity>,
  products: ProductItem[],
  domain: string
): object | null {
  const baseDomain = (domain || 'https://salesgopayspiker.com').replace(/\/+$/, '');
  const schemas: any[] = [];

  // LocalBusiness / Store schema if identity has storeName
  if (identity.storeName && identity.storeName.trim().length > 0) {
    const businessSchema: any = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: identity.storeName,
      url: baseDomain,
    };

    if (identity.phone) businessSchema.telephone = identity.phone;
    if (identity.email) businessSchema.email = identity.email;
    if (identity.logoUrl) businessSchema.image = identity.logoUrl;

    if (identity.address || identity.city || identity.province) {
      businessSchema.address = {
        '@type': 'PostalAddress',
        ...(identity.address && { streetAddress: identity.address }),
        ...(identity.city && { addressLocality: identity.city }),
        ...(identity.province && { addressRegion: identity.province }),
        ...(identity.postalCode && { postalCode: identity.postalCode }),
        addressCountry: 'ID',
      };
    }

    if (identity.operatingHours) {
      businessSchema.openingHours = identity.operatingHours;
    }

    schemas.push(businessSchema);
  }

  // Product schemas for active products
  for (const prod of products) {
    if (prod.name && prod.price > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: prod.name,
        description: prod.shortDescription || prod.name,
        image: prod.imageUrl || undefined,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'IDR',
          price: prod.price,
          availability:
            prod.status === 'Tersedia'
              ? 'https://schema.org/InStock'
              : prod.status === 'Pre-Order'
              ? 'https://schema.org/PreOrder'
              : 'https://schema.org/OutOfStock',
          url: `${baseDomain}/#produk`,
        },
      });
    }
  }

  if (schemas.length === 0) return null;
  return schemas.length === 1 ? schemas[0] : schemas;
}

/**
 * Calculate setup completion progress for administrator dashboard
 */
export function calculateSetupProgress(state: {
  hasAdmin: boolean;
  identity?: Partial<StoreIdentity>;
  whatsappSettings?: Partial<WhatsAppSettings>;
  products?: ProductItem[];
  features?: any[];
  seoSettings?: Partial<SeoSettings>;
}): {
  percent: number;
  completedCount: number;
  totalCount: number;
  pendingTasks: string[];
} {
  const tasks = [
    {
      id: 'admin',
      label: 'Buat Akun Administrator',
      done: Boolean(state.hasAdmin),
    },
    {
      id: 'identity_name',
      label: 'Isi Nama Toko / Penjual',
      done: Boolean(state.identity?.storeName?.trim()),
    },
    {
      id: 'identity_contact',
      label: 'Isi Alamat & Kontak Toko',
      done: Boolean(state.identity?.address?.trim() || state.identity?.city?.trim()),
    },
    {
      id: 'whatsapp',
      label: 'Atur Nomor WhatsApp Pemesanan',
      done: Boolean(state.whatsappSettings?.whatsappNumber?.trim()),
    },
    {
      id: 'product',
      label: 'Tambahkan Produk GoPay Spiker Pertama',
      done: Boolean(state.products && state.products.length > 0),
    },
    {
      id: 'features',
      label: 'Masukkan Keunggulan Produk',
      done: Boolean(state.features && state.features.length > 0),
    },
    {
      id: 'seo',
      label: 'Lengkapi Meta Judul & Deskripsi SEO',
      done: Boolean(state.seoSettings?.seoTitle?.trim() && state.seoSettings?.metaDescription?.trim()),
    },
  ];

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const percent = Math.round((completedCount / totalCount) * 100);
  const pendingTasks = tasks.filter((t) => !t.done).map((t) => t.label);

  return {
    percent,
    completedCount,
    totalCount,
    pendingTasks,
  };
}
