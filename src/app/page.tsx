'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import type {
  HomeContent,
  Fragrance,
  ProcessStep,
  PortfolioItem,
  Testimonial,
} from '@/types';
import {
  getHomeContent,
  getFeaturedFragrances,
  getProcessSteps,
  getPortfolio,
  getTestimonials,
} from '@/lib/firestore';
import { buildWhatsAppUrl, placeholderImage } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import FragranceCard from '@/components/fragrances/FragranceCard';
import FragranceModal from '@/components/fragrances/FragranceModal';

// ─── Default Fallback Data for Flawless First-Run ───────────────────────────
const DEFAULT_HOME_CONTENT: HomeContent = {
  heroTitle: 'Your Name. Your Scent. Your Perfume Brand.',
  heroSubtitle: 'We build your perfume business, from the first fragrance to the finished bottle.',
  heroImage: '',
  heroCtaText: 'Get a Free Quote',
  heroSecondaryCtaText: 'See How It Works',
  trustStrip: [
    { icon: '✦', text: 'Your Brand Name on Every Bottle' },
    { icon: '◈', text: 'Premium Concentration (EDP / EDT)' },
    { icon: '❖', text: 'Low Minimum Order Quantities' },
    { icon: '✧', text: 'Fast, Personal Turnkey Service' },
  ],
  whatWeDoTitle: 'Private-Label Spray Perfume Manufacturing',
  whatWeDoText:
    'Alfaisal Perfumes creates custom-branded spray perfumes (EDP / EDT) for other businesses. You bring your brand name, and we manufacture the perfumes under that brand: fragrance formulation, bottle selection, cap pairing, custom label finishing, and luxury presentation box production.',
  whyChooseTitle: 'Why Visionary Brands Partner With Alfaisal',
  whyChooseItems: [
    {
      title: 'Artisan Oil Formulations',
      description: 'Masterfully blended fragrance oils with long-lasting sillage and projection, rigorously tested for stability.',
      icon: '01',
    },
    {
      title: 'Turnkey Hardware & Packaging',
      description: 'From heavy-base glass flacons to foil-stamped labels and rigid gift boxes, every detail is handled seamlessly.',
      icon: '02',
    },
    {
      title: 'Low Startup MOQs',
      description: 'Test your target market without crippling upfront capital. We support flexible batch quantities for emerging brands.',
      icon: '03',
    },
    {
      title: 'Authentic Local Craft',
      description: 'Formulated and crafted in Malakand, KPK, Pakistan, ensuring direct communication, transparent pricing, and rapid delivery.',
      icon: '04',
    },
  ],
  ctaTitle: 'Ready to Launch Your Own Signature Perfume Brand?',
  ctaText:
    'Whether you run a boutique, fashion salon, or are launching a new consumer brand, we make custom fragrance manufacturing straightforward, prestigious, and profitable.',
  sectionVisibility: {
    trustStrip: true,
    whatWeDo: true,
    process: true,
    featuredFragrances: true,
    whyChoose: true,
    portfolio: true,
    testimonials: true,
    cta: true,
  },
};

const DEFAULT_STEPS: ProcessStep[] = [
  {
    id: 's-1',
    title: 'Consultation',
    description: 'Tell us about your brand vision, target demographic, and preferred fragrance families.',
    icon: '1',
    sortOrder: 1,
  },
  {
    id: 's-2',
    title: 'Choose Fragrances',
    description: 'Select your signature scent profiles from our library of French and Oriental formulations.',
    icon: '2',
    sortOrder: 2,
  },
  {
    id: 's-3',
    title: 'Design Packaging',
    description: 'Customize your flacon, atomiser, metal caps, foil labels, and rigid luxury gift box.',
    icon: '3',
    sortOrder: 3,
  },
  {
    id: 's-4',
    title: 'Sample Approval',
    description: 'Experience pre-production physical samples and refine notes until completely satisfied.',
    icon: '4',
    sortOrder: 4,
  },
  {
    id: 's-5',
    title: 'Batch Production & Dispatch',
    description: 'We blend, bottle, label, crimp, box, and deliver your finished perfumes across Pakistan.',
    icon: '5',
    sortOrder: 5,
  },
];

const DEFAULT_FEATURED: Fragrance[] = [
  {
    id: 'feat-1',
    name: 'Midnight Amber Oud',
    description: 'A regal and hypnotic blend of Cambodian agarwood, roasted tonka, and golden amber.',
    family: 'Woody',
    gender: 'Unisex',
    notesTop: 'Bergamot, Pink Pepper, Saffron',
    notesHeart: 'Smoky Oud, Bulgarian Rose',
    notesBase: 'Golden Amber, Tonka Bean',
    imageUrl: placeholderImage(400, 530, 'Midnight Amber Oud', 'bottle'),
    featured: true,
    visible: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'feat-2',
    name: 'Velvet Jasmine Mist',
    description: 'An ethereal and radiant bouquet of night-blooming white jasmine draped in crystalline neroli.',
    family: 'Floral',
    gender: 'Women',
    notesTop: 'Neroli, Mandarin Blossom',
    notesHeart: 'Sambac Jasmine, Damask Rose',
    notesBase: 'Cashmeran, White Musk',
    imageUrl: placeholderImage(400, 530, 'Velvet Jasmine Mist', 'bottle'),
    featured: true,
    visible: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'feat-3',
    name: 'Cedar & Black Pepper',
    description: 'Crisp Atlas cedarwood, cracked black peppercorn, and smoky vetiver roots.',
    family: 'Woody',
    gender: 'Men',
    notesTop: 'Cracked Black Pepper, Bergamot',
    notesHeart: 'Cedar Needle, Clary Sage',
    notesBase: 'Atlas Cedarwood, Vetiver',
    imageUrl: placeholderImage(400, 530, 'Cedar & Black Pepper', 'bottle'),
    featured: true,
    visible: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'feat-4',
    name: 'Imperial Saffron Noir',
    description: 'Kashmiri saffron laced over dark plum liqueur and aged oak casks.',
    family: 'Oriental',
    gender: 'Unisex',
    notesTop: 'Dark Plum, Wild Saffron',
    notesHeart: 'Tobacco Flower, Cistus',
    notesBase: 'Aged Oak, Indonesian Patchouli',
    imageUrl: placeholderImage(400, 530, 'Imperial Saffron Noir', 'bottle'),
    featured: true,
    visible: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p-1',
    brandName: 'Nocturne Atelier',
    description: 'Luxury 50ml flacons with heavy gold caps and custom saffron-oud juice for a boutique in Lahore.',
    imageUrl: placeholderImage(600, 450, 'Nocturne Atelier', 'brand'),
    visible: true,
    sortOrder: 1,
  },
  {
    id: 'p-2',
    brandName: 'Maison Khyber',
    description: 'Heritage private-label fragrance line celebrating northern botanicals in green frosted glass.',
    imageUrl: placeholderImage(600, 450, 'Maison Khyber', 'brand'),
    visible: true,
    sortOrder: 2,
  },
  {
    id: 'p-3',
    brandName: 'Aura Bloom Couture',
    description: 'French floral bouquet private line for a bridal couture house in Islamabad.',
    imageUrl: placeholderImage(600, 450, 'Aura Bloom Couture', 'brand'),
    visible: true,
    sortOrder: 3,
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Kamran Siddiqui',
    role: 'Founder',
    company: 'Siddiqui Apparel & Lifestyle',
    text: 'Alfaisal Perfumes made launching our signature brand effortless. The fragrance quality rivals imported designer scents, and our customers constantly ask where we had it made.',
    imageUrl: '',
    visible: true,
    sortOrder: 1,
  },
  {
    id: 't-2',
    name: 'Dr. Fatima Noor',
    role: 'Managing Director',
    company: 'Lumière Aesthetics & Spa',
    text: 'Finding a reliable private-label manufacturer in Pakistan with low MOQs and luxury bottle finishes was nearly impossible until we met the Alfaisal team. Exceptional service and prompt delivery.',
    imageUrl: '',
    visible: true,
    sortOrder: 2,
  },
  {
    id: 't-3',
    name: 'Bilal Afridi',
    role: 'Creative Director',
    company: 'Northwind Boutique',
    text: 'From the initial scent consultation in KPK to the arrival of our embossed gift boxes, the entire process was transparent, professional, and world-class.',
    imageUrl: '',
    visible: true,
    sortOrder: 3,
  },
];

export default function HomePage() {
  const { settings } = useSettings();
  const [homeContent, setHomeContent] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const [fragrances, setFragrances] = useState<Fragrance[]>(DEFAULT_FEATURED);
  const [steps, setSteps] = useState<ProcessStep[]>(DEFAULT_STEPS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [hc, fr, st, po, te] = await Promise.all([
          getHomeContent(),
          getFeaturedFragrances(),
          getProcessSteps(),
          getPortfolio(true),
          getTestimonials(true),
        ]);
        if (hc) setHomeContent(hc);
        if (fr && fr.length > 0) setFragrances(fr);
        if (st && st.length > 0) setSteps(st);
        if (po && po.length > 0) setPortfolio(po);
        if (te && te.length > 0) setTestimonials(te);
      } catch (err) {
        console.warn('Using default home data:', err);
      }
    }
    loadData();
  }, []);

  const vis = homeContent.sectionVisibility || DEFAULT_HOME_CONTENT.sectionVisibility;
  const whatsappUrl = settings.whatsapp
    ? buildWhatsAppUrl(
        settings.whatsapp,
        settings.whatsappMessage || "Hi, I'm interested in building a perfume brand with Alfaisal Perfumes."
      )
    : '';

  return (
    <PublicLayout>
      {/* ══════════ HERO SECTION ══════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[var(--color-dark-bg)] text-white">
        {/* Subtle Luxury Pattern / Gradient Background */}
        <div className="absolute inset-0">
          {homeContent.heroImage ? (
            <Image
              src={homeContent.heroImage}
              alt="Alfaisal Perfumes Hero"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-35"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#241E1A] via-[#14110F] to-[#0A0807]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)] via-transparent to-black/40" />
        </div>

        {/* Ambient Subtle Accent Light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-accent)]/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 backdrop-blur-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
              Bespoke Private Label Perfumes (EDP / EDT)
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            {homeContent.heroTitle}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#D1C9BE] font-light leading-relaxed mb-10">
            {homeContent.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              {homeContent.heroCtaText || 'Get a Free Quote'}
            </Link>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase text-[#FAF7F2] border border-[#524940] hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>{homeContent.heroSecondaryCtaText || 'See How It Works'}</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[9px] tracking-widest uppercase text-[#A0988D] mb-1">Scroll</span>
          <div className="w-4 h-7 rounded-full border border-[#524940] flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════ TRUST STRIP ══════════ */}
      {vis?.trustStrip !== false && homeContent.trustStrip && (
        <section className="bg-white border-y border-[var(--color-borders)] py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center text-center">
              {homeContent.trustStrip.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <span className="text-[var(--color-accent)] font-serif text-xl">{item.icon}</span>
                  <span className="text-xs sm:text-sm font-medium text-[var(--color-primary-text)] tracking-wide">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ WHAT WE DO ══════════ */}
      {vis?.whatWeDo !== false && (
        <section className="py-20 md:py-28 bg-[var(--color-background)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
              Private Label Perfume House
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight">
              {homeContent.whatWeDoTitle}
            </h2>
            <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-8" />
            <p className="text-base sm:text-lg text-[var(--color-secondary-text)] leading-relaxed font-normal">
              {homeContent.whatWeDoText}
            </p>
            <div className="mt-10">
              <Link
                href="/services"
                className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] group"
              >
                Learn more about our turnkey services
                <span className="ml-1.5 transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════ OUR PROCESS ══════════ */}
      {vis?.process !== false && steps && (
        <section id="how-it-works" className="py-20 md:py-28 bg-[var(--color-surface)] border-y border-[var(--color-borders)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
              <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
                Five Simple Steps
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[var(--color-primary-text)]">
                Our Creation Process
              </h2>
              <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
              <p className="text-sm sm:text-base text-[var(--color-secondary-text)]">
                We make launching a professional private perfume brand straightforward and transparent.
              </p>
            </div>

            {/* Desktop 5-Column Timeline */}
            <div className="hidden lg:grid grid-cols-5 gap-6 relative">
              <div className="absolute top-10 left-12 right-12 h-0.5 bg-[var(--color-borders)] z-0" />
              {steps.map((step, idx) => (
                <div key={step.id || idx} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-[var(--color-accent)] flex items-center justify-center font-serif text-2xl font-bold text-[var(--color-accent)] shadow-md mb-6">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[var(--color-primary-text)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[var(--color-secondary-text)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile / Tablet Vertical Timeline */}
            <div className="lg:hidden space-y-6">
              {steps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="bg-white p-6 rounded-2xl border border-[var(--color-borders)] flex items-start gap-4 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] text-white font-serif text-lg font-bold flex items-center justify-center flex-shrink-0 shadow">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[var(--color-primary-text)] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-secondary-text)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ FEATURED FRAGRANCES ══════════ */}
      {vis?.featuredFragrances !== false && fragrances.length > 0 && (
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
                Fragrance Library Preview
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[var(--color-primary-text)]">
                Signature Formulations
              </h2>
            </div>
            <Link
              href="/fragrances"
              className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] inline-flex items-center gap-1"
            >
              Explore Full Collection ({fragrances.length}+) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fragrances.slice(0, 4).map((frag) => (
              <FragranceCard
                key={frag.id}
                fragrance={frag}
                onClick={(item) => setSelectedFragrance(item)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ══════════ WHY CHOOSE ALFAISAL ══════════ */}
      {vis?.whyChoose !== false && homeContent.whyChooseItems && (
        <section className="py-20 md:py-28 bg-[var(--color-dark-bg)] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
                The Alfaisal Difference
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-white">
                {homeContent.whyChooseTitle}
              </h2>
              <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {homeContent.whyChooseItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#1C1815] border border-[#2D2722] rounded-2xl p-8 hover:border-[var(--color-accent)]/50 transition-colors"
                >
                  <span className="font-serif text-3xl font-bold text-[var(--color-accent)] block mb-4">
                    {item.icon}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#A0988D] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ BRANDS WE'VE BUILT ══════════ */}
      {vis?.portfolio !== false && portfolio.length > 0 && (
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
              Client Portfolio
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[var(--color-primary-text)]">
              Brands We’ve Built
            </h2>
            <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {portfolio.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-[var(--color-borders)] shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="relative aspect-[16/10] bg-[var(--color-dark-bg)]">
                  <Image
                    src={item.imageUrl || placeholderImage(600, 450, item.brandName, 'brand')}
                    alt={item.brandName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-[var(--color-primary-text)] mb-2">
                    {item.brandName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-secondary-text)] line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-dark)] hover:text-[var(--color-accent)]"
            >
              View all private-label case studies →
            </Link>
          </div>
        </section>
      )}

      {/* ══════════ TESTIMONIALS ══════════ */}
      {vis?.testimonials !== false && testimonials.length > 0 && (
        <section className="py-20 md:py-28 bg-[var(--color-surface)]/70 border-t border-[var(--color-borders)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
                Reputation & Trust
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[var(--color-primary-text)]">
                What Brand Owners Say
              </h2>
              <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl p-8 border border-[var(--color-borders)] shadow-sm flex flex-col justify-between"
                >
                  <p className="text-sm text-[var(--color-secondary-text)] italic leading-relaxed mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-[var(--color-borders)]/60">
                    <p className="font-serif font-bold text-[var(--color-primary-text)] text-base">
                      {t.name}
                    </p>
                    <p className="text-xs text-[var(--color-accent-dark)] font-medium mt-0.5">
                      {t.role} • {t.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ FINAL CTA BAND ══════════ */}
      {vis?.cta !== false && (
        <section className="py-20 md:py-24 bg-[var(--color-dark-bg)] text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {homeContent.ctaTitle}
            </h2>
            <p className="text-base sm:text-lg text-[#D1C9BE] leading-relaxed font-light">
              {homeContent.ctaText}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Request a Free Quote
              </Link>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Fragrance Details Modal */}
      <FragranceModal
        fragrance={selectedFragrance}
        whatsappNumber={settings.whatsapp}
        onClose={() => setSelectedFragrance(null)}
      />
    </PublicLayout>
  );
}
