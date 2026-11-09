import React, { useState } from 'react';
import { Settings, Download, Upload, RefreshCw, Lock, Check, AlertCircle, Shield } from 'lucide-react';
import { SiteSettings } from '../../../types.ts';
import {
  saveAdminSection,
  restoreAdminBackup,
  resetDatabase,
  changeAdminPassword,
  authStorage,
} from '../../../utils/api.ts';

interface SettingsViewProps {
  initialSettings: SiteSettings;
  adminEmail: string;
  onUpdateSettings: (updated: SiteSettings) => void;
  onReloadAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  initialSettings,
  adminEmail,
  onUpdateSettings,
  onReloadAll,
}) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ ...initialSettings });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState(adminEmail);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await saveAdminSection('siteSettings', siteSettings);
      if (res.success) {
        onUpdateSettings(siteSettings);
        setMessage('Pengaturan website berhasil diperbarui!');
        setTimeout(() => setMessage(''), 4000);
      } else {
        setError(res.message || 'Gagal menyimpan.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    const token = authStorage.getToken();
    if (!token) return;

    fetch('/api/admin/backup', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-sales-gopayspiker-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setMessage('File backup database berhasil diunduh.');
        setTimeout(() => setMessage(''), 4000);
      })
      .catch(() => setError('Gagal mengunduh cadangan.'));
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (!confirm('Pulihkan database dari file ini? Seluruh data saat ini akan ditimpa dengan data cadangan.')) {
          return;
        }

        const res = await restoreAdminBackup(json);
        if (res.success) {
          setMessage('Database berhasil dipulihkan dari cadangan!');
          onReloadAll();
        } else {
          setError(res.message || 'File cadangan tidak valid.');
        }
      } catch (err) {
        setError('Format file JSON cadangan rusak atau tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDatabase = async () => {
    const confirmed = prompt(
      'PERINGATAN: Seluruh produk, artikel, testimoni, dan pengaturan akan dikosongkan kembali ke status awal murni (Akun admin Anda tetap dipertahankan).\n\nKetik "RESET" untuk mengonfirmasi:'
    );

    if (confirmed !== 'RESET') {
      return;
    }

    try {
      const res = await resetDatabase();
      if (res.success) {
        alert('Database telah dikosongkan kembali ke status murni.');
        onReloadAll();
      } else {
        setError(res.message || 'Gagal mengosongkan database.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');

    if (!currentPassword) {
      setPasswordErr('Password saat ini wajib dimasukkan.');
      return;
    }

    try {
      const res = await changeAdminPassword({
        currentPassword,
        newUsername: newUsername.trim() || undefined,
        newPassword: newPassword || undefined,
        newEmail: newEmail.trim() || undefined,
      });

      if (res.success) {
        setPasswordMsg('Kredensial akun admin berhasil diperbarui.');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setPasswordMsg(''), 4000);
      } else {
        setPasswordErr(res.message || 'Gagal mengubah password.');
      }
    } catch (err) {
      setPasswordErr('Gagal menghubungi server.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#00AED6]" />
          <span>Pengaturan Website, Keamanan & Backup Database</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Atur status publikasi website, kelola keamanan akun admin, dan simpan cadangan database secara mandiri.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-medium">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Bagian 1: Pengaturan Website Utama */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          1. Konfigurasi Sistem Website
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Sistem Website
            </label>
            <input
              type="text"
              value={siteSettings.siteName}
              onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Domain Website Utama
            </label>
            <input
              type="text"
              value={siteSettings.siteDomain}
              onChange={(e) => setSiteSettings({ ...siteSettings, siteDomain: e.target.value })}
              placeholder="Contoh: gopayspiker.com"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Zona Waktu Operasional
            </label>
            <select
              value={siteSettings.timezone}
              onChange={(e) => setSiteSettings({ ...siteSettings, timezone: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none bg-white"
            >
              <option value="Asia/Jakarta">WIB (Waktu Indonesia Barat - UTC+7)</option>
              <option value="Asia/Makassar">WITA (Waktu Indonesia Tengah - UTC+8)</option>
              <option value="Asia/Jayapura">WIT (Waktu Indonesia Timur - UTC+9)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Website
            </label>
            <select
              value={siteSettings.siteStatus}
              onChange={(e) => setSiteSettings({ ...siteSettings, siteStatus: e.target.value as any })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none bg-white"
            >
              <option value="active">Aktif & Siap Menerima Pesanan</option>
              <option value="maintenance">Mode Pemeliharaan (Maintenance)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#00AED6] hover:bg-[#0092b3] text-white font-bold text-xs shadow transition cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>

      {/* Bagian 2: Backup & Restore Database */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#00AED6]" />
          <span>2. Cadangan & Pemulihan Database (Backup & Restore)</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Seluruh data identitas, produk, harga, konten, testimoni, FAQ, dan pengaturan SEO disimpan dalam format JSON terstruktur yang dapat Anda unduh dan pulihkan kapan saja.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Unduh Backup */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Unduh Backup Data</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Simpan seluruh data website ke komputer Anda dalam format .json
              </p>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File Backup</span>
            </button>
          </div>

          {/* Pulihkan / Restore */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Pulihkan dari Backup</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Unggah file .json cadangan sebelumnya untuk mengembalikan data
              </p>
            </div>
            <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Pilih File Restore</span>
              <input type="file" accept=".json" onChange={handleRestoreBackup} className="hidden" />
            </label>
          </div>

          {/* Reset Kosong */}
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-rose-900 text-xs">Reset ke Status Kosong</h4>
              <p className="text-[11px] text-rose-700/80 mt-1">
                Kosongkan seluruh data kembali seperti saat pertama kali diinstal
              </p>
            </div>
            <button
              onClick={handleResetDatabase}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bagian 3: Keamanan & Perubahan Password */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-800" />
          <span>3. Keamanan Akun Administrator</span>
        </h3>

        {passwordMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
            {passwordMsg}
          </div>
        )}
        {passwordErr && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
            {passwordErr}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ubah Username (Opsional)
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Kosongkan jika tidak ingin diubah"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Administrator
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password Baru (Minimal 6 Karakter)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ingin diubah"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password Saat Ini (Wajib untuk Verifikasi) *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan password saat ini"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition cursor-pointer"
          >
            Perbarui Kredensial Admin
          </button>
        </div>
      </form>
    </div>
  );
};
