import React from 'react';
import { MessageCircle } from 'lucide-react';
import { WhatsAppSettings, StoreIdentity } from '../../types.ts';
import { formatWhatsAppUrl } from '../../utils/pureLogic.ts';

interface FloatingWhatsAppProps {
  settings: WhatsAppSettings;
  identity: StoreIdentity;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings, identity }) => {
  // RULE: Only display if enabled and phone number is filled in database
  if (!settings.floatingButtonEnabled || !settings.whatsappNumber || !settings.whatsappNumber.trim()) {
    return null;
  }

  const handleClick = () => {
    const url = formatWhatsAppUrl(
      settings.whatsappNumber,
      settings.floatingMessage || 'Halo, saya ingin menanyakan tentang produk GoPay Spiker.',
      {
        toko: identity.storeName || 'Toko',
        produk: 'GoPay Spiker',
        harga: '',
      }
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Label Tooltip */}
      <span className="hidden sm:inline-block mr-3 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-lg shadow-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {settings.floatingButtonText || 'Hubungi Penjual'}
      </span>

      {/* Button */}
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none"
        aria-label="Chat WhatsApp Penjual"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white" />
        <MessageCircle className="w-7 h-7 fill-white text-transparent" />
      </button>
    </div>
  );
};
