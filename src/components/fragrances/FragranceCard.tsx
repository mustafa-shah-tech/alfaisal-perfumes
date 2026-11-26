'use client';

import Image from 'next/image';
import { Fragrance } from '@/types';
import { placeholderImage } from '@/lib/utils';

interface FragranceCardProps {
  fragrance: Fragrance;
  onClick?: (fragrance: Fragrance) => void;
}

export default function FragranceCard({ fragrance, onClick }: FragranceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(fragrance)}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-[var(--color-borders)] bg-white text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 fade-up"
      aria-label={`View details for ${fragrance.name}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-surface)]">
        <Image
          src={fragrance.imageUrl || placeholderImage(400, 530, fragrance.name, 'bottle')}
          alt={fragrance.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gender tag */}
        <span className="absolute top-3 right-3 rounded-full bg-[var(--color-dark-bg)]/80 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-sm">
          {fragrance.gender}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-serif text-lg font-semibold text-[var(--color-primary-text)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
          {fragrance.name}
        </h3>

        {/* Family badge */}
        <span className="inline-flex w-fit rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-0.5 text-xs font-medium text-[var(--color-accent-dark)]">
          {fragrance.family}
        </span>

        {/* Top notes preview */}
        {fragrance.notesTop && (
          <p className="mt-1 text-xs text-[var(--color-secondary-text)] line-clamp-2">
            <span className="font-medium">Top notes:</span> {fragrance.notesTop}
          </p>
        )}
      </div>
    </button>
  );
}
