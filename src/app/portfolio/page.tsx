'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import { getPortfolio } from '@/lib/firestore';
import { PortfolioItem } from '@/types';
import { placeholderImage } from '@/lib/utils';

const SEED_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-1',
    brandName: 'Nocturne Atelier',
    description:
      'A luxury haute-parfumerie line created for a premier lifestyle concept boutique in Lahore. Features 50ml smoked glass flacons with heavy metallic gold caps and custom saffron-oud EDP juice.',
    imageUrl: placeholderImage(600, 450, 'Nocturne Atelier', 'brand'),
    visible: true,
    sortOrder: 1,
  },
  {
    id: 'port-2',
    brandName: 'Maison Khyber',
    description:
      'Heritage private-label fragrance line celebrating indigenous botanical notes of Northern Pakistan. Custom green frosted bottles with foil-stamped cedarwood paper sleeves.',
    imageUrl: placeholderImage(600, 450, 'Maison Khyber', 'brand'),
    visible: true,
    sortOrder: 2,
  },
  {
    id: 'port-3',
    brandName: 'Aura Bloom Couture',
    description:
      'A delicate bridal and evening perfume collection formulated for an upscale bridal wear design house in Islamabad. Features French floral bouquet profiles in 100ml crystal rectangular bottles.',
    imageUrl: placeholderImage(600, 450, 'Aura Bloom Couture', 'brand'),
    visible: true,
    sortOrder: 3,
  },
  {
    id: 'port-4',
    brandName: 'Vanguard Grooming Club',
    description:
      'An invigorating masculine barbershop and fragrance line featuring fresh aquatic-citrus notes, matte black soft-touch cylinders, and tactile embossed logos for a modern men’s salon franchise.',
    imageUrl: placeholderImage(600, 450, 'Vanguard Grooming Club', 'brand'),
    visible: true,
    sortOrder: 4,
  },
];

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(SEED_PORTFOLIO);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPortfolio(true);
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.warn('Using seed portfolio:', err);
      }
    }
    load();
  }, []);

  return (
    <PublicLayout>
      <div className="py-10 sm:py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
            Client Brand Showcase
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight">
            Brands We’ve Built
          </h1>
          <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
          <p className="text-sm sm:text-base text-[var(--color-secondary-text)] leading-relaxed">
            From emerging fashion houses and boutique salons to retail entrepreneurs, we have brought distinctive fragrance concepts from initial idea to commercially successful retail products.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mb-14 sm:mb-20">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-[var(--color-borders)] shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-[var(--color-dark-bg)] overflow-hidden">
                <Image
                  src={item.imageUrl || placeholderImage(600, 450, item.brandName, 'brand')}
                  alt={item.brandName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                    Private Label Project
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                    {item.brandName}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between">
                <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-6 pt-5 border-t border-[var(--color-borders)]/60 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-[var(--color-secondary-text)]">
                    Full Turnkey Private Label
                  </span>
                  <Link
                    href={`/contact?brandReference=${encodeURIComponent(item.brandName)}`}
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] inline-flex items-center gap-1"
                  >
                    Build similar brand →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[var(--color-surface)] rounded-3xl p-10 md:p-14 text-center border border-[var(--color-borders)] max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-primary-text)] mb-4">
            Ready to See Your Brand Name on a Luxury Bottle?
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-secondary-text)] mb-8 max-w-xl mx-auto">
            You don’t need chemistry degrees or international factory contacts. Let our experienced perfumers and production team guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] shadow-sm transition-all"
            >
              Start Your Brand Project
            </Link>
            <Link
              href="/services"
              className="px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[var(--color-primary-text)] bg-white border border-[var(--color-borders)] hover:bg-[var(--color-background)] transition-colors"
            >
              Review Turnkey Process
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
