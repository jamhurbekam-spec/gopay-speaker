import React from 'react';
import { Volume2, ShieldCheck, ArrowRight, PhoneCall } from 'lucide-react';
import { AppState } from '../../types.ts';
import { formatWhatsAppUrl } from '../../utils/pureLogic.ts';

interface HeroSectionProps {
  state: AppState;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ state }) => {
  const { identity, appearance, whatsappSettings } = state;

  const hasWhatsApp = Boolean(whatsappSettings.whatsappNumber && whatsappSettings.whatsappNumber.trim());

  // Use user-defined title/subtitle if provided, otherwise clean neutral fallback without fake promo claims
  const title = appearance.heroTitle.trim() || 'Sales GoPay Spiker';
  const subtitle =
    appearance.heroSubtitle.trim() ||
    'Layanan pemesanan dan penyediaan speaker notifikasi pembayaran QRIS untuk kelancaran transaksi usaha Anda.';

  const handleOrderClick = () => {
    if (hasWhatsApp) {
      const url = formatWhatsAppUrl(
        whatsappSettings.whatsappNumber,
        whatsappSettings.orderMessageTemplate || 'Halo, saya ingin memesan GoPay Spiker.',
        { toko: identity.storeName || 'Toko', produk: 'GoPay Spiker', harga: '' }
      );
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const el = document.getElementById('produk');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    const el = document.getElementById('kontak');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (hasWhatsApp) {
      handleOrderClick();
    }
  };

  return (
    <section id="beranda" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 lg:py-24 border-b border-slate-200">
      {/* Background soft glow elements */}
      <div className="absolute top-0 right-1/4 -translate-y-12 w-96 h-96 bg-cyan-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-[#00AED6]" />
              <span>{identity.storeName.trim() ? `${identity.storeName} • Sales Resmi GoPay Speaker` : 'Sales Resmi GoPay Speaker'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {hasWhatsApp ? (
                <button
                  onClick={handleOrderClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#00AED6] hover:bg-[#0092b3] text-white px-7 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Pesan Sekarang via WhatsApp</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <a
                  href="#produk"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#00AED6] hover:bg-[#0092b3] text-white px-7 py-3.5 rounded-xl font-bold text-base shadow transition cursor-pointer"
                >
                  <span>Lihat Katalog Produk</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              )}

              <button
                onClick={handleContactClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-xl font-semibold text-base transition cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-slate-600" />
                <span>Hubungi Kami</span>
              </button>
            </div>

            {/* Verification & Trust badges based only on real info */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Pemesanan Langsung ke WhatsApp Penjual
              </span>
              {identity.city && (
                <span className="flex items-center gap-1.5">
                  Melayani pengiriman dari {identity.city}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Visual illustration or user-uploaded banner */}
          <div className="lg:col-span-5 flex justify-center">
            {appearance.heroBannerUrl ? (
              <div className="w-full max-w-md rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
                <img
                  src={appearance.heroBannerUrl}
                  alt={title}
                  className="w-full h-auto object-cover max-h-[420px]"
                />
              </div>
            ) : (
              <div className="w-full max-w-md aspect-square bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-700/60">
                {/* Decorative circuit pattern circles */}
                <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full border border-cyan-500/20" />
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-cyan-500/30" />

                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-cyan-300">
                      Smart Audio Box
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">4G / Wi-Fi Standby</div>
                </div>

                <div className="my-auto py-8 text-center z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-4 shadow-inner">
                    <Volume2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white mb-1">
                    GoPay Spiker
                  </h2>
                  <p className="text-xs text-slate-300 max-w-[240px]">
                    Notifikasi suara transaksi pembayaran QRIS otomatis dan seketika
                  </p>
                </div>

                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-3 border border-slate-700 z-10 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Konfirmasi Suara Bersuara Nyaring</span>
                  <span className="text-cyan-400 font-semibold">Anti Penipuan</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
