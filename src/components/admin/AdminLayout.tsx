import React, { useState } from 'react';
import {
  LayoutDashboard,
  Store,
  Palette,
  Package,
  Layers,
  Star,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Globe,
  Settings,
  BookMarked,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { AppState } from '../../types.ts';
import { logoutAdmin } from '../../utils/api.ts';

// Views
import { DashboardView } from './views/DashboardView.tsx';
import { IdentityView } from './views/IdentityView.tsx';
import { AppearanceView } from './views/AppearanceView.tsx';
import { ProductsView } from './views/ProductsView.tsx';
import { ContentView } from './views/ContentView.tsx';
import { TestimonialsView } from './views/TestimonialsView.tsx';
import { FaqView } from './views/FaqView.tsx';
import { ArticlesView } from './views/ArticlesView.tsx';
import { WhatsAppView } from './views/WhatsAppView.tsx';
import { SeoView } from './views/SeoView.tsx';
import { SettingsView } from './views/SettingsView.tsx';
import { PublicationGuideView } from './views/PublicationGuideView.tsx';

interface AdminLayoutProps {
  state: AppState;
  onStateChange: (updated: AppState) => void;
  onViewPublic: () => void;
  onLogout: () => void;
  onReloadAll: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  state,
  onStateChange,
  onViewPublic,
  onLogout,
  onReloadAll,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'identity', label: '2. Identitas Website', icon: Store },
    { id: 'appearance', label: '3. Pengaturan Tampilan', icon: Palette },
    { id: 'products', label: '4. Kelola Produk', icon: Package, badge: state.products.length },
    { id: 'content', label: '5. Kelola Konten', icon: Layers },
    { id: 'testimonials', label: '6. Testimoni', icon: Star, badge: state.testimonials.length },
    { id: 'faq', label: '7. FAQ', icon: HelpCircle, badge: state.faqs.length },
    { id: 'articles', label: '8. Artikel SEO', icon: BookOpen, badge: state.articles.length },
    { id: 'whatsapp', label: '9. Pengaturan WhatsApp', icon: MessageCircle },
    { id: 'seo', label: '10. Pengaturan SEO', icon: Globe },
    { id: 'settings', label: '11. Pengaturan Website', icon: Settings },
    { id: 'guide', label: '12. Panduan Publikasi', icon: BookMarked },
  ];

  const handleLogoutClick = async () => {
    if (confirm('Apakah Anda ingin keluar dari panel admin?')) {
      await logoutAdmin();
      onLogout();
    }
  };

  const currentBrand = state.identity.storeName.trim() || 'Sales GoPay Spiker';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00AED6] flex items-center justify-center text-white font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-base leading-tight">Panel Admin</h1>
                <p className="text-[11px] text-slate-400 truncate max-w-[160px] sm:max-w-xs">
                  {currentBrand}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Website</span>
            </button>

            <button
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 text-xs font-semibold transition cursor-pointer"
              title="Keluar dari Panel Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 overflow-y-auto p-4 justify-between">
          <nav className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Menu Pengelolaan
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#00AED6] text-white shadow-sm shadow-cyan-500/25'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-100 space-y-1">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>13. Keluar (Logout)</span>
            </button>
            <div className="text-[10px] text-slate-400 text-center pt-2">
              Sales GoPay Spiker v1.0
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-full bg-white h-full shadow-2xl p-4 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-slate-900 text-sm">Menu Pengelola</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1 pt-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? 'bg-[#00AED6] text-white shadow'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content View Panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              state={state}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onViewPublic={onViewPublic}
            />
          )}

          {activeTab === 'identity' && (
            <IdentityView
              initialIdentity={state.identity}
              onUpdate={(updated) => onStateChange({ ...state, identity: updated })}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceView
              initialAppearance={state.appearance}
              onUpdate={(updated) => onStateChange({ ...state, appearance: updated })}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView
              initialProducts={state.products}
              onUpdate={(updated) => onStateChange({ ...state, products: updated })}
            />
          )}

          {activeTab === 'content' && (
            <ContentView
              initialFeatures={state.features}
              initialHowToOrder={state.howToOrder}
              onUpdate={(features, howToOrder) =>
                onStateChange({ ...state, features, howToOrder })
              }
            />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialsView
              initialTestimonials={state.testimonials}
              onUpdate={(updated) => onStateChange({ ...state, testimonials: updated })}
            />
          )}

          {activeTab === 'faq' && (
            <FaqView
              initialFaqs={state.faqs}
              onUpdate={(updated) => onStateChange({ ...state, faqs: updated })}
            />
          )}

          {activeTab === 'articles' && (
            <ArticlesView
              initialArticles={state.articles}
              onUpdate={(updated) => onStateChange({ ...state, articles: updated })}
            />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppView
              initialSettings={state.whatsappSettings}
              identity={state.identity}
              onUpdate={(updated) => onStateChange({ ...state, whatsappSettings: updated })}
            />
          )}

          {activeTab === 'seo' && (
            <SeoView
              initialSeo={state.seoSettings}
              identity={state.identity}
              onUpdate={(updated) => onStateChange({ ...state, seoSettings: updated })}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              initialSettings={state.siteSettings}
              adminEmail={state.adminUser?.email || state.siteSettings.adminEmail}
              onUpdateSettings={(updated) => onStateChange({ ...state, siteSettings: updated })}
              onReloadAll={onReloadAll}
            />
          )}

          {activeTab === 'guide' && <PublicationGuideView />}
        </main>
      </div>
    </div>
  );
};
