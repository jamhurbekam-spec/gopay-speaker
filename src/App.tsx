import React, { useEffect, useState } from 'react';
import { AppState } from './types.ts';
import {
  fetchPublicState,
  checkAdminStatus,
  fetchAdminData,
  authStorage,
} from './utils/api.ts';
import { generateJsonLdSchema } from './utils/pureLogic.ts';

// Public Components
import { Header } from './components/public/Header.tsx';
import { HeroSection } from './components/public/HeroSection.tsx';
import { ProductCatalog } from './components/public/ProductCatalog.tsx';
import { FeaturesSection } from './components/public/FeaturesSection.tsx';
import { HowToOrderSection } from './components/public/HowToOrderSection.tsx';
import { TestimonialsSection } from './components/public/TestimonialsSection.tsx';
import { FaqSection } from './components/public/FaqSection.tsx';
import { ArticlesSection } from './components/public/ArticlesSection.tsx';
import { ContactSection } from './components/public/ContactSection.tsx';
import { Footer } from './components/public/Footer.tsx';
import { FloatingWhatsApp } from './components/public/FloatingWhatsApp.tsx';

// Admin Components
import { AdminSetup } from './components/admin/AdminSetup.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';

export default function App() {
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [loading, setLoading] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [state, setState] = useState<AppState>({
    hasAdmin: false,
    identity: {
      storeName: '',
      ownerName: '',
      logoUrl: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      province: '',
      city: '',
      postalCode: '',
      operatingHours: '',
      facebookUrl: '',
      instagramUrl: '',
      tiktokUrl: '',
    },
    appearance: {
      primaryColor: '#00AED6',
      accentColor: '#00880C',
      heroBannerUrl: '',
      heroTitle: '',
      heroSubtitle: '',
    },
    products: [],
    features: [],
    howToOrder: [],
    testimonials: [],
    faqs: [],
    articles: [],
    whatsappSettings: {
      whatsappNumber: '',
      orderMessageTemplate:
        'Halo, saya tertarik memesan produk *{produk}* dengan harga *{harga}* di {toko}. Mohon informasi ketersediaan dan cara pemesanannya.',
      floatingButtonEnabled: false,
      floatingButtonText: 'Hubungi Penjual',
      floatingMessage: 'Halo, saya ingin bertanya tentang produk GoPay Spiker.',
      productButtonEnabled: true,
    },
    seoSettings: {
      seoTitle: '',
      metaDescription: '',
      metaKeywords: '',
      googleSearchConsoleVerification: '',
      googleAnalyticsId: '',
      canonicalDomain: '',
      localSeoCity: '',
      localSeoProvince: '',
    },
    siteSettings: {
      siteName: 'Sales GoPay Spiker',
      siteDomain: '',
      adminEmail: '',
      timezone: 'Asia/Jakarta',
      siteStatus: 'active',
    },
  });

  // Load app state
  const loadState = async () => {
    setLoading(true);
    try {
      const adminCheck = await checkAdminStatus();
      setHasAdmin(adminCheck.hasAdmin);

      const token = authStorage.getToken();
      if (token && adminCheck.hasAdmin) {
        const adminDataRes = await fetchAdminData();
        if (adminDataRes.success && adminDataRes.data) {
          setIsLoggedIn(true);
          setState(adminDataRes.data);
          setLoading(false);
          return;
        } else {
          authStorage.removeToken();
          setIsLoggedIn(false);
        }
      }

      const publicRes = await fetchPublicState();
      if (publicRes.success && publicRes.data) {
        setState(publicRes.data);
        setHasAdmin(publicRes.data.hasAdmin);
      }
    } catch (err) {
      console.error('Failed to load application state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check url hash for #admin or ?admin=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || window.location.hash === '#admin') {
      setViewMode('admin');
    }

    loadState();
  }, []);

  // Sync SEO & head tags
  useEffect(() => {
    const title =
      state.seoSettings.seoTitle ||
      (state.identity.storeName
        ? `${state.identity.storeName} - Sales GoPay Spiker`
        : 'Sales GoPay Spiker – Speaker Pembayaran Notifikasi QRIS');
    document.title = title;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        state.seoSettings.metaDescription ||
          'Website pemasaran dan penjualan produk GoPay Spiker dengan panel admin mandiri, katalog produk, SEO teroptimasi, dan pemesanan WhatsApp.'
      );
    }

    // Google Search Console verification meta tag injection
    if (state.seoSettings.googleSearchConsoleVerification) {
      let gscMeta = document.querySelector('meta[name="google-site-verification"]');
      if (!gscMeta) {
        gscMeta = document.createElement('meta');
        gscMeta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(gscMeta);
      }
      // Extract content if user pasted full tag
      let code = state.seoSettings.googleSearchConsoleVerification;
      const match = code.match(/content=["']([^"']+)["']/);
      if (match) code = match[1];
      gscMeta.setAttribute('content', code);
    }

    // Google Analytics 4 Script injection
    if (state.seoSettings.googleAnalyticsId && /^G-[A-Za-z0-9]+$/.test(state.seoSettings.googleAnalyticsId)) {
      const gaId = state.seoSettings.googleAnalyticsId;
      const scriptId = 'google-analytics-script';
      if (!document.getElementById(scriptId)) {
        const gaScript = document.createElement('script');
        gaScript.id = scriptId;
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);

        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(inlineScript);
      }
    }

    // Schema.org JSON-LD structured data
    const schemaObj = generateJsonLdSchema(
      state.identity,
      state.products,
      state.seoSettings.canonicalDomain || window.location.origin
    );

    const schemaId = 'schema-json-ld';
    let schemaTag = document.getElementById(schemaId);
    if (schemaObj) {
      if (!schemaTag) {
        schemaTag = document.createElement('script');
        schemaTag.id = schemaId;
        schemaTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaTag);
      }
      schemaTag.textContent = JSON.stringify(schemaObj);
    } else if (schemaTag) {
      schemaTag.remove();
    }
  }, [state]);

  const handleOpenAdmin = () => {
    setViewMode('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPublic = () => {
    setViewMode('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-[#00AED6] flex items-center justify-center animate-spin mb-4">
          <div className="w-6 h-6 border-2 border-[#00AED6] border-t-transparent rounded-full" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Memuat Sistem Sales GoPay Spiker...</p>
      </div>
    );
  }

  // Admin View Controller
  if (viewMode === 'admin') {
    if (!hasAdmin) {
      return (
        <AdminSetup
          onSetupSuccess={() => {
            setHasAdmin(true);
            setIsLoggedIn(true);
            loadState();
          }}
          onBackToPublic={handleBackToPublic}
        />
      );
    }

    if (!isLoggedIn) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            loadState();
          }}
          onBackToPublic={handleBackToPublic}
        />
      );
    }

    return (
      <AdminLayout
        state={state}
        onStateChange={(updated) => setState(updated)}
        onViewPublic={handleBackToPublic}
        onLogout={() => {
          setIsLoggedIn(false);
          loadState();
          setViewMode('public');
        }}
        onReloadAll={loadState}
      />
    );
  }

  // Public Website View
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col selection:bg-cyan-100 selection:text-cyan-900">
      {/* 1. Header */}
      <Header state={state} onOpenAdmin={handleOpenAdmin} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection state={state} />

        {/* 3. Product Catalog */}
        <ProductCatalog state={state} onOpenAdmin={handleOpenAdmin} />

        {/* 4. Keunggulan (Features) - Hides when empty */}
        <FeaturesSection features={state.features} />

        {/* 5. Cara Pemesanan - Hides when empty */}
        <HowToOrderSection steps={state.howToOrder} />

        {/* 6. Testimoni - Hides when empty */}
        <TestimonialsSection testimonials={state.testimonials} />

        {/* 7. FAQ - Hides when empty */}
        <FaqSection faqs={state.faqs} />

        {/* 8. Artikel SEO - Hides when empty */}
        <ArticlesSection articles={state.articles} />

        {/* 9. Kontak Toko */}
        <ContactSection identity={state.identity} whatsappSettings={state.whatsappSettings} />
      </main>

      {/* 10. Footer */}
      <Footer state={state} onOpenAdmin={handleOpenAdmin} />

      {/* 11. Floating WhatsApp Button (Only shown if enabled and number exists) */}
      <FloatingWhatsApp settings={state.whatsappSettings} identity={state.identity} />
    </div>
  );
}
