import React, { useState } from 'react';
import { Palette, Upload, Check, AlertCircle } from 'lucide-react';
import { AppearanceSettings } from '../../../types.ts';
import { saveAdminSection } from '../../../utils/api.ts';

interface AppearanceViewProps {
  initialAppearance: AppearanceSettings;
  onUpdate: (updated: AppearanceSettings) => void;
}

export const AppearanceView: React.FC<AppearanceViewProps> = ({ initialAppearance, onUpdate }) => {
  const [formData, setFormData] = useState<AppearanceSettings>({ ...initialAppearance });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: keyof AppearanceSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Ukuran file banner maksimal 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleChange('heroBannerUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await saveAdminSection('appearance', formData);
      if (res.success) {
        setSuccessMessage('Pengaturan tampilan berhasil disimpan!');
        onUpdate(formData);
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrorMessage(res.message || 'Gagal menyimpan tampilan.');
      }
    } catch (err) {
      setErrorMessage('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Palette className="w-6 h-6 text-[#00AED6]" />
          <span>Pengaturan Tampilan & Banner Hero</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sesuaikan warna tema dan gambar banner utama halaman depan website Anda.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-medium">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Colors */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Tema & Skema Warna
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Warna Primer Website
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor || '#00AED6'}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.primaryColor || '#00AED6'}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  placeholder="#00AED6"
                  className="w-32 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
                <span className="text-xs text-slate-500">GoPay Blue (#00AED6)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Warna Aksen / Tombol
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.accentColor || '#00880C'}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.accentColor || '#00880C'}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  placeholder="#00880C"
                  className="w-32 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
                <span className="text-xs text-slate-500">Gojek Green (#00880C)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Copy */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            2. Teks Halaman Depan (Hero Banner)
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Utama Hero
            </label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => handleChange('heroTitle', e.target.value)}
              placeholder="Contoh: Sales GoPay Spiker – Solusi Audio QRIS Toko Anda"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Kosongkan jika ingin menggunakan judul default sistem.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Singkat Hero
            </label>
            <textarea
              rows={3}
              value={formData.heroSubtitle}
              onChange={(e) => handleChange('heroSubtitle', e.target.value)}
              placeholder="Contoh: Perangkat audio box notifikasi pembayaran instan untuk mencegah penipuan QRIS di meja kasir Anda."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>
        </div>

        {/* Hero Banner Image */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            3. Banner Gambar Utama
          </h3>

          <div className="space-y-3">
            {formData.heroBannerUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-56 bg-slate-50 flex items-center justify-center">
                <img src={formData.heroBannerUrl} alt="Hero Banner Preview" className="max-h-56 w-auto object-cover" />
                <button
                  type="button"
                  onClick={() => handleChange('heroBannerUrl', '')}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-rose-700 cursor-pointer"
                >
                  Hapus Gambar
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={formData.heroBannerUrl}
                onChange={(e) => handleChange('heroBannerUrl', e.target.value)}
                placeholder="Atau masukkan URL foto banner (https://...)"
                className="flex-1 w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
              />
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer w-full sm:w-auto justify-center">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Unggah Foto Banner</span>
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
              </label>
            </div>
            <p className="text-[11px] text-slate-400">
              Format yang didukung: JPG, PNG, WebP (maksimal 8MB). Jika dikosongkan, halaman depan menampilkan ilustrasi vektor elegan.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#00AED6] hover:bg-[#0092b3] text-white font-bold text-sm shadow transition cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan Tampilan'}
          </button>
        </div>
      </form>
    </div>
  );
};
