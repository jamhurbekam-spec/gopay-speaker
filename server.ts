import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { generateSitemapXml, generateRobotsTxt } from './src/utils/pureLogic.ts';

dotenv.config();

// Ensure HMR is disabled in AI Studio dev environment to prevent WebSocket errors
process.env.DISABLE_HMR = 'true';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial completely empty state - zero dummy data
const getInitialState = () => ({
  admin: null as null | {
    username: string;
    email: string;
    salt: string;
    hash: string;
    createdAt: string;
  },
  identity: {
    storeName: '',
    ownerName: '',
    logoUrl: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    province: '',
    city: '',
    postalCode: '',
    operatingHours: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
  },
  appearance: {
    primaryColor: '#00AED6',
    accentColor: '#00880C',
    heroBannerUrl: '',
    heroTitle: '',
    heroSubtitle: '',
  },
  products: [] as any[],
  features: [] as any[],
  howToOrder: [] as any[],
  testimonials: [] as any[],
  faqs: [] as any[],
  articles: [] as any[],
  whatsappSettings: {
    whatsappNumber: '',
    orderMessageTemplate:
      'Halo, saya tertarik memesan produk *{produk}* dengan harga *{harga}* di {toko}. Mohon informasi ketersediaan dan cara pemesanannya.',
    floatingButtonEnabled: false,
    floatingButtonText: 'Hubungi Penjual',
    floatingMessage: 'Halo, saya ingin bertanya tentang produk GoPay Spiker.',
    productButtonEnabled: true,
  },
  seoSettings: {
    seoTitle: '',
    metaDescription: '',
    metaKeywords: '',
    googleSearchConsoleVerification: '',
    googleAnalyticsId: '',
    canonicalDomain: '',
    localSeoCity: '',
    localSeoProvince: '',
  },
  siteSettings: {
    siteName: 'Sales GoPay Spiker',
    siteDomain: '',
    adminEmail: '',
    timezone: 'Asia/Jakarta',
    siteStatus: 'active', // 'active' | 'maintenance'
  },
});

// Load or initialize DB
function loadDatabase(): ReturnType<typeof getInitialState> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return { ...getInitialState(), ...parsed };
    }
  } catch (err) {
    console.error('Error loading database, resetting to initial state:', err);
  }
  const initial = getInitialState();
  fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  return initial;
}

function saveDatabase(data: ReturnType<typeof getInitialState>): void {
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

let db = loadDatabase();

// In-memory active sessions: token -> { username, expires }
const sessions = new Map<string, { username: string; expires: number }>();

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// Middleware: JSON parser with 25MB limit for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Auth token check helper
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Autentikasi diperlukan. Sesi Anda mungkin telah kedaluwarsa.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) {
    sessions.delete(token);
    res.status(401).json({ success: false, message: 'Sesi login telah berakhir. Silakan login kembali.' });
    return;
  }
  // Refresh session expiry (24 hours)
  session.expires = Date.now() + 24 * 60 * 60 * 1000;
  next();
}

// ================= API ENDPOINTS ================= //

// 1. Public State Endpoint (Safe - no credentials)
app.get('/api/state', (req, res) => {
  const publicData = {
    hasAdmin: Boolean(db.admin),
    identity: db.identity,
    appearance: db.appearance,
    products: db.products,
    features: db.features,
    howToOrder: db.howToOrder,
    testimonials: db.testimonials.filter((t) => t.isApproved !== false),
    faqs: db.faqs,
    articles: db.articles,
    whatsappSettings: db.whatsappSettings,
    seoSettings: db.seoSettings,
    siteSettings: db.siteSettings,
  };
  res.json({ success: true, data: publicData });
});

// 2. Check Admin Initialization Status
app.get('/api/admin/check', (req, res) => {
  res.json({
    success: true,
    hasAdmin: Boolean(db.admin),
    adminEmail: db.admin ? db.admin.email : '',
  });
});

// 3. Setup Initial Admin (Only allowed when db.admin is null)
app.post('/api/admin/setup', (req, res) => {
  if (db.admin) {
    res.status(400).json({
      success: false,
      message: 'Akun administrator sudah dibuat sebelumnya. Silakan login menggunakan akun tersebut.',
    });
    return;
  }

  const { username, password, email } = req.body;
  if (!username || username.trim().length < 3) {
    res.status(400).json({ success: false, message: 'Username minimal 3 karakter.' });
    return;
  }
  if (!password || password.length < 6) {
    res.status(400).json({ success: false, message: 'Password minimal 6 karakter demi keamanan akun.' });
    return;
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);

  db.admin = {
    username: username.trim(),
    email: email ? email.trim() : '',
    salt,
    hash,
    createdAt: new Date().toISOString(),
  };

  if (email && email.trim()) {
    db.siteSettings.adminEmail = email.trim();
  }

  saveDatabase(db);

  // Generate session token
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    username: db.admin.username,
    expires: Date.now() + 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: 'Akun administrator berhasil dibuat dengan aman.',
    token,
    user: { username: db.admin.username, email: db.admin.email },
  });
});

// 4. Admin Login
app.post('/api/admin/login', (req, res) => {
  if (!db.admin) {
    res.status(400).json({
      success: false,
      message: 'Belum ada akun administrator yang terdaftar. Silakan lakukan inisialisasi akun.',
      needsSetup: true,
    });
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
    return;
  }

  const inputHash = hashPassword(password, db.admin.salt);
  if (
    username.trim().toLowerCase() !== db.admin.username.toLowerCase() ||
    !crypto.timingSafeEqual(Buffer.from(inputHash, 'hex'), Buffer.from(db.admin.hash, 'hex'))
  ) {
    res.status(401).json({ success: false, message: 'Username atau password tidak sesuai.' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    username: db.admin.username,
    expires: Date.now() + 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: 'Login berhasil.',
    token,
    user: { username: db.admin.username, email: db.admin.email },
  });
});

// 5. Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessions.delete(token);
  }
  res.json({ success: true, message: 'Logout berhasil.' });
});

// 6. Admin Full Data (Authenticated)
app.get('/api/admin/data', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      hasAdmin: true,
      adminUser: {
        username: db.admin?.username,
        email: db.admin?.email,
        createdAt: db.admin?.createdAt,
      },
      identity: db.identity,
      appearance: db.appearance,
      products: db.products,
      features: db.features,
      howToOrder: db.howToOrder,
      testimonials: db.testimonials,
      faqs: db.faqs,
      articles: db.articles,
      whatsappSettings: db.whatsappSettings,
      seoSettings: db.seoSettings,
      siteSettings: db.siteSettings,
    },
  });
});

// 7. Admin Save Section or Full Data (Authenticated)
app.post('/api/admin/save', authenticateToken, (req, res) => {
  const { section, data } = req.body;

  if (section && data !== undefined) {
    // Save specific section
    if (section in db && section !== 'admin') {
      (db as any)[section] = data;
      saveDatabase(db);
      res.json({ success: true, message: `Pengaturan ${section} berhasil disimpan.` });
      return;
    } else {
      res.status(400).json({ success: false, message: `Bagian ${section} tidak valid.` });
      return;
    }
  }

  // Save multiple sections
  const allowedKeys = [
    'identity',
    'appearance',
    'products',
    'features',
    'howToOrder',
    'testimonials',
    'faqs',
    'articles',
    'whatsappSettings',
    'seoSettings',
    'siteSettings',
  ];

  for (const key of allowedKeys) {
    if (req.body[key] !== undefined) {
      (db as any)[key] = req.body[key];
    }
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Seluruh data berhasil diperbarui dan disimpan.' });
});

// 8. Change Admin Credentials (Authenticated)
app.post('/api/admin/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newUsername, newPassword, newEmail } = req.body;

  if (!db.admin) {
    res.status(400).json({ success: false, message: 'Admin tidak ditemukan.' });
    return;
  }

  const currentHash = hashPassword(currentPassword || '', db.admin.salt);
  if (!crypto.timingSafeEqual(Buffer.from(currentHash, 'hex'), Buffer.from(db.admin.hash, 'hex'))) {
    res.status(400).json({ success: false, message: 'Password saat ini salah.' });
    return;
  }

  if (newUsername && newUsername.trim().length >= 3) {
    db.admin.username = newUsername.trim();
  }
  if (newEmail !== undefined) {
    db.admin.email = newEmail.trim();
    db.siteSettings.adminEmail = newEmail.trim();
  }
  if (newPassword && newPassword.length >= 6) {
    const salt = crypto.randomBytes(16).toString('hex');
    db.admin.salt = salt;
    db.admin.hash = hashPassword(newPassword, salt);
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Akun administrator berhasil diperbarui.' });
});

// 9. Backup Database (Authenticated)
app.get('/api/admin/backup', authenticateToken, (req, res) => {
  // Export data excluding sensitive salt/hash
  const exportData = {
    exportDate: new Date().toISOString(),
    system: 'Sales GoPay Spiker',
    version: '1.0.0',
    identity: db.identity,
    appearance: db.appearance,
    products: db.products,
    features: db.features,
    howToOrder: db.howToOrder,
    testimonials: db.testimonials,
    faqs: db.faqs,
    articles: db.articles,
    whatsappSettings: db.whatsappSettings,
    seoSettings: db.seoSettings,
    siteSettings: db.siteSettings,
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=backup-sales-gopayspiker-${new Date().toISOString().split('T')[0]}.json`
  );
  res.send(JSON.stringify(exportData, null, 2));
});

// 10. Restore Database (Authenticated)
app.post('/api/admin/restore', authenticateToken, (req, res) => {
  const importData = req.body;
  if (!importData || typeof importData !== 'object') {
    res.status(400).json({ success: false, message: 'Format file JSON tidak valid.' });
    return;
  }

  const allowedKeys = [
    'identity',
    'appearance',
    'products',
    'features',
    'howToOrder',
    'testimonials',
    'faqs',
    'articles',
    'whatsappSettings',
    'seoSettings',
    'siteSettings',
  ];

  for (const key of allowedKeys) {
    if (importData[key] !== undefined) {
      (db as any)[key] = importData[key];
    }
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Data berhasil dipulihkan dari cadangan.' });
});

// 11. Reset Database back to pristine empty state (Authenticated)
app.post('/api/admin/reset', authenticateToken, (req, res) => {
  const currentAdmin = db.admin;
  const pristine = getInitialState();
  pristine.admin = currentAdmin; // retain current administrator account
  db = pristine;
  saveDatabase(db);
  res.json({ success: true, message: 'Database telah dibersihkan kembali ke keadaan kosong murni.' });
});

// ================= SEO TECHNICAL ENDPOINTS ================= //

// Sitemap.xml endpoint
app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const defaultDomain = `${protocol}://${host}`;
  const domain = db.seoSettings.canonicalDomain || db.siteSettings.siteDomain || process.env.APP_URL || defaultDomain;

  const xml = generateSitemapXml(domain, db.articles);
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Robots.txt endpoint
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const defaultDomain = `${protocol}://${host}`;
  const domain = db.seoSettings.canonicalDomain || db.siteSettings.siteDomain || process.env.APP_URL || defaultDomain;

  const robots = generateRobotsTxt(domain);
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

// ================= VITE DEV OR STATIC SERVING ================= //

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sales GoPay Spiker server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
