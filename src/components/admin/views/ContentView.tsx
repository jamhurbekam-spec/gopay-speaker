import React, { useState } from 'react';
import { Layers, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { FeatureItem, HowToOrderItem } from '../../../types.ts';
import { saveAdminSection } from '../../../utils/api.ts';

interface ContentViewProps {
  initialFeatures: FeatureItem[];
  initialHowToOrder: HowToOrderItem[];
  onUpdate: (features: FeatureItem[], howToOrder: HowToOrderItem[]) => void;
}

export const ContentView: React.FC<ContentViewProps> = ({
  initialFeatures,
  initialHowToOrder,
  onUpdate,
}) => {
  const [features, setFeatures] = useState<FeatureItem[]>([...initialFeatures]);
  const [howToOrder, setHowToOrder] = useState<HowToOrderItem[]>([...initialHowToOrder]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Feature item helpers
  const handleAddFeature = () => {
    const newFeature: FeatureItem = {
      id: 'feat_' + Date.now(),
      title: '',
      description: '',
      sortOrder: features.length + 1,
    };
    setFeatures([...features, newFeature]);
  };

  const handleUpdateFeature = (idx: number, field: keyof FeatureItem, value: any) => {
    const updated = [...features];
    updated[idx] = { ...updated[idx], [field]: value };
    setFeatures(updated);
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // Step item helpers
  const handleAddStep = () => {
    const newStep: HowToOrderItem = {
      id: 'step_' + Date.now(),
      stepNumber: howToOrder.length + 1,
      title: '',
      description: '',
    };
    setHowToOrder([...howToOrder, newStep]);
  };

  const handleUpdateStep = (idx: number, field: keyof HowToOrderItem, value: any) => {
    const updated = [...howToOrder];
    updated[idx] = { ...updated[idx], [field]: value };
    setHowToOrder(updated);
  };

  const handleRemoveStep = (idx: number) => {
    setHowToOrder(howToOrder.filter((_, i) => i !== idx));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const resFeat = await saveAdminSection('features', features);
      const resOrder = await saveAdminSection('howToOrder', howToOrder);

      if (resFeat.success && resOrder.success) {
        onUpdate(features, howToOrder);
        setMessage('Seluruh konten keunggulan & cara pemesanan berhasil disimpan!');
        setTimeout(() => setMessage(''), 4000);
      } else {
        setError('Gagal menyimpan beberapa bagian konten.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#00AED6]" />
            <span>Kelola Konten Halaman Depan</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Atur poin keunggulan perangkat dan alur cara pemesanan untuk calon pelanggan.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#00AED6] hover:bg-[#0092b3] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition cursor-pointer disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Semua Konten'}</span>
        </button>
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

      {/* Bagian 1: Keunggulan Produk */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              1. Poin Keunggulan GoPay Spiker
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Jika kosong, bagian ini otomatis disembunyikan dari halaman publik.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddFeature}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-[#00AED6] text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Keunggulan</span>
          </button>
        </div>

        {features.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
            Belum ada poin keunggulan. Klik tombol "Tambah Keunggulan" di atas untuk menambahkan.
          </div>
        ) : (
          <div className="space-y-4">
            {features.map((feat, idx) => (
              <div
                key={feat.id || idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Keunggulan #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Judul Keunggulan
                    </label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)}
                      placeholder="Contoh: Suara Notifikasi Jernih"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Deskripsi Penjelasan
                    </label>
                    <input
                      type="text"
                      value={feat.description}
                      onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)}
                      placeholder="Contoh: Mengumumkan nominal pembayaran QRIS secara instan tanpa perlu cek smartphone kasir."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bagian 2: Cara Pemesanan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              2. Langkah Alur Pemesanan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Jelaskan tahapan praktis mulai dari konsultasi hingga perangkat sampai dan aktif.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddStep}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-[#00AED6] text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Langkah</span>
          </button>
        </div>

        {howToOrder.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
            Belum ada langkah pemesanan. Klik "Tambah Langkah" untuk membuat panduan urutan order.
          </div>
        ) : (
          <div className="space-y-4">
            {howToOrder.map((step, idx) => (
              <div
                key={step.id || idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Langkah Ke-{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Judul Langkah
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                      placeholder="Contoh: Pilih Produk & Chat WA"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Keterangan Detail
                    </label>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                      placeholder="Contoh: Klik tombol pesan pada katalog untuk terhubung langsung ke WhatsApp kami."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#00AED6] hover:bg-[#0092b3] text-white font-bold text-xs shadow transition cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan Konten'}
          </button>
        </div>
      </div>
    </div>
  );
};
