'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import { getServices } from '@/lib/firestore';
import { ServicesContent } from '@/types';
import { placeholderImage } from '@/lib/utils';

const DEFAULT_SERVICES: ServicesContent = {
  title: 'Bespoke Private Label Perfume Manufacturing',
  intro:
    'We empower boutiques, fashion houses, beauty salons, corporate gift specialists, and ambitious entrepreneurs to launch their own luxury fragrance brands. From olfactory formulation to bespoke packaging, Alfaisal Perfumes handles every step with artisan craftsmanship and commercial reliability.',
  included: [
    'Private-label Eau de Parfum (EDP) & Eau de Toilette (EDT) formulations',
    'Custom bottle selection (50ml, 100ml, travel sizes, luxury cylinders & squares)',
    'High-end cap and atomiser choices (gold, matte black, silver, weighted magnetic)',
    'Custom label design, foil stamping, embossing, and waterproof finishes',
    'Rigid luxury presentation boxes, sleeve boxes, and boutique carton packaging',
    'Low minimum order quantities (MOQ) tailored for startups and test launches',
    'Fragrance sample approval kit before final bulk production batching',
    'End-to-end quality assurance and batch consistency checks',
    'Comprehensive logistics coordination directly from Malakand, KPK across Pakistan',
  ],
  sections: [
    {
      title: '1. Fragrance Selection & Olfactory Profile',
      description:
        'Choose from our curated master collection of French and Oriental fragrance formulations spanning Floral, Woody, Amber, Citrus, Fresh, and Gourmand families. We calibrate oil concentrations (up to 25% EDP) to guarantee premium sillage and long-lasting performance under your brand name.',
      imageUrl: placeholderImage(600, 400, 'Fragrance Selection', 'bottle'),
    },
    {
      title: '2. Bottle & Hardware Customization',
      description:
        'Your perfume bottle is your brand’s tangible signature. Select from heavy-base crystal glass, frosted minimalism, tinted amber, or architectural squares. Match with precision fine-mist spray pumps and magnetic or engraved luxury closures.',
      imageUrl: placeholderImage(600, 400, 'Custom Bottle Options', 'bottle'),
    },
    {
      title: '3. Label & Box Packaging Engineering',
      description:
        'Our design support helps transform your visual identity into exquisite print-ready packaging. From metallic gold hot foil stamping to velvety soft-touch lamination, your finished perfume looks and feels like it belongs in the world’s top luxury department stores.',
      imageUrl: placeholderImage(600, 400, 'Packaging & Boxes', 'bottle'),
    },
    {
      title: '4. Batch Production & Fast Turnaround',
      description:
        'We blend, macerate, filter, bottle, and seal your perfumes in climate-controlled conditions. Enjoy dependable timelines, rigorous quality control, and responsive communication from our dedicated team based in KPK.',
      imageUrl: placeholderImage(600, 400, 'Production & Craftsmanship', 'bottle'),
    },
  ],
  ctaText: 'Launch Your Signature Fragrance Brand Today',
  ctaDescription:
    'Request a private label consultation and sample kit. Let us bring your fragrance vision to life with precision, elegance, and competitive PKR pricing.',
};

export default function ServicesPage() {
  const [content, setContent] = useState<ServicesContent>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getServices();
        if (data) setContent({ ...DEFAULT_SERVICES, ...data });
      } catch (err) {
        console.warn('Using default services content:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PublicLayout>
      <div className="py-10 sm:py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-24">
          <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
            Private Label Perfume Services
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight">
            {content.title}
          </h1>
          <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
          <p className="text-sm sm:text-base md:text-lg text-[var(--color-secondary-text)] leading-relaxed">
            {content.intro}
          </p>
        </div>

        {/* Process Detail Sections */}
        <div className="space-y-12 sm:space-y-16 md:space-y-24 mb-16 sm:mb-24">
          {content.sections.map((section, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={idx}
                className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--color-borders)] bg-[var(--color-surface)] shadow-md group">
                    <Image
                      src={section.imageUrl || placeholderImage(600, 400, section.title, 'bottle')}
                      alt={section.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Text */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <span className="text-xs font-bold tracking-widest text-[var(--color-accent)] uppercase">
                    Stage 0{idx + 1}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-primary-text)]">
                    {section.title}
                  </h2>
                  <p className="text-base text-[var(--color-secondary-text)] leading-relaxed">
                    {section.description}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="inline-flex items-center text-sm font-semibold text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] transition-colors group"
                    >
                      Inquire about this capability
                      <svg
                        className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* What's Included Card Grid */}
        <div className="bg-[var(--color-surface)]/60 rounded-2xl sm:rounded-3xl border border-[var(--color-borders)] p-6 sm:p-10 md:p-16 mb-16 sm:mb-24">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
              Full Turnkey Solution
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-primary-text)]">
              Everything Included in Your Brand Creation
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[var(--color-secondary-text)]">
              We eliminate the complexity of negotiating with multiple vendors, oil suppliers, bottle factories, and printers. Everything is streamlined in one coherent service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.included.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-[var(--color-borders)] flex items-start gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="h-6 w-6 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent-dark)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[var(--color-primary-text)] leading-snug">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-[var(--color-dark-bg)] text-white p-10 sm:p-14 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#B08D57_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {content.ctaText}
            </h2>
            <p className="text-sm sm:text-base text-[#D1C9BE] leading-relaxed">
              {content.ctaDescription}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] shadow-md transition-all duration-300"
              >
                Request Custom Quote
              </Link>
              <Link
                href="/fragrances"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white border border-[#6B6459] hover:bg-white/10 transition-colors"
              >
                Explore Fragrance Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
