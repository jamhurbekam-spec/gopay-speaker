import { AppState } from '../types.ts';

const TOKEN_KEY = 'sales_gopayspiker_token';

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

export async function fetchPublicState(): Promise<{ success: boolean; data: AppState; message?: string }> {
  try {
    const res = await fetch('/api/state');
    return await res.json();
  } catch (err: any) {
    console.error('Failed to fetch public state:', err);
    return {
      success: false,
      message: 'Gagal memuat data dari server.',
      data: {} as AppState,
    };
  }
}

export async function checkAdminStatus(): Promise<{ success: boolean; hasAdmin: boolean; adminEmail?: string }> {
  try {
    const res = await fetch('/api/admin/check');
    return await res.json();
  } catch (err) {
    return { success: false, hasAdmin: false };
  }
}

export async function setupAdmin(payload: { username: string; password: string; email: string }) {
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
}

export async function loginAdmin(payload: { username: string; password: string }) {
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
}

export async function logoutAdmin() {
  const token = authStorage.getToken();
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      // ignore
    }
    authStorage.removeToken();
  }
}

export async function fetchAdminData(): Promise<{ success: boolean; data?: AppState; message?: string }> {
  const token = authStorage.getToken();
  if (!token) {
    return { success: false, message: 'Belum login' };
  }

  try {
    const res = await fetch('/api/admin/data', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      authStorage.removeToken();
      return { success: false, message: 'Sesi berakhir' };
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function saveAdminSection(section: string, data: any) {
  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  const res = await fetch('/api/admin/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ section, data }),
  });
  return await res.json();
}

export async function saveAllAdminData(fullState: Partial<AppState>) {
  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  const res = await fetch('/api/admin/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fullState),
  });
  return await res.json();
}

export async function restoreAdminBackup(backupData: any) {
  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  const res = await fetch('/api/admin/restore', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(backupData),
  });
  return await res.json();
}

export async function resetDatabase() {
  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  const res = await fetch('/api/admin/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}

export async function changeAdminPassword(payload: {
  currentPassword: string;
  newUsername?: string;
  newPassword?: string;
  newEmail?: string;
}) {
  const token = authStorage.getToken();
  if (!token) return { success: false, message: 'Belum login' };

  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return await res.json();
}
