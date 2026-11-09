import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TestimonialItem } from '../../types.ts';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  // Hide completely if no approved testimonials exist (NO DUMMY REVIEWS)
  const approved = (testimonials || []).filter((t) => t.isApproved);
  if (approved.length === 0) {
    return null;
  }

  return (
    <section id="testimoni" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Ulasan Pelanggan</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
            Pengalaman Pengguna
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Ulasan nyata dari para pemilik usaha yang telah menggunakan perangkat GoPay Spiker.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approved.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-7 flex flex-col justify-between shadow-sm hover:shadow transition"
            >
              <div>
                <Quote className="w-8 h-8 text-cyan-400 mb-4 opacity-50" />
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.customerName}</h4>
                  <p className="text-xs text-slate-500">
                    {item.businessName} {item.city ? `• ${item.city}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
