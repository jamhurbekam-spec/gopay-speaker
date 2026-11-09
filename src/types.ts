export interface StoreIdentity {
  storeName: string;
  ownerName: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  operatingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
}

export interface AppearanceSettings {
  primaryColor: string;
  accentColor: string;
  heroBannerUrl: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  status: 'Tersedia' | 'Pre-Order' | 'Stok Habis';
  imageUrl: string;
  shortDescription: string;
  specifications: string[];
  sortOrder: number;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  sortOrder: number;
}

export interface HowToOrderItem {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  customerName: string;
  businessName: string;
  city: string;
  content: string;
  rating: number; // 1 - 5
  avatarUrl?: string;
  isApproved: boolean;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  imageUrl?: string;
  author?: string;
  publishedAt: string;
  updatedAt: string;
}

export interface WhatsAppSettings {
  whatsappNumber: string;
  orderMessageTemplate: string;
  floatingButtonEnabled: boolean;
  floatingButtonText: string;
  floatingMessage: string;
  productButtonEnabled: boolean;
}

export interface SeoSettings {
  seoTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleSearchConsoleVerification: string;
  googleAnalyticsId: string;
  canonicalDomain: string;
  localSeoCity: string;
  localSeoProvince: string;
}

export interface SiteSettings {
  siteName: string;
  siteDomain: string;
  adminEmail: string;
  timezone: string;
  siteStatus: 'active' | 'maintenance';
}

export interface AppState {
  hasAdmin: boolean;
  identity: StoreIdentity;
  appearance: AppearanceSettings;
  products: ProductItem[];
  features: FeatureItem[];
  howToOrder: HowToOrderItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  articles: ArticleItem[];
  whatsappSettings: WhatsAppSettings;
  seoSettings: SeoSettings;
  siteSettings: SiteSettings;
  adminUser?: {
    username: string;
    email: string;
    createdAt: string;
  };
}
