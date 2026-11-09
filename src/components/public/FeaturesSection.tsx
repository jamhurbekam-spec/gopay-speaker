import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';
import { FeatureItem } from '../../types.ts';

interface FeaturesSectionProps {
  features: FeatureItem[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  // RULE: Hide section if user hasn't entered verified features yet
  if (!features || features.length === 0) {
    return null;
  }

  const sorted = [...features].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <section id="keunggulan" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-[#0089a8] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kelebihan Perangkat</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
            Keunggulan GoPay Spiker
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Fitur dan manfaat terverifikasi untuk mendukung efisiensi kasir dan transaksi digital toko Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-7 hover:border-cyan-300 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-[#00AED6] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
