import { AppState } from '../types.ts';

const TOKEN_KEY = 'sales_gopayspiker_token';
const LOCAL_DB_KEY = 'sales_gopayspiker_static_db';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// Default empty state for static deployments (Netlify/Vercel static)
function getStaticDefaultState(): AppState {
  return {
    hasAdmin: false,
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
    products: [],
    features: [],
    howToOrder: [],
    testimonials: [],
    faqs: [],
    articles: [],
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
      siteStatus: 'active',
    },
  };
}

function getLocalDb(): { state: AppState; admin: any } {
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return { state: getStaticDefaultState(), admin: null };
}

function saveLocalDb(data: { state: AppState; admin: any }) {
  localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(data));
}

// Check if running on static host where /api doesn't respond with JSON
let isStaticMode = false;

export async function fetchPublicState(): Promise<{ success: boolean; data: AppState; message?: string }> {
  try {
    const res = await fetch('/api/state');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    // Static mode fallback (e.g. on Netlify static deploy)
    isStaticMode = true;
    const local = getLocalDb();
    local.state.hasAdmin = Boolean(local.admin);
    return { success: true, data: local.state };
  } catch (err: any) {
    isStaticMode = true;
    const local = getLocalDb();
    local.state.hasAdmin = Boolean(local.admin);
    return { success: true, data: local.state };
  }
}

export async function checkAdminStatus(): Promise<{ success: boolean; hasAdmin: boolean; adminEmail?: string }> {
  try {
    const res = await fetch('/api/admin/check');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    isStaticMode = true;
    const local = getLocalDb();
    return { success: true, hasAdmin: Boolean(local.admin), adminEmail: local.admin?.email };
  } catch (err) {
    isStaticMode = true;
    const local = getLocalDb();
    return { success: true, hasAdmin: Boolean(local.admin), adminEmail: local.admin?.email };
  }
}

export async function setupAdmin(payload: { username: string; password: string; email: string }) {
  if (isStaticMode) {
    const local = getLocalDb();
    local.admin = {
      username: payload.username,
      email: payload.email,
      password: payload.password, // stored locally in static mode
      createdAt: new Date().toISOString(),
    };
    local.state.hasAdmin = true;
    if (payload.email) local.state.siteSettings.adminEmail = payload.email;
    saveLocalDb(local);
    const token = 'static_token_' + Date.now();
    authStorage.setToken(token);
    return { success: true, token, user: { username: payload.username, email: payload.email } };
  }

  try {
    const res = await fetch('/api/admin/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success && data.token) {
      authStorage.setToken(data.token);
    }
    return data;
  } catch (e) {
    isStaticMode = true;
    return setupAdmin(payload);
  }
}

export async function loginAdmin(payload: { username: string; password: string }) {
  if (isStaticMode) {
    const local = getLocalDb();
    if (!local.admin) {
      return { success: false, message: 'Belum ada akun admin terdaftar.' };
    }
    if (
      local.admin.username.toLowerCase() === payload.username.toLowerCase() &&
      local.admin.password === payload.password
    ) {
      const token = 'static_token_' + Date.now();
      authStorage.setToken(token);
      return { success: true, token, user: { username: local.admin.username, email: local.admin.email } };
    }
    return { success: false, message: 'Username atau password salah.' };
  }

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success && data.token) {
      authStorage.setToken(data.token);
    }
    return data;
  } catch (e) {
    isStaticMode = true;
    return loginAdmin(payload);
  }
}

export async function logoutAdmin() {
  const token = authStorage.getToken();
  if (token && !isStaticMode) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      // ignore
    }
  }
  authStorage.removeToken();
}

export async function fetchAdminData(): Promise<{ success: boolean; data?: AppState; message?: string }> {
  if (isStaticMode) {
    const local = getLocalDb();
    local.state.hasAdmin = Boolean(local.admin);
    local.state.adminUser = {
      username: local.admin?.username,
      email: local.admin?.email,
      createdAt: local.admin?.createdAt,
    };
    return { success: true, data: local.state };
  }

  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  try {
    const res = await fetch('/api/admin/data', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      authStorage.removeToken();
      return { success: false, message: 'Sesi berakhir' };
    }
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      isStaticMode = true;
      return fetchAdminData();
    }
    return await res.json();
  } catch (err: any) {
    isStaticMode = true;
    return fetchAdminData();
  }
}

export async function saveAdminSection(section: string, data: any) {
  if (isStaticMode) {
    const local = getLocalDb();
    (local.state as any)[section] = data;
    saveLocalDb(local);
    return { success: true, message: `Pengaturan ${section} berhasil disimpan.` };
  }

  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  try {
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ section, data }),
    });
    return await res.json();
  } catch (e) {
    isStaticMode = true;
    return saveAdminSection(section, data);
  }
}

export async function saveAllAdminData(fullState: Partial<AppState>) {
  if (isStaticMode) {
    const local = getLocalDb();
    Object.assign(local.state, fullState);
    saveLocalDb(local);
    return { success: true, message: 'Seluruh data berhasil disimpan.' };
  }

  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  try {
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(fullState),
    });
    return await res.json();
  } catch (e) {
    isStaticMode = true;
    return saveAllAdminData(fullState);
  }
}

export async function restoreAdminBackup(backupData: any) {
  if (isStaticMode) {
    const local = getLocalDb();
    const allowed = [
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
    for (const k of allowed) {
      if (backupData[k] !== undefined) {
        (local.state as any)[k] = backupData[k];
      }
    }
    saveLocalDb(local);
    return { success: true, message: 'Data berhasil dipulihkan.' };
  }

  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  try {
    const res = await fetch('/api/admin/restore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(backupData),
    });
    return await res.json();
  } catch (e) {
    isStaticMode = true;
    return restoreAdminBackup(backupData);
  }
}

export async function resetDatabase() {
  if (isStaticMode) {
    const local = getLocalDb();
    local.state = getStaticDefaultState();
    saveLocalDb(local);
    return { success: true, message: 'Database telah dibersihkan.' };
  }

  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  try {
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (e) {
    isStaticMode = true;
    return resetDatabase();
  }
}

export async function changeAdminPassword(payload: {
  currentPassword: string;
  newUsername?: string;
  newPassword?: string;
  newEmail?: string;
}) {
  if (isStaticMode) {
    const local = getLocalDb();
    if (local.admin?.password !== payload.currentPassword) {
      return { success: false, message: 'Password saat ini salah.' };
    }
    if (payload.newUsername) local.admin.username = payload.newUsername;
    if (payload.newEmail) {
      local.admin.email = payload.newEmail;
      local.state.siteSettings.adminEmail = payload.newEmail;
    }
    if (payload.newPassword) local.admin.password = payload.newPassword;
    saveLocalDb(local);
    return { success: true, message: 'Akun admin berhasil diperbarui.' };
  }

  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  try {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (e) {
    isStaticMode = true;
    return changeAdminPassword(payload);
  }
}
