import React, { useState } from 'react';
import { Volume2, MessageCircle, Menu, X, Lock } from 'lucide-react';
import { AppState } from '../../types.ts';
import { formatWhatsAppUrl } from '../../utils/pureLogic.ts';

interface HeaderProps {
  state: AppState;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity, whatsappSettings, products, features, howToOrder, testimonials, faqs, articles } = state;

  const brandName = identity.storeName.trim() || 'Sales GoPay Spiker';
  const hasWhatsApp = Boolean(whatsappSettings.whatsappNumber && whatsappSettings.whatsappNumber.trim());

  const navLinks = [
    { label: 'Beranda', href: '#beranda', show: true },
    { label: 'Produk', href: '#produk', show: products.length > 0 },
    { label: 'Keunggulan', href: '#keunggulan', show: features.length > 0 },
    { label: 'Cara Pesan', href: '#cara-pesan', show: howToOrder.length > 0 },
    { label: 'Testimoni', href: '#testimoni', show: testimonials.length > 0 },
    { label: 'FAQ', href: '#faq', show: faqs.length > 0 },
    { label: 'Artikel', href: '#artikel', show: articles.length > 0 },
    {
      label: 'Kontak',
      href: '#kontak',
      show: Boolean(identity.phone || identity.whatsapp || identity.email || identity.address),
    },
  ].filter((item) => item.show);

  const handleWhatsAppClick = () => {
    if (!hasWhatsApp) return;
    const url = formatWhatsAppUrl(
      whatsappSettings.whatsappNumber,
      whatsappSettings.floatingMessage || 'Halo, saya ingin menanyakan produk GoPay Spiker.',
      { toko: brandName, produk: 'GoPay Spiker', harga: '' }
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top micro bar for store hours & admin link */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="truncate">
            {identity.operatingHours ? (
              <span>Jam Operasional: {identity.operatingHours}</span>
            ) : (
              <span>Website Resmi Mitra Pemasaran GoPay Spiker</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-medium"
              title="Akses Halaman Pengelolaan Admin"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kelola Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <a href="#beranda" className="flex items-center gap-3 group">
          {identity.logoUrl ? (
            <img
              src={identity.logoUrl}
              alt={brandName}
              className="h-10 w-auto max-w-[160px] object-contain rounded"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00AED6] to-cyan-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Volume2 className="w-6 h-6" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-lg leading-tight group-hover:text-[#00AED6] transition-colors">
              {brandName}
            </span>
            <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
              Sales & Distributor Spiker QRIS
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-slate-700">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#00AED6] transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Button */}
        <div className="hidden sm:flex items-center space-x-3">
          {hasWhatsApp && (
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Hubungi WhatsApp</span>
            </button>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Buka Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-150">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-50 hover:text-[#00AED6] transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {hasWhatsApp && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleWhatsAppClick();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-lg font-semibold text-sm shadow cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Hubungi Penjual via WhatsApp</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-lg font-medium text-sm transition cursor-pointer"
            >
              <Lock className="w-4 h-4 text-slate-600" />
              <span>Halaman Admin Penjual</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
