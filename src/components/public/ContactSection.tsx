import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Share2 } from 'lucide-react';
import { StoreIdentity, WhatsAppSettings } from '../../types.ts';
import { formatWhatsAppUrl } from '../../utils/pureLogic.ts';

interface ContactSectionProps {
  identity: StoreIdentity;
  whatsappSettings: WhatsAppSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ identity, whatsappSettings }) => {
  const hasPhone = Boolean(identity.phone && identity.phone.trim());
  const hasWhatsApp = Boolean(whatsappSettings.whatsappNumber && whatsappSettings.whatsappNumber.trim());
  const hasEmail = Boolean(identity.email && identity.email.trim());
  const hasAddress = Boolean(identity.address && identity.address.trim());
  const hasHours = Boolean(identity.operatingHours && identity.operatingHours.trim());
  const hasSocials = Boolean(identity.facebookUrl || identity.instagramUrl || identity.tiktokUrl);

  const anyContactFilled = hasPhone || hasWhatsApp || hasEmail || hasAddress || hasHours || hasSocials;

  const handleWhatsAppClick = () => {
    if (!hasWhatsApp) return;
    const url = formatWhatsAppUrl(
      whatsappSettings.whatsappNumber,
      'Halo, saya ingin bertanya tentang pemesanan GoPay Spiker.',
      { toko: identity.storeName || 'Toko', produk: 'GoPay Spiker', harga: '' }
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="kontak" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-[#0089a8] text-xs font-semibold uppercase tracking-wider mb-3">
            <Phone className="w-3.5 h-3.5" />
            <span>Hubungi Kami</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
            Kontak & Lokasi Penjual
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Konsultasikan kebutuhan perangkat kasir GoPay Spiker dengan layanan pelanggan kami.
          </p>
        </div>

        {!anyContactFilled ? (
          <div className="max-w-md mx-auto bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500 text-sm">
            <MapPin className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            Informasi kontak dan alamat resmi belum diperbarui oleh pengelola toko.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* WhatsApp */}
            {hasWhatsApp && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">WhatsApp Resmi</h3>
                  <p className="text-sm text-slate-600 font-mono mb-3">{whatsappSettings.whatsappNumber}</p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:text-[#20bd5a] cursor-pointer"
                  >
                    <span>Chat WhatsApp &rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* Telepon */}
            {hasPhone && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-[#00AED6] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Nomor Telepon</h3>
                  <p className="text-sm text-slate-600 font-mono">{identity.phone}</p>
                </div>
              </div>
            )}

            {/* Email */}
            {hasEmail && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Email</h3>
                  <a
                    href={`mailto:${identity.email}`}
                    className="text-sm text-slate-600 hover:text-[#00AED6] break-all transition"
                  >
                    {identity.email}
                  </a>
                </div>
              </div>
            )}

            {/* Alamat */}
            {hasAddress && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition flex items-start gap-4 lg:col-span-2">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Alamat Kantor / Toko</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {identity.address}
                    {identity.city && `, ${identity.city}`}
                    {identity.province && `, ${identity.province}`}
                    {identity.postalCode && ` ${identity.postalCode}`}
                  </p>
                </div>
              </div>
            )}

            {/* Jam Operasional */}
            {hasHours && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Jam Operasional</h3>
                  <p className="text-sm text-slate-600">{identity.operatingHours}</p>
                </div>
              </div>
            )}

            {/* Media Sosial */}
            {hasSocials && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition flex items-start gap-4 lg:col-span-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">Media Sosial Resmi</h3>
                  <div className="flex flex-wrap gap-3">
                    {identity.facebookUrl && (
                      <a
                        href={identity.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white transition font-medium"
                      >
                        Facebook
                      </a>
                    )}
                    {identity.instagramUrl && (
                      <a
                        href={identity.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-pink-600 hover:text-white transition font-medium"
                      >
                        Instagram
                      </a>
                    )}
                    {identity.tiktokUrl && (
                      <a
                        href={identity.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white transition font-medium"
                      >
                        TikTok
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
