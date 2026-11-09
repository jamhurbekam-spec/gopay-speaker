import React from 'react';
import { X, ShieldAlert, FileText } from 'lucide-react';

interface PrivacyAndTermsModalProps {
  type: 'privacy' | 'terms' | null;
  storeName: string;
  onClose: () => void;
}

export const PrivacyAndTermsModal: React.FC<PrivacyAndTermsModalProps> = ({
  type,
  storeName,
  onClose,
}) => {
  if (!type) return null;

  const name = storeName.trim() || 'Mitra Penjualan GoPay Spiker';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? (
              <ShieldAlert className="w-5 h-5 text-[#00AED6]" />
            ) : (
              <FileText className="w-5 h-5 text-[#00AED6]" />
            )}
            <h3 className="font-bold text-slate-900 text-base">
              {type === 'privacy' ? 'Kebijakan Privasi' : 'Syarat & Ketentuan Layanan'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-4 text-sm text-slate-600 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                Selamat datang di website resmi pemasaran <strong>{name}</strong>. Privasi calon pelanggan dan pengguna merupakan prioritas utama bagi kami.
              </p>
              <h4 className="font-bold text-slate-800 text-base mt-4">1. Pengumpulan Data</h4>
              <p>
                Website ini tidak mengumpulkan data pribadi sensitif secara otomatis. Informasi kontak atau pemesanan yang Anda kirimkan melalui tautan WhatsApp ditangani langsung oleh layanan WhatsApp terenkripsi end-to-end.
              </p>
              <h4 className="font-bold text-slate-800 text-base mt-4">2. Penggunaan Informasi</h4>
              <p>
                Informasi yang Anda berikan saat konsultasi atau pemesanan hanya digunakan untuk kepentingan verifikasi pesanan, pengiriman perangkat GoPay Spiker, dan pelayanan purna jual.
              </p>
              <h4 className="font-bold text-slate-800 text-base mt-4">3. Keamanan Data</h4>
              <p>
                Kami tidak pernah menjual, menyewakan, atau membagikan nomor WhatsApp dan informasi bisnis Anda kepada pihak ketiga mana pun tanpa persetujuan Anda.
              </p>
            </>
          ) : (
            <>
              <p>
                Syarat dan ketentuan pemesanan produk di <strong>{name}</strong>:
              </p>
              <h4 className="font-bold text-slate-800 text-base mt-4">1. Status Keagenan / Kemitraan</h4>
              <p>
                Website ini dikelola secara independen oleh pihak penjual / mitra pemasaran resmi GoPay Spiker dan bukan merupakan aplikasi internal dari PT GoTo Gojek Tokopedia Tbk. Segala kebijakan pemesanan dan pengiriman diatur secara mandiri oleh penjual.
              </p>
              <h4 className="font-bold text-slate-800 text-base mt-4">2. Ketersediaan & Spesifikasi</h4>
              <p>
                Harga, spesifikasi produk, dan ketersediaan stok dapat mengalami perubahan sesuai ketentuan distributor resmi. Pelanggan disarankan untuk mengonfirmasi ketersediaan terkini via WhatsApp sebelum melakukan transaksi pembayaran.
              </p>
              <h4 className="font-bold text-slate-800 text-base mt-4">3. Garansi & Purna Jual</h4>
              <p>
                Perangkat GoPay Spiker yang dijual bergaransi resmi sesuai dengan syarat dan ketentuan dari produsen/distributor resmi. Layanan aktivasi perangkat dan integrasi QRIS didampingi sampai selesai.
              </p>
            </>
          )}

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
