import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FaqItem } from '../../types.ts';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  // RULE: Hide if empty
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const sorted = [...faqs].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-[#0089a8] text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pusat Informasi</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Jawaban lengkap seputar fungsi, pengoperasian, dan pemesanan GoPay Spiker.
          </p>
        </div>

        <div className="space-y-4">
          {sorted.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-base hover:text-[#00AED6] transition cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#00AED6]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
