import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Upload, Check, AlertCircle, X, ExternalLink } from 'lucide-react';
import { ArticleItem } from '../../../types.ts';
import { saveAdminSection } from '../../../utils/api.ts';

interface ArticlesViewProps {
  initialArticles: ArticleItem[];
  onUpdate: (updated: ArticleItem[]) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({ initialArticles, onUpdate }) => {
  const [articles, setArticles] = useState<ArticleItem[]>([...initialArticles]);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingArticle({
      id: 'art_' + Date.now(),
      title: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      content: '',
      imageUrl: '',
      author: '',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleOpenEdit = (art: ArticleItem) => {
    setIsNew(false);
    setEditingArticle({ ...art });
  };

  const handleTitleChange = (val: string) => {
    if (!editingArticle) return;
    const updated = { ...editingArticle, title: val };
    // Auto populate slug and metaTitle if user hasn't customized them yet
    if (isNew || !editingArticle.slug) {
      updated.slug = generateSlug(val);
    }
    if (isNew || !editingArticle.metaTitle) {
      updated.metaTitle = val ? `${val} | Sales GoPay Spiker` : '';
    }
    setEditingArticle(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingArticle) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto thumbnail maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingArticle({ ...editingArticle, imageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    await saveAdminSection('articles', updated);
    onUpdate(updated);
    setMessage('Artikel berhasil dihapus.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    if (!editingArticle.title.trim() || !editingArticle.content.trim()) {
      setError('Judul dan isi artikel wajib diisi.');
      return;
    }

    const finalSlug = editingArticle.slug.trim() || generateSlug(editingArticle.title);
    const finalized = {
      ...editingArticle,
      slug: finalSlug,
      updatedAt: new Date().toISOString(),
    };

    let updatedList: ArticleItem[];
    if (isNew) {
      updatedList = [finalized, ...articles];
    } else {
      updatedList = articles.map((a) => (a.id === finalized.id ? finalized : a));
    }

    setSaving(true);
    setError('');
    try {
      const res = await saveAdminSection('articles', updatedList);
      if (res.success) {
        setArticles(updatedList);
        onUpdate(updatedList);
        setEditingArticle(null);
        setMessage('Artikel SEO berhasil disimpan!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(res.message || 'Gagal menyimpan artikel.');
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
            <BookOpen className="w-6 h-6 text-[#00AED6]" />
            <span>Kelola Artikel & Edukasi SEO</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tulis artikel dan panduan seputar GoPay Spiker untuk mendongkrak peringkat di Google Search.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#00AED6] hover:bg-[#0092b3] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
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

      {articles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Belum Ada Artikel SEO</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Menulis artikel bertopik "Cara Pakai GoPay Spiker", "Harga & Fitur", atau "Tips Menghindari Penipuan QRIS" dapat membantu website Anda muncul di halaman pertama pencarian Google.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-[#00AED6] hover:bg-[#0092b3] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow transition flex flex-col justify-between"
            >
              <div>
                {art.imageUrl ? (
                  <div className="aspect-16/9 bg-slate-100 overflow-hidden">
                    <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-16/9 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium">
                    Tanpa Gambar
                  </div>
                )}

                <div className="p-5">
                  <div className="text-[11px] text-slate-400 mb-1 font-mono">
                    /artikel/{art.slug}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {art.metaDescription || art.content.slice(0, 100)}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => handleOpenEdit(art)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(art.id, art.title)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-slate-900 text-base">
                {isNew ? 'Tulis Artikel SEO Baru' : 'Edit Artikel'}
              </h3>
              <button
                onClick={() => setEditingArticle(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Manfaat GoPay Spiker untuk Mencegah Modus Bukti Transfer Palsu"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Slug URL SEO (Otomatis)
                  </label>
                  <input
                    type="text"
                    value={editingArticle.slug}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, slug: generateSlug(e.target.value) })
                    }
                    placeholder="manfaat-gopay-spiker-umkm"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Penulis (Opsional)
                  </label>
                  <input
                    type="text"
                    value={editingArticle.author || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, author: e.target.value })
                    }
                    placeholder="Tim Redaksi / Admin Toko"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Thumbnail Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gambar Thumbnail
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {editingArticle.imageUrl ? (
                    <img
                      src={editingArticle.imageUrl}
                      alt="Thumbnail"
                      className="w-16 h-12 rounded-lg object-cover border border-slate-200"
                    />
                  ) : null}
                  <input
                    type="text"
                    value={editingArticle.imageUrl || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, imageUrl: e.target.value })
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

              {/* SEO Meta Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pengaturan SEO Google untuk Artikel Ini
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Meta Title SEO
                  </label>
                  <input
                    type="text"
                    value={editingArticle.metaTitle}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, metaTitle: e.target.value })
                    }
                    placeholder="Judul untuk halaman hasil pencarian Google"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Meta Description SEO (120 - 160 Karakter)
                  </label>
                  <textarea
                    rows={2}
                    value={editingArticle.metaDescription}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, metaDescription: e.target.value })
                    }
                    placeholder="Ringkasan artikel yang menarik pembaca ketika tampil di Google..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Lengkap Artikel *
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingArticle.content}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, content: e.target.value })
                  }
                  placeholder="Tuliskan isi artikel secara terperinci, gunakan paragraf yang rapi dan mudah dibaca..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#00AED6] hover:bg-[#0092b3] text-white text-xs font-bold shadow transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
