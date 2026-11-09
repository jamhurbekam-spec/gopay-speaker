import React, { useState } from 'react';
import { Volume2, ShieldCheck, Heart } from 'lucide-react';
import { AppState } from '../../types.ts';
import { PrivacyAndTermsModal } from './PrivacyAndTermsModal.tsx';

interface FooterProps {
  state: AppState;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ state, onOpenAdmin }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);
  const { identity, products, features, faqs } = state;

  const brandName = identity.storeName.trim() || 'Sales GoPay Spiker';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {identity.logoUrl ? (
                <img
                  src={identity.logoUrl}
                  alt={brandName}
                  className="h-10 w-auto max-w-[160px] object-contain rounded bg-white/10 p-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00AED6] to-cyan-400 flex items-center justify-center text-white shadow-md">
                  <Volume2 className="w-6 h-6" />
                </div>
              )}
              <span className="font-bold text-white text-lg tracking-tight">
                {brandName}
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Pusat pemasaran dan penyediaan perangkat speaker notifikasi pembayaran QRIS GoPay Spiker untuk toko, kasir restoran, dan gerai UMKM.
            </p>

            {identity.city && (
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Pengiriman dan layanan mencakup area {identity.city} & sekitarnya</span>
              </div>
            )}
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#beranda" className="hover:text-cyan-400 transition">
                  Beranda
                </a>
              </li>
              {products.length > 0 && (
                <li>
                  <a href="#produk" className="hover:text-cyan-400 transition">
                    Katalog Produk
                  </a>
                </li>
              )}
              {features.length > 0 && (
                <li>
                  <a href="#keunggulan" className="hover:text-cyan-400 transition">
                    Keunggulan
                  </a>
                </li>
              )}
              {faqs.length > 0 && (
                <li>
                  <a href="#faq" className="hover:text-cyan-400 transition">
                    Tanya Jawab (FAQ)
                  </a>
                </li>
              )}
              <li>
                <a href="#kontak" className="hover:text-cyan-400 transition">
                  Kontak & Lokasi
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Admin Access */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              Bantuan & Regulasi
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-slate-400">
              <button
                onClick={() => setModalType('privacy')}
                className="text-left hover:text-cyan-400 transition cursor-pointer"
              >
                Kebijakan Privasi
              </button>
              <button
                onClick={() => setModalType('terms')}
                className="text-left hover:text-cyan-400 transition cursor-pointer"
              >
                Syarat & Ketentuan Pemesanan
              </button>
              <button
                onClick={onOpenAdmin}
                className="text-left text-cyan-400 hover:text-cyan-300 font-medium transition cursor-pointer pt-2"
              >
                Masuk ke Panel Pengelolaan Admin &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer - REQUIRED by user prompt */}
        <div className="pt-8 pb-4 text-xs text-slate-500 leading-relaxed border-b border-slate-800/80">
          <p className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Pernyataan Kemitraan Independen:</strong> Website ini dikelola secara independen oleh penjual / mitra pemasaran produk GoPay Spiker dan bukan merupakan website resmi dari GoPay Indonesia atau PT GoTo Gojek Tokopedia Tbk. Hak cipta merk dagang GoPay dan Gojek merupakan milik pemegang hak masing-masing.
            </span>
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; {year} {brandName}. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Sistem Sales GoPay Spiker Siap Publikasi</span>
          </div>
        </div>
      </div>

      <PrivacyAndTermsModal
        type={modalType}
        storeName={brandName}
        onClose={() => setModalType(null)}
      />
    </footer>
  );
};
