import React, { useState } from 'react';
import { Globe, Check, AlertCircle, ExternalLink, Search, BarChart3, MapPin } from 'lucide-react';
import { SeoSettings, StoreIdentity } from '../../../types.ts';
import { saveAdminSection } from '../../../utils/api.ts';

interface SeoViewProps {
  initialSeo: SeoSettings;
  identity: StoreIdentity;
  onUpdate: (updated: SeoSettings) => void;
}

export const SeoView: React.FC<SeoViewProps> = ({ initialSeo, identity, onUpdate }) => {
  const [formData, setFormData] = useState<SeoSettings>({ ...initialSeo });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field: keyof SeoSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await saveAdminSection('seoSettings', formData);
      if (res.success) {
        onUpdate(formData);
        setMessage('Pengaturan SEO Google berhasil disimpan!');
        setTimeout(() => setMessage(''), 4000);
      } else {
        setError(res.message || 'Gagal menyimpan pengaturan SEO.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  // Google SERP preview calculation
  const previewTitle =
    formData.seoTitle ||
    (identity.storeName
      ? `${identity.storeName} - Jual GoPay Spiker Speaker Pembayaran QRIS`
      : 'Sales GoPay Spiker - Speaker Notifikasi Pembayaran QRIS');

  const previewDescription =
    formData.metaDescription ||
    'Pusat pemesanan resmi perangkat speaker notifikasi pembayaran QRIS GoPay Spiker untuk toko, kasir restoran, dan gerai UMKM. Transaksi aman bebas tipu-tipu.';

  const previewUrl = formData.canonicalDomain || 'https://salesgopayspiker.com';

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-6 h-6 text-[#00AED6]" />
          <span>Pengaturan SEO Google, Search Console & Analytics</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Optimalkan website agar mudah ditemukan di mesin pencari Google untuk kata kunci "Jual GoPay Spiker", "Harga GoPay Spiker", dsb.
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

      {/* Google SERP Interactive Preview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Search className="w-4 h-4 text-[#00AED6]" />
          <span>Pratinjau Tampilan di Hasil Pencarian Google (SERP Preview)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-sans space-y-1.5 max-w-2xl">
          <div className="text-xs text-slate-700 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#00AED6] flex items-center justify-center text-[10px] text-white font-bold">
              G
            </span>
            <span className="truncate">{previewUrl}</span>
          </div>
          <h3 className="text-blue-700 text-lg font-medium hover:underline cursor-pointer leading-snug">
            {previewTitle}
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            {previewDescription}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* On-Page SEO */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Meta Tag SEO Halaman Utama
          </h3>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                SEO Meta Title (Judul Tab & Google)
              </label>
              <span className="text-[11px] text-slate-400">
                {formData.seoTitle.length}/60 karakter disarankan
              </span>
            </div>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => handleChange('seoTitle', e.target.value)}
              placeholder="Contoh: Jual GoPay Spiker Resmi - Speaker Notifikasi Pembayaran QRIS"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                SEO Meta Description (Deskripsi di Google)
              </label>
              <span className="text-[11px] text-slate-400">
                {formData.metaDescription.length}/160 karakter disarankan
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              placeholder="Contoh: Dapatkan perangkat GoPay Spiker asli untuk toko Anda. Notifikasi suara otomatis setiap pembayaran QRIS masuk seketika. Hubungi kami untuk harga & pemesanan."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meta Keywords (Opsional)
            </label>
            <input
              type="text"
              value={formData.metaKeywords}
              onChange={(e) => handleChange('metaKeywords', e.target.value)}
              placeholder="Jual GoPay Spiker, Harga GoPay Spiker, Beli GoPay Spiker, Speaker QRIS toko"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Canonical Domain Website
            </label>
            <input
              type="url"
              value={formData.canonicalDomain}
              onChange={(e) => handleChange('canonicalDomain', e.target.value)}
              placeholder="https://gopayspiker.com atau https://domain-anda.com"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
          </div>
        </div>

        {/* Google Search Console Verification */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#00AED6]" />
            <span>2. Integrasi Google Search Console</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kode Verifikasi Google Search Console (HTML Tag / Token)
            </label>
            <input
              type="text"
              value={formData.googleSearchConsoleVerification}
              onChange={(e) =>
                handleChange('googleSearchConsoleVerification', e.target.value)
              }
              placeholder="Contoh: google-site-verification=abc123xyz atau kode token verifikasi"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Sistem akan otomatis menyematkan tag &lt;meta name="google-site-verification"&gt; ke dalam header HTML website.
            </p>
          </div>
        </div>

        {/* Google Analytics 4 */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>3. Google Analytics 4 (GA4)</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Measurement ID Google Analytics 4
            </label>
            <input
              type="text"
              value={formData.googleAnalyticsId}
              onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Masukkan ID pelacakan statistik pengunjung resmi dari akun Google Analytics Anda.
            </p>
          </div>
        </div>

        {/* Local SEO */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>4. Pengaturan SEO Lokal</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Kota Layanan
              </label>
              <input
                type="text"
                value={formData.localSeoCity}
                onChange={(e) => handleChange('localSeoCity', e.target.value)}
                placeholder="Contoh: Jakarta / Surabaya / Medan"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Provinsi
              </label>
              <input
                type="text"
                value={formData.localSeoProvince}
                onChange={(e) => handleChange('localSeoProvince', e.target.value)}
                placeholder="Contoh: Jawa Timur"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SEO Technical Endpoints Link */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            File SEO Teknis Otomatis:
          </span>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#00AED6]">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <span>Buka Sitemap.xml</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <span>Buka Robots.txt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#00AED6] hover:bg-[#0092b3] text-white font-bold text-sm shadow transition cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan SEO'}
          </button>
        </div>
      </form>
    </div>
  );
};
