import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Upload, Check, AlertCircle, X } from 'lucide-react';
import { ProductItem } from '../../../types.ts';
import { formatRupiah } from '../../../utils/pureLogic.ts';
import { saveAdminSection } from '../../../utils/api.ts';

interface ProductsViewProps {
  initialProducts: ProductItem[];
  onUpdate: (updated: ProductItem[]) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ initialProducts, onUpdate }) => {
  const [products, setProducts] = useState<ProductItem[]>([...initialProducts]);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [specInput, setSpecInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingProduct({
      id: 'prod_' + Date.now(),
      name: '',
      price: 0,
      status: 'Tersedia',
      imageUrl: '',
      shortDescription: '',
      specifications: [],
      sortOrder: products.length + 1,
    });
    setSpecInput('');
  };

  const handleOpenEdit = (prod: ProductItem) => {
    setIsNew(false);
    setEditingProduct({ ...prod, specifications: [...(prod.specifications || [])] });
    setSpecInput('');
  };

  const handleAddSpec = () => {
    if (!specInput.trim() || !editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      specifications: [...editingProduct.specifications, specInput.trim()],
    });
    setSpecInput('');
  };

  const handleRemoveSpec = (idx: number) => {
    if (!editingProduct) return;
    const updated = editingProduct.specifications.filter((_, i) => i !== idx);
    setEditingProduct({ ...editingProduct, specifications: updated });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingProduct({ ...editingProduct, imageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      setError('Nama produk wajib diisi.');
      return;
    }
    if (editingProduct.price <= 0) {
      setError('Harga produk harus lebih besar dari Rp 0.');
      return;
    }

    let updatedList: ProductItem[];
    if (isNew) {
      updatedList = [...products, editingProduct];
    } else {
      updatedList = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    }

    setSaving(true);
    setError('');
    try {
      const res = await saveAdminSection('products', updatedList);
      if (res.success) {
        setProducts(updatedList);
        onUpdate(updatedList);
        setEditingProduct(null);
        setMessage('Produk berhasil disimpan ke katalog!');
        setTimeout(() => setMessage(''), 4000);
      } else {
        setError(res.message || 'Gagal menyimpan produk.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

    const updatedList = products.filter((p) => p.id !== id);
    setSaving(true);
    try {
      const res = await saveAdminSection('products', updatedList);
      if (res.success) {
        setProducts(updatedList);
        onUpdate(updatedList);
        setMessage(`Produk "${name}" berhasil dihapus.`);
        setTimeout(() => setMessage(''), 4000);
      } else {
        setError(res.message || 'Gagal menghapus produk.');
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
            <Package className="w-6 h-6 text-[#00AED6]" />
            <span>Kelola Katalog Produk GoPay Spiker</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tambah, edit, dan atur ketersediaan produk serta harga yang akan ditampilkan pada halaman publik.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#00AED6] hover:bg-[#0092b3] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
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

      {/* Products Table / Cards */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Katalog Produk Masih Kosong</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Belum ada produk yang ditambahkan. Klik tombol "Tambah Produk Baru" untuk mulai memasukkan varian GoPay Spiker pertama Anda.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-[#00AED6] hover:bg-[#0092b3] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow transition flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {prod.imageUrl ? (
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <Package className="w-12 h-12 mb-1" />
                      <span className="text-xs">Tanpa Foto</span>
                    </div>
                  )}
                  <span
                    className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      prod.status === 'Tersedia'
                        ? 'bg-emerald-500 text-white'
                        : prod.status === 'Pre-Order'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {prod.status}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base mb-1">{prod.name}</h3>
                  <div className="text-lg font-extrabold text-[#00AED6] mb-2">
                    {formatRupiah(prod.price)}
                  </div>
                  {prod.shortDescription && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {prod.shortDescription}
                    </p>
                  )}
                  {prod.specifications && prod.specifications.length > 0 && (
                    <div className="text-[11px] text-slate-500">
                      {prod.specifications.length} spesifikasi tercatat
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => handleOpenEdit(prod)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(prod.id, prod.name)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition cursor-pointer"
                  title="Hapus Produk"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-slate-900 text-base">
                {isNew ? 'Tambah Produk Baru' : 'Edit Produk'}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Contoh: GoPay Spiker 4G LTE Soundbox"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga (Rupiah) *
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Contoh: 499000"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                  />
                  <div className="text-xs text-[#00AED6] font-bold mt-1">
                    Preview: {formatRupiah(editingProduct.price || 0)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Ketersediaan
                  </label>
                  <select
                    value={editingProduct.status}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none bg-white"
                  >
                    <option value="Tersedia">Tersedia (Ready Stock)</option>
                    <option value="Pre-Order">Pre-Order</option>
                    <option value="Stok Habis">Stok Habis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    value={editingProduct.sortOrder || 1}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sortOrder: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Photo */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Foto Produk (Upload atau Masukkan URL)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {editingProduct.imageUrl ? (
                    <img
                      src={editingProduct.imageUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                  ) : null}
                  <input
                    type="text"
                    value={editingProduct.imageUrl}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                    }
                    placeholder="URL gambar (https://...)"
                    className="flex-1 w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer w-full sm:w-auto justify-center">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Singkat Produk
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                  }
                  placeholder="Perangkat speaker pintar yang otomatis mengumumkan nominal pembayaran QRIS secara langsung dengan suara nyaring dan jernih..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                />
              </div>

              {/* Specifications Builder */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Spesifikasi Teknis
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpec();
                      }
                    }}
                    placeholder="Contoh: Koneksi SIM Card 4G LTE & Wi-Fi"
                    className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Tambah Poin
                  </button>
                </div>

                {editingProduct.specifications.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {editingProduct.specifications.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700"
                      >
                        <span className="truncate">• {spec}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(i)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#00AED6] hover:bg-[#0092b3] text-white font-bold text-xs shadow transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
