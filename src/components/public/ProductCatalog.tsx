import React from 'react';
import { Package, MessageCircle, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { AppState, ProductItem } from '../../types.ts';
import { formatRupiah, formatWhatsAppUrl } from '../../utils/pureLogic.ts';

interface ProductCatalogProps {
  state: AppState;
  onOpenAdmin?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ state, onOpenAdmin }) => {
  const { products, whatsappSettings, identity } = state;
  const hasWhatsApp = Boolean(whatsappSettings.whatsappNumber && whatsappSettings.whatsappNumber.trim());

  // Sort products based on sortOrder
  const sortedProducts = [...products].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const handleOrderProduct = (product: ProductItem) => {
    if (!hasWhatsApp) return;

    const formattedPrice = formatRupiah(product.price);
    const store = identity.storeName.trim() || 'Toko Kami';

    const url = formatWhatsAppUrl(
      whatsappSettings.whatsappNumber,
      whatsappSettings.orderMessageTemplate ||
        'Halo, saya ingin memesan produk *{produk}* seharga *{harga}* di {toko}. Mohon informasi stok dan cara pengirimannya.',
      {
        produk: product.name,
        harga: formattedPrice,
        toko: store,
      }
    );

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="produk" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/70 text-[#0089a8] text-xs font-semibold uppercase tracking-wider mb-3">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Katalog Resmi</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
            Produk GoPay Spiker
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Pilihan perangkat pengeras notifikasi pembayaran QRIS untuk toko, kasir, dan outlet usaha Anda.
          </p>
        </div>

        {/* If Products is Empty - Dignified, clean empty state (NO DUMMY DATA) */}
        {sortedProducts.length === 0 ? (
          <div className="max-w-lg mx-auto bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Katalog Produk Belum Ditambahkan
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Daftar produk dan harga resmi saat ini belum diunggah oleh pengelola toko. Seluruh katalog akan segera diperbarui secara berkala.
            </p>
            {hasWhatsApp && (
              <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl text-xs text-cyan-900 mb-5">
                Ingin menanyakan ketersediaan perangkat GoPay Spiker lebih awal? Hubungi kami langsung via WhatsApp.
              </div>
            )}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#00AED6] hover:text-[#008ba8] bg-cyan-50 hover:bg-cyan-100 px-4 py-2 rounded-lg transition cursor-pointer"
              >
                <span>Kelola Produk di Menu Admin &rarr;</span>
              </button>
            )}
          </div>
        ) : (
          /* Products Grid with real database data */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((prod) => {
              const isAvailable = prod.status === 'Tersedia';
              const isPreOrder = prod.status === 'Pre-Order';
              const showWhatsAppButton = hasWhatsApp && whatsappSettings.productButtonEnabled !== false;

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative aspect-4/3 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                          <Package className="w-16 h-16 mb-2 text-slate-300" />
                          <span className="text-xs font-medium">Foto Produk</span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            isAvailable
                              ? 'bg-emerald-500 text-white'
                              : isPreOrder
                              ? 'bg-amber-500 text-white'
                              : 'bg-rose-500 text-white'
                          }`}
                        >
                          {isAvailable ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5" />
                          )}
                          <span>{prod.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#00AED6] transition-colors mb-2">
                        {prod.name}
                      </h3>

                      {/* Price Tag */}
                      <div className="mb-4">
                        <span className="text-2xl font-black text-slate-900 tracking-tight text-[#00AED6]">
                          {formatRupiah(prod.price)}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">/ unit</span>
                      </div>

                      {/* Description */}
                      {prod.shortDescription && (
                        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                          {prod.shortDescription}
                        </p>
                      )}

                      {/* Specifications */}
                      {prod.specifications && prod.specifications.length > 0 && (
                        <div className="space-y-2 pt-4 border-t border-slate-100 mb-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Spesifikasi Perangkat
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            {prod.specifications.map((spec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00AED6] mt-1.5 flex-shrink-0" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Button (Only shown if WhatsApp configured) */}
                  <div className="p-6 pt-0">
                    {showWhatsAppButton ? (
                      <button
                        onClick={() => handleOrderProduct(prod)}
                        disabled={prod.status === 'Stok Habis'}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition shadow-sm ${
                          prod.status === 'Stok Habis'
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-[#25D366] hover:bg-[#20bd5a] text-white hover:shadow-md cursor-pointer'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>
                          {prod.status === 'Stok Habis'
                            ? 'Stok Sedang Habis'
                            : 'Pesan Sekarang via WhatsApp'}
                        </span>
                      </button>
                    ) : (
                      <div className="text-xs text-slate-400 text-center py-2 bg-slate-50 rounded-lg">
                        Silakan hubungi kontak toko untuk pemesanan
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
