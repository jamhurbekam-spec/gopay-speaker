import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  MessageCircle,
  Globe,
  Store,
  Layers,
  HelpCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { AppState } from '../../../types.ts';
import { calculateSetupProgress } from '../../../utils/pureLogic.ts';

interface DashboardViewProps {
  state: AppState;
  onNavigateTab: (tabId: string) => void;
  onViewPublic: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onNavigateTab,
  onViewPublic,
}) => {
  const { identity, whatsappSettings, products, seoSettings, siteSettings } = state;
  const progress = calculateSetupProgress(state);

  const stats = [
    {
      label: 'Produk Terdaftar',
      value: products.length,
      icon: Package,
      actionTab: 'products',
      status: products.length > 0 ? 'Siap Dijual' : 'Belum Ada Produk',
      color: products.length > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Nomor WhatsApp Pemesanan',
      value: whatsappSettings.whatsappNumber ? 'Terhubung' : 'Belum Diatur',
      icon: MessageCircle,
      actionTab: 'whatsapp',
      status: whatsappSettings.whatsappNumber || 'Wajib Diisi',
      color: whatsappSettings.whatsappNumber ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50',
    },
    {
      label: 'Identitas Toko / Penjual',
      value: identity.storeName ? identity.storeName : 'Belum Diisi',
      icon: Store,
      actionTab: 'identity',
      status: identity.city ? `Lokasi: ${identity.city}` : 'Belum ada alamat',
      color: identity.storeName ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Konfigurasi SEO Google',
      value: seoSettings.seoTitle ? 'Telah Dikonfigurasi' : 'Belum Lengkap',
      icon: Globe,
      actionTab: 'seo',
      status: seoSettings.googleSearchConsoleVerification ? 'GSC Terpasang' : 'GSC Belum Verifikasi',
      color: seoSettings.seoTitle ? 'text-cyan-600 bg-cyan-50' : 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sistem Pengelolaan Mandiri Sales GoPay Spiker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Panel Pengelola
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Kelola seluruh identitas bisnis, harga produk, foto, keunggulan, artikel, nomor WhatsApp, hingga pengaturan SEO Google website Anda di sini.
          </p>
        </div>

        <div className="z-10 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onViewPublic}
            className="inline-flex items-center justify-center gap-2 bg-[#00AED6] hover:bg-[#0092b3] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
          >
            <span>Lihat Website Publik</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Checklist Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Kesiapan Publikasi Website
            </h3>
            <p className="text-xs text-slate-500">
              {progress.completedCount} dari {progress.totalCount} langkah konfigurasi dasar telah selesai.
            </p>
          </div>
          <div className="text-2xl font-black text-[#00AED6]">{progress.percent}%</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00AED6] to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        {/* Pending tasks checklist */}
        {progress.pendingTasks.length > 0 ? (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Panduan Tugas yang Perlu Diisi:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {progress.pendingTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="truncate">{task}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Seluruh data dasar telah diisi lengkap! Website Anda siap dipromosikan.</span>
          </div>
        )}
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(s.actionTab)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500">{s.label}</span>
                <div className={`p-2.5 rounded-xl ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 group-hover:text-[#00AED6] transition-colors truncate">
                  {s.value}
                </div>
                <div className="text-xs text-slate-500 mt-1 truncate">{s.status}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#00AED6] font-semibold">
                <span>Kelola &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links Menu */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Akses Cepat Pengaturan
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Identitas Toko', tab: 'identity', icon: Store },
            { label: 'Kelola Produk', tab: 'products', icon: Package },
            { label: 'Atur WhatsApp', tab: 'whatsapp', icon: MessageCircle },
            { label: 'Kelola Konten', tab: 'content', icon: Layers },
            { label: 'Pengaturan SEO', tab: 'seo', icon: Globe },
            { label: 'Panduan Online', tab: 'guide', icon: HelpCircle },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigateTab(item.tab)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-cyan-50 border border-slate-200/80 hover:border-cyan-200 transition text-center group cursor-pointer"
              >
                <Icon className="w-6 h-6 text-slate-600 group-hover:text-[#00AED6] mb-2 transition-colors" />
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#00AED6]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
