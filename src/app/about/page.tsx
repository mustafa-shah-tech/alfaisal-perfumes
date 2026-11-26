'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import { getAbout } from '@/lib/firestore';
import { AboutContent } from '@/types';
import { placeholderImage } from '@/lib/utils';

const DEFAULT_ABOUT: AboutContent = {
  title: 'Artisan Perfumery Meets Commercial Excellence',
  story: `Alfaisal Perfumes was founded with a singular conviction: exceptional private-label fragrance manufacturing should be accessible to visionary entrepreneurs, boutiques, salons, and established fashion houses without requiring astronomical minimum orders or foreign supply chain nightmares.

Rooted in Malakand, Khyber Pakhtunkhwa (KPK), our workshop blends the age-old heritage of Eastern olfactory traditions with contemporary European formulation standards. We partner with passionate brand owners across Pakistan and beyond, providing the formulation artistry, luxury bottle sourcing, custom box packaging, and precision batch production required to take a fragrance brand from concept to shelf.

Whether you are launching your first signature scent or extending an established lifestyle brand, we treat your business reputation as sacred. Every spray that leaves our facility reflects meticulous oil balancing, thorough maceration, and flawless presentation.`,
  mission:
    'To be Pakistan’s most trusted and prestigious private-label perfume manufacturing partner, turning entrepreneurial fragrance visions into world-class consumer products.',
  values: [
    {
      title: 'Uncompromised Oil Quality',
      description:
        'We formulate using premium grade fragrance oils and cosmetic grade neutral denatured spirits, ensuring high concentration EDP ratings and exceptional skin-safe longevity.',
    },
    {
      title: 'Artisan Craftsmanship',
      description:
        'Every bottle, label, pump, and box is inspected by hand. We believe true luxury resides in the millimeter precision of label alignment and the crispness of the atomiser mist.',
    },
    {
      title: 'Empowering Local Brands',
      description:
        'We champion Pakistani entrepreneurs by lowering technical barriers to entry and providing honest advisory on fragrance trends, bottle ergonomics, and pricing margins.',
    },
    {
      title: 'Confidentiality & Integrity',
      description:
        'Your custom formulations and private brand recipes remain strictly proprietary. We respect the trust our private-label partners place in us.',
    },
  ],
  locationText:
    'Proudly based in Malakand, Khyber Pakhtunkhwa (KPK), Pakistan. From the serene valleys of KPK, we blend and dispatch custom private-label fragrance consignments to clients throughout Islamabad, Lahore, Karachi, Peshawar, and across the nation.',
  images: [
    placeholderImage(600, 400, 'Artisan Perfumery', 'bottle'),
    placeholderImage(600, 400, 'Malakand KPK Facility', 'gradient'),
  ],
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent>(DEFAULT_ABOUT);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAbout();
        if (data) setContent({ ...DEFAULT_ABOUT, ...data });
      } catch (err) {
        console.warn('Using default about content:', err);
      }
    }
    load();
  }, []);

  return (
    <PublicLayout>
      <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
            Our Heritage & Craft
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight">
            {content.title}
          </h1>
          <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6 text-[var(--color-secondary-text)] leading-relaxed text-base sm:text-lg">
            {content.story.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[var(--color-borders)] bg-[var(--color-surface)] shadow-lg">
              <Image
                src={content.images?.[0] || placeholderImage(600, 750, 'Alfaisal Craftsmanship', 'bottle')}
                alt="Alfaisal Perfumes Craftsmanship"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                  Est. in Malakand, KPK
                </span>
                <p className="font-serif text-xl font-bold mt-1">
                  Private Label Excellence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement Callout */}
        <div className="bg-[var(--color-surface)] rounded-3xl p-8 sm:p-12 md:p-16 border border-[var(--color-borders)] text-center max-w-4xl mx-auto mb-20 relative overflow-hidden">
          <span className="text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
            Our Core Mission
          </span>
          <blockquote className="mt-4 font-serif text-xl sm:text-2xl md:text-3xl text-[var(--color-primary-text)] italic leading-relaxed">
            &ldquo;{content.mission}&rdquo;
          </blockquote>
        </div>

        {/* Values Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
              Our Principles
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[var(--color-primary-text)]">
              The Values Guiding Every Batch
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.values.map((val, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-[var(--color-borders)] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent-dark)] font-serif font-bold text-lg flex items-center justify-center mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-xl font-bold text-[var(--color-primary-text)] mb-2">
                  {val.title}
                </h3>
                <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Location Block */}
        <div className="bg-[var(--color-dark-bg)] text-white rounded-3xl p-8 sm:p-12 md:p-16 border border-[#2A2520] relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase">
              Geographic Roots
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2 mb-6">
              Based in Malakand, KPK, Pakistan
            </h2>
            <p className="text-sm sm:text-base text-[#D1C9BE] leading-relaxed mb-8">
              {content.locationText}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] shadow-sm transition-colors"
              >
                Get in Touch With Our Team
              </Link>
              <Link
                href="/fragrances"
                className="px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#D1C9BE] border border-[#403932] hover:bg-white/10 transition-colors"
              >
                Browse Scents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
