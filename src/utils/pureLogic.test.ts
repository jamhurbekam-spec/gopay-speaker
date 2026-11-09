import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  validateIndonesianPhone,
  formatWhatsAppUrl,
  generateSitemapXml,
  generateRobotsTxt,
  generateJsonLdSchema,
  calculateSetupProgress,
} from './pureLogic.ts';

test('formatRupiah formats numeric values into standard Indonesian Rupiah', () => {
  assert.equal(formatRupiah(499000), 'Rp 499.000');
  assert.equal(formatRupiah(1250000), 'Rp 1.250.000');
  assert.equal(formatRupiah(0), 'Rp 0');
  assert.equal(formatRupiah(-100), 'Rp 0');
});

test('validateIndonesianPhone handles local 08 prefix and international 628 correctly', () => {
  const local = validateIndonesianPhone('0812-3456-7890');
  assert.equal(local.valid, true);
  assert.equal(local.formatted, '6281234567890');

  const plus = validateIndonesianPhone('+62 857 1234 5678');
  assert.equal(plus.valid, true);
  assert.equal(plus.formatted, '6285712345678');

  const invalid = validateIndonesianPhone('12345');
  assert.equal(invalid.valid, false);
  assert.ok(invalid.error);

  const empty = validateIndonesianPhone('');
  assert.equal(empty.valid, false);
});

test('formatWhatsAppUrl properly replaces template placeholders and encodes query', () => {
  const url = formatWhatsAppUrl(
    '6281234567890',
    'Halo, saya mau pesan {produk} harga {harga} di {toko}',
    {
      produk: 'GoPay Spiker 4G',
      harga: 'Rp 499.000',
      toko: 'Mitra Usaha Jaya',
    }
  );

  assert.ok(url.startsWith('https://wa.me/6281234567890?text='));
  assert.ok(url.includes(encodeURIComponent('GoPay Spiker 4G')));
  assert.ok(url.includes(encodeURIComponent('Rp 499.000')));
  assert.ok(url.includes(encodeURIComponent('Mitra Usaha Jaya')));
});

test('generateSitemapXml builds valid XML with homepage and articles', () => {
  const xml = generateSitemapXml('https://tokospiker.com', [
    { slug: 'cara-pakai-gopay-spiker', updatedAt: '2026-11-08' },
  ]);

  assert.ok(xml.includes('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('<loc>https://tokospiker.com/</loc>'));
  assert.ok(xml.includes('<loc>https://tokospiker.com/artikel/cara-pakai-gopay-spiker</loc>'));
});

test('generateRobotsTxt points correctly to domain sitemap', () => {
  const robots = generateRobotsTxt('https://tokospiker.com');
  assert.ok(robots.includes('User-agent: *'));
  assert.ok(robots.includes('Disallow: /admin'));
  assert.ok(robots.includes('Sitemap: https://tokospiker.com/sitemap.xml'));
});

test('generateJsonLdSchema returns null if no user data, and returns valid store/product schema when provided', () => {
  // Empty data returns null (no fake data generated)
  const emptySchema = generateJsonLdSchema({ storeName: '' }, [], 'https://example.com');
  assert.equal(emptySchema, null);

  // Real data returns schema
  const realSchema = generateJsonLdSchema(
    {
      storeName: 'Distributor GoPay Spiker',
      city: 'Jakarta',
      phone: '08123456789',
    },
    [
      {
        id: '1',
        name: 'GoPay Spiker Pro',
        price: 550000,
        status: 'Tersedia',
        imageUrl: '',
        shortDescription: 'Speaker notifikasi QRIS',
        specifications: ['4G', 'Baterai 2000mAh'],
        sortOrder: 1,
      },
    ],
    'https://example.com'
  );

  assert.ok(Array.isArray(realSchema));
  assert.equal(realSchema[0]['@type'], 'Store');
  assert.equal(realSchema[0].name, 'Distributor GoPay Spiker');
  assert.equal(realSchema[1]['@type'], 'Product');
  assert.equal(realSchema[1].name, 'GoPay Spiker Pro');
});

test('calculateSetupProgress computes accurate completion metrics', () => {
  const unconfigured = calculateSetupProgress({
    hasAdmin: false,
    identity: { storeName: '' },
    whatsappSettings: { whatsappNumber: '' },
    products: [],
  });
  assert.equal(unconfigured.percent, 0);
  assert.equal(unconfigured.completedCount, 0);
  assert.ok(unconfigured.pendingTasks.length > 0);

  const partial = calculateSetupProgress({
    hasAdmin: true,
    identity: { storeName: 'Toko Sukses', city: 'Surabaya' },
    whatsappSettings: { whatsappNumber: '08123456789' },
    products: [
      {
        id: '1',
        name: 'GoPay Spiker',
        price: 499000,
        status: 'Tersedia',
        imageUrl: '',
        shortDescription: '',
        specifications: [],
        sortOrder: 1,
      },
    ],
  });
  assert.ok(partial.percent > 50);
  assert.ok(partial.completedCount >= 4);
});
