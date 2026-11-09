import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, Check, AlertCircle, Edit2, X } from 'lucide-react';
import { FaqItem } from '../../../types.ts';
import { saveAdminSection } from '../../../utils/api.ts';

interface FaqViewProps {
  initialFaqs: FaqItem[];
  onUpdate: (updated: FaqItem[]) => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ initialFaqs, onUpdate }) => {
  const [faqs, setFaqs] = useState<FaqItem[]>([...initialFaqs]);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingFaq({
      id: 'faq_' + Date.now(),
      question: '',
      answer: '',
      sortOrder: faqs.length + 1,
    });
  };

  const handleOpenEdit = (faq: FaqItem) => {
    setIsNew(false);
    setEditingFaq({ ...faq });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pertanyaan FAQ ini?')) return;
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    await saveAdminSection('faqs', updated);
    onUpdate(updated);
    setMessage('FAQ berhasil dihapus.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) {
      setError('Pertanyaan dan jawaban wajib diisi.');
      return;
    }

    let updatedList: FaqItem[];
    if (isNew) {
      updatedList = [...faqs, editingFaq];
    } else {
      updatedList = faqs.map((f) => (f.id === editingFaq.id ? editingFaq : f));
    }

    setSaving(true);
    setError('');
    try {
      const res = await saveAdminSection('faqs', updatedList);
      if (res.success) {
        setFaqs(updatedList);
        onUpdate(updatedList);
        setEditingFaq(null);
        setMessage('FAQ berhasil disimpan!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(res.message || 'Gagal menyimpan FAQ.');
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
            <HelpCircle className="w-6 h-6 text-[#00AED6]" />
            <span>Kelola Tanya Jawab (FAQ)</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Buat dan atur pertanyaan yang sering diajukan pembeli mengenai GoPay Spiker.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#00AED6] hover:bg-[#0092b3] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pertanyaan FAQ</span>
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

      {faqs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Daftar FAQ Masih Kosong</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Belum ada daftar tanya jawab. Bagian FAQ akan disembunyikan otomatis di website publik sampai Anda menambahkan data di sini.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-[#00AED6] hover:bg-[#0092b3] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah FAQ Pertama</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#00AED6] flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{faq.question}</h4>
                </div>
                <p className="text-slate-600 text-xs pl-8 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-slate-900 text-base">
                {isNew ? 'Tambah Pertanyaan FAQ' : 'Edit FAQ'}
              </h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pertanyaan *
                </label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="Contoh: Apakah GoPay Spiker memerlukan jaringan Wi-Fi?"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jawaban Lengkap *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Tuliskan jawaban yang ramah, informatif, dan jelas untuk pembeli..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#00AED6] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#00AED6] hover:bg-[#0092b3] text-white text-xs font-bold shadow transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
