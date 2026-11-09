import React from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { HowToOrderItem } from '../../types.ts';

interface HowToOrderSectionProps {
  steps: HowToOrderItem[];
}

export const HowToOrderSection: React.FC<HowToOrderSectionProps> = ({ steps }) => {
  // RULE: Hide if empty
  if (!steps || steps.length === 0) {
    return null;
  }

  const sorted = [...steps].sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0));

  return (
    <section id="cara-pesan" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-[#0089a8] text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Alur Transaksi</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
            Cara Pemesanan
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Langkah mudah memesan dan mengaktifkan perangkat GoPay Spiker untuk usaha Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((step, idx) => (
            <div
              key={step.id || idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between shadow-sm hover:shadow transition"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#00AED6] text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm shadow-cyan-500/20">
                  {step.stepNumber || idx + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < sorted.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
