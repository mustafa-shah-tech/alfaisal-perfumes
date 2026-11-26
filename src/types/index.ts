// ============================================================
// Alfaisal Perfumes — TypeScript Type Definitions
// ============================================================

// --- Site Settings ---
export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

export interface LogoConfig {
  type: 'text' | 'image';
  text: string;
  imageUrl: string;
}

export interface SiteSettings {
  businessName: string;
  logo: LogoConfig;
  tagline: string;
  subHeadline: string;
  favicon: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  address: string;
  socialLinks: SocialLinks;
  footerText: string;
}

// --- Theme ---
export interface ThemeColors {
  background: string;
  surface: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  accentDark: string;
  darkBg: string;
  borders: string;
}

export const DEFAULT_THEME: ThemeColors = {
  background: '#FAF7F2',
  surface: '#EFE8DC',
  primaryText: '#1A1A1A',
  secondaryText: '#6B6459',
  accent: '#B08D57',
  accentDark: '#8F6F3E',
  darkBg: '#14110F',
  borders: '#E3DACB',
};

// --- Home Content ---
export interface TrustStripItem {
  icon: string;
  text: string;
}

export interface SectionVisibility {
  trustStrip: boolean;
  whatWeDo: boolean;
  process: boolean;
  featuredFragrances: boolean;
  whyChoose: boolean;
  portfolio: boolean;
  testimonials: boolean;
  cta: boolean;
}

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaText: string;
  heroSecondaryCtaText: string;
  trustStrip: TrustStripItem[];
  whatWeDoTitle: string;
  whatWeDoText: string;
  whyChooseTitle: string;
  whyChooseItems: { title: string; description: string; icon: string }[];
  ctaTitle: string;
  ctaText: string;
  sectionVisibility: SectionVisibility;
}

// --- Fragrance ---
export type FragranceGender = 'Men' | 'Women' | 'Unisex';
export type FragranceFamily =
  | 'Floral'
  | 'Woody'
  | 'Oriental'
  | 'Fresh'
  | 'Citrus'
  | 'Musk'
  | 'Aquatic'
  | 'Spicy'
  | 'Gourmand';

export interface Fragrance {
  id: string;
  name: string;
  description: string;
  family: FragranceFamily;
  gender: FragranceGender;
  notesTop: string;
  notesHeart: string;
  notesBase: string;
  imageUrl: string;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  createdAt: string;
}

// --- Packaging Option ---
export interface PackagingOption {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  visible: boolean;
}

// --- Portfolio ---
export interface PortfolioItem {
  id: string;
  brandName: string;
  description: string;
  imageUrl: string;
  visible: boolean;
  sortOrder: number;
}

// --- Testimonial ---
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  imageUrl: string;
  visible: boolean;
  sortOrder: number;
}

// --- Process Step ---
export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
}

// --- Services ---
export interface ServicesContent {
  title: string;
  intro: string;
  included: string[];
  sections: { title: string; description: string; imageUrl: string }[];
  ctaText: string;
  ctaDescription: string;
}

// --- About ---
export interface AboutContent {
  title: string;
  story: string;
  mission: string;
  values: { title: string; description: string }[];
  locationText: string;
  images: string[];
}

// --- FAQ ---
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  visible: boolean;
}

// --- Inquiry ---
export type InquiryStatus = 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Closed';

export interface Inquiry {
  id: string;
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  fragrances: string[];
  quantity: string;
  message: string;
  status: InquiryStatus;
  notes: string;
  read: boolean;
  createdAt: string;
}

// --- SEO ---
export interface PageSEO {
  pageSlug: string;
  title: string;
  metaDescription: string;
  ogImage: string;
}

// --- Legal ---
export interface LegalPage {
  title: string;
  content: string;
}

// --- Media ---
export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  createdAt: string;
}
