import React, { useState } from 'react';
import { MessageCircle, Check, AlertCircle, Phone, Info } from 'lucide-react';
import { WhatsAppSettings, StoreIdentity } from '../../../types.ts';
import { validateIndonesianPhone, formatWhatsAppUrl } from '../../../utils/pureLogic.ts';
import { saveAdminSection } from '../../../utils/api.ts';

interface WhatsAppViewProps {
  initialSettings: WhatsAppSettings;
  identity: StoreIdentity;
  onUpdate: (updated: WhatsAppSettings) => void;
}

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({
  initialSettings,
  identity,
  onUpdate,
}) => {
  const [settings, setSettings] = useState<WhatsAppSettings>({ ...initialSettings });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const phoneValidation = validateIndonesianPhone(settings.whatsappNumber);

  const handleChange = (field: keyof WhatsAppSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (settings.whatsappNumber.trim()) {
      const check = validateIndonesianPhone(settings.whatsappNumber);
      if (!check.valid) {
        setError(check.error || 'Format nomor WhatsApp tidak valid.');
        setSaving(false);
        return;
      }
      // auto clean to standard 628... format
      settings.whatsappNumber = check.formatted;
    }

    try {
      const res = await saveAdminSection('whatsappSettings', settings);
      if (res.success) {
        onUpdate(settings);
        setMessage('Pengaturan WhatsApp berhasil disimpan!');
        setTimeout(() => setMessage(''), 4000);
      } else {
        setError(res.message || 'Gagal menyimpan pengaturan WhatsApp.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  // Preview generated URL and message
  const previewMessage = (
    settings.orderMessageTemplate ||
    'Halo, saya tertarik memesan produk {produk} dengan harga {harga} di {toko}.'
  )
    .replace('{produk}', 'GoPay Spiker 4G LTE')
    .replace('{harga}', 'Rp 499.000')
    .replace('{toko}', identity.storeName || 'Nama Toko Anda');

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-[#25D366]" />
          <span>Pengaturan WhatsApp & Pesan Otomatis Pemesanan</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Atur nomor WhatsApp tujuan dan format pesan pemesanan langsung dari calon pembeli.
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

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Nomor WhatsApp */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Nomor WhatsApp Penjual (Wajib Diisi untuk Menerima Pesanan)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="Contoh: 08123456789 atau 628123456789"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#25D366] focus:outline-none"
            />
          </div>

          {settings.whatsappNumber ? (
            phoneValidation.valid ? (
              <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                Format valid: Tersambung ke +{phoneValidation.formatted}
              </p>
            ) : (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {phoneValidation.error}
              </p>
            )
          ) : (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Tombol pemesanan di website akan otomatis disembunyikan sampai nomor ini diisi.
            </p>
          )}
        </div>

        {/* Template Pesan Pemesanan */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Template Pesan Otomatis Ketika Pembeli Mengklik "Pesan Produk"
          </label>
          <textarea
            rows={3}
            value={settings.orderMessageTemplate}
            onChange={(e) => handleChange('orderMessageTemplate', e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#25D366] focus:outline-none"
          />
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Variabel yang tersedia:</span>
            <code className="px-2 py-0.5 bg-slate-100 rounded text-cyan-700 font-mono">
              {'{produk}'}
            </code>
            <code className="px-2 py-0.5 bg-slate-100 rounded text-cyan-700 font-mono">
              {'{harga}'}
            </code>
            <code className="px-2 py-0.5 bg-slate-100 rounded text-cyan-700 font-mono">
              {'{toko}'}
            </code>
          </div>
        </div>

        {/* Interactive Live WhatsApp Chat Preview */}
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            Simulasi Tampilan Pesan di WhatsApp Penjual:
          </span>
          <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs text-slate-800 shadow-inner max-w-lg whitespace-pre-wrap font-sans">
            {previewMessage}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Pengaturan Tombol di Halaman Publik
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.productButtonEnabled}
                onChange={(e) => handleChange('productButtonEnabled', e.target.checked)}
                className="w-4 h-4 text-[#25D366] rounded border-slate-300"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">
                  Aktifkan Tombol WhatsApp di Setiap Kartu Produk
                </span>
                <span className="text-slate-500">
                  Menampilkan tombol "Pesan Sekarang via WhatsApp" pada setiap item katalog.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.floatingButtonEnabled}
                onChange={(e) => handleChange('floatingButtonEnabled', e.target.checked)}
                className="w-4 h-4 text-[#25D366] rounded border-slate-300"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">
                  Aktifkan Tombol WhatsApp Melayang (Floating Button)
                </span>
                <span className="text-slate-500">
                  Menampilkan tombol bulat hijau di sudut kanan bawah layar yang selalu terlihat saat halaman digeser.
                </span>
              </div>
            </label>
          </div>

          {settings.floatingButtonEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Label Tombol Melayang
                </label>
                <input
                  type="text"
                  value={settings.floatingButtonText}
                  onChange={(e) => handleChange('floatingButtonText', e.target.value)}
                  placeholder="Hubungi Penjual"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pesan Pembuka Tombol Melayang
                </label>
                <input
                  type="text"
                  value={settings.floatingMessage}
                  onChange={(e) => handleChange('floatingMessage', e.target.value)}
                  placeholder="Halo, saya ingin bertanya tentang GoPay Spiker."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow transition cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan WhatsApp'}
          </button>
        </div>
      </form>
    </div>
  );
};
