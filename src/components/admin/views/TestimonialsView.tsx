import React, { useState } from 'react';
import { Star, Plus, Trash2, Check, AlertCircle, Eye, EyeOff, Edit2, X } from 'lucide-react';
import { TestimonialItem } from '../../../types.ts';
import { saveAdminSection } from '../../../utils/api.ts';

interface TestimonialsViewProps {
  initialTestimonials: TestimonialItem[];
  onUpdate: (updated: TestimonialItem[]) => void;
}

export const TestimonialsView: React.FC<TestimonialsViewProps> = ({
  initialTestimonials,
  onUpdate,
}) => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([...initialTestimonials]);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingItem({
      id: 'testi_' + Date.now(),
      customerName: '',
      businessName: '',
      city: '',
      content: '',
      rating: 5,
      isApproved: true,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleOpenEdit = (item: TestimonialItem) => {
    setIsNew(false);
    setEditingItem({ ...item });
  };

  const handleToggleApprove = async (id: string) => {
    const updated = testimonials.map((t) =>
      t.id === id ? { ...t, isApproved: !t.isApproved } : t
    );
    setTestimonials(updated);
    await saveAdminSection('testimonials', updated);
    onUpdate(updated);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return;
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);
    await saveAdminSection('testimonials', updated);
    onUpdate(updated);
    setMessage('Testimoni berhasil dihapus.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.customerName.trim() || !editingItem.content.trim()) {
      setError('Nama pelanggan dan ulasan wajib diisi.');
      return;
    }

    let updatedList: TestimonialItem[];
    if (isNew) {
      updatedList = [...testimonials, editingItem];
    } else {
      updatedList = testimonials.map((t) => (t.id === editingItem.id ? editingItem : t));
    }

    setSaving(true);
    setError('');
    try {
      const res = await saveAdminSection('testimonials', updatedList);
      if (res.success) {
        setTestimonials(updatedList);
        onUpdate(updatedList);
        setEditingItem(null);
        setMessage('Testimoni berhasil disimpan!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(res.message || 'Gagal menyimpan.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            <span>Kelola Testimoni Pelanggan</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Hanya testimoni nyata yang disetujui yang akan tampil pada halaman publik.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#00AED6] hover:bg-[#0092b3] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Ulasan Pelanggan</span>
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

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Belum Ada Testimoni</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Website tidak menggunakan testimoni buatan atau demo. Anda dapat menambahkan ulasan riil dari pembeli Anda di sini.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-[#00AED6] hover:bg-[#0092b3] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Testimoni Nyata</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition ${
                item.isApproved ? 'border-slate-200' : 'border-amber-300 bg-amber-50/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      item.isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.isApproved ? 'Tampil di Publik' : 'Disembunyikan'}
                  </span>
                </div>

                <p className="text-slate-700 text-xs italic leading-relaxed mb-4">
                  "{item.content}"
                </p>

                <div className="border-t border-slate-100 pt-3">
                  <h4 className="font-bold text-slate-900 text-xs">{item.customerName}</h4>
                  <p className="text-[11px] text-slate-500">
                    {item.businessName} {item.city ? `(${item.city})` : ''}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={() => handleToggleApprove(item.id)}
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    item.isApproved
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {item.isApproved ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Setujui & Tampilkan</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-slate-900 text-base">
                {isNew ? 'Tambah Testimoni Baru' : 'Edit Testimoni'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pelanggan *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.customerName}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, customerName: e.target.value })
                  }
                  placeholder="Contoh: Ibu Rina"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Usaha / Toko
                  </label>
                  <input
                    type="text"
                    value={editingItem.businessName}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, businessName: e.target.value })
                    }
                    placeholder="Contoh: RM Padang Berkah"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kota Pelanggan
                  </label>
                  <input
                    type="text"
                    value={editingItem.city}
                    onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                    placeholder="Contoh: Bandung"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rating Bintang
                </label>
                <select
                  value={editingItem.rating}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, rating: parseInt(e.target.value, 10) || 5 })
                  }
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none bg-white"
                >
                  <option value={5}>★★★★★ (5 Bintang - Sangat Puas)</option>
                  <option value={4}>★★★★☆ (4 Bintang - Puas)</option>
                  <option value={3}>★★★☆☆ (3 Bintang - Cukup)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Testimoni / Ulasan *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Tuliskan pengalaman pelanggan setelah menggunakan perangkat GoPay Spiker..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="approveToggle"
                  checked={editingItem.isApproved}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, isApproved: e.target.checked })
                  }
                  className="w-4 h-4 text-[#00AED6] rounded border-slate-300"
                />
                <label htmlFor="approveToggle" className="text-xs font-semibold text-slate-700">
                  Setujui dan tampilkan langsung di halaman depan website
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#00AED6] hover:bg-[#0092b3] text-white text-xs font-bold shadow transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Testimoni'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
