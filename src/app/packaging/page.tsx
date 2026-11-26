'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import { getPackagingOptions } from '@/lib/firestore';
import { PackagingOption } from '@/types';
import { placeholderImage } from '@/lib/utils';

const SEED_PACKAGING: PackagingOption[] = [
  {
    id: 'pack-1',
    title: 'Architectural Heavy-Base Glass (50ml / 100ml)',
    description:
      'Ultra-clear cosmetic flint glass with a weighted base that feels substantial and luxurious in hand. Available in crystal clear, smoky obsidian, and frosted satin finishes.',
    imageUrl: placeholderImage(500, 400, 'Heavy-Base Glass', 'bottle'),
    sortOrder: 1,
    visible: true,
  },
  {
    id: 'pack-2',
    title: 'Minimalist Cylindrical Spray Bottles',
    description:
      'Timeless Nordic-inspired round bottles suited for contemporary unisex and niche indie perfume concepts. Accommodates 360-degree wraparound labels or direct silk-screening.',
    imageUrl: placeholderImage(500, 400, 'Cylindrical Bottle', 'bottle'),
    sortOrder: 2,
    visible: true,
  },
  {
    id: 'pack-3',
    title: 'Hot-Foil & Embossed Metallic Labels',
    description:
      'Waterproof, oil-resistant textured paper stock embellished with gold, silver, rose-gold, or holographic foil stamping and tactile micro-embossing.',
    imageUrl: placeholderImage(500, 400, 'Foil Embossed Labels', 'gradient'),
    sortOrder: 3,
    visible: true,
  },
  {
    id: 'pack-4',
    title: 'Rigid Luxury Presentation Gift Boxes',
    description:
      'Custom-die-cut dense cardboard presentation boxes with soft-touch velvet or EVA foam inserts to cradle your perfume securely. Magnetic flap or shoulder-neck style.',
    imageUrl: placeholderImage(500, 400, 'Rigid Presentation Box', 'brand'),
    sortOrder: 4,
    visible: true,
  },
  {
    id: 'pack-5',
    title: 'Precision Fine-Mist Atomisers & Weighted Caps',
    description:
      'Engineered Italian-style spray pumps providing an ultra-fine, even aerosol cloud without sputtering. Matched with magnetic snap closures in brushed gold, chrome, or wood grain.',
    imageUrl: placeholderImage(500, 400, 'Caps & Atomisers', 'bottle'),
    sortOrder: 5,
    visible: true,
  },
  {
    id: 'pack-6',
    title: 'Pocket Travel Sprays & Discovery Vials (10ml & 2ml)',
    description:
      'Branded pocket atomisers for travel editions and tester sample discovery sets. Essential for brand promotional campaigns and multi-scent discovery boxes.',
    imageUrl: placeholderImage(500, 400, 'Travel & Discovery Sprays', 'bottle'),
    sortOrder: 6,
    visible: true,
  },
];

export default function PackagingPage() {
  const [options, setOptions] = useState<PackagingOption[]>(SEED_PACKAGING);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPackagingOptions(true);
        if (data && data.length > 0) {
          setOptions(data);
        }
      } catch (err) {
        console.warn('Using seed packaging:', err);
      }
    }
    load();
  }, []);

  return (
    <PublicLayout>
      <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
            Bespoke Hardware & Presentation
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight">
            Packaging & Branding Options
          </h1>
          <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
          <p className="text-base text-[var(--color-secondary-text)] leading-relaxed">
            Your brand visual identity begins where the customer touches the bottle. Explore our customizable bottles, closures, label materials, and rigid gift boxes engineered to rival international perfume houses.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {options.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-[var(--color-borders)] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[4/3] bg-[var(--color-surface)] overflow-hidden">
                <Image
                  src={item.imageUrl || placeholderImage(500, 400, item.title, 'bottle')}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[var(--color-primary-text)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--color-borders)]/60">
                  <Link
                    href="/contact"
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] inline-flex items-center gap-1.5"
                  >
                    Select this option for your quote →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customization Advisory */}
        <div className="bg-[var(--color-surface)] rounded-3xl p-8 sm:p-12 border border-[var(--color-borders)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-primary-text)]">
              Have a Specific Custom Bottle or Cap in Mind?
            </h3>
            <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
              If you have proprietary bottle moulds, custom Pantone colors, or unique metal badges, our production consultants in Malakand, KPK can source and integrate them into your private-label perfume batch.
            </p>
          </div>
          <Link
            href="/contact"
            className="whitespace-nowrap px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] shadow-sm transition-colors"
          >
            Consult with Our Engineers
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
