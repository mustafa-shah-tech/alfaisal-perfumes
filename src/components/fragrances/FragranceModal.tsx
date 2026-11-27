'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Heart, Compass, X } from 'lucide-react';
import { Fragrance } from '@/types';
import { buildWhatsAppUrl, placeholderImage } from '@/lib/utils';

interface FragranceModalProps {
  fragrance: Fragrance | null;
  whatsappNumber?: string;
  onClose: () => void;
}

export default function FragranceModal({ fragrance, whatsappNumber, onClose }: FragranceModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (fragrance) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      closeRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [fragrance, handleKeyDown]);

  if (!fragrance) return null;

  const whatsappMsg = `Hi, I'm interested in the "${fragrance.name}" fragrance from Alfaisal Perfumes. Can you tell me more?`;
  const whatsappUrl = whatsappNumber ? buildWhatsAppUrl(whatsappNumber, whatsappMsg) : '';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${fragrance.name} details`}
    >
      <div className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-xl bg-white shadow-xl border border-[var(--color-borders)]">
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 text-[var(--color-primary-text)] shadow-sm transition-colors hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-[var(--color-surface)]">
          <Image
            src={fragrance.imageUrl || placeholderImage(600, 450, fragrance.name, 'bottle')}
            alt={fragrance.name}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 md:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent-dark)]">
              {fragrance.family}
            </span>
            <span className="rounded-md bg-[var(--color-surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-secondary-text)]">
              {fragrance.gender}
            </span>
          </div>

          <h2 className="mb-2 font-serif text-2xl font-medium text-[var(--color-primary-text)] md:text-3xl">
            {fragrance.name}
          </h2>

          {fragrance.description && (
            <p className="mb-6 text-sm leading-relaxed text-[var(--color-secondary-text)]">
              {fragrance.description}
            </p>
          )}

          {/* Notes Pyramid */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xs font-medium tracking-wider uppercase text-[var(--color-accent-dark)]">
              Fragrance Pyramid
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Top Notes', value: fragrance.notesTop, icon: Sparkles },
                { label: 'Heart Notes', value: fragrance.notesHeart, icon: Heart },
                { label: 'Base Notes', value: fragrance.notesBase, icon: Compass },
              ].map(
                (note) => {
                  const Icon = note.icon;
                  return (
                    note.value && (
                      <div
                        key={note.label}
                        className="rounded-lg border border-[var(--color-borders)] bg-[var(--color-surface)]/40 p-3.5"
                      >
                        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent-dark)]">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{note.label}</span>
                        </div>
                        <p className="text-xs text-[var(--color-primary-text)] leading-relaxed">{note.value}</p>
                      </div>
                    )
                  );
                }
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/contact?fragrance=${encodeURIComponent(fragrance.name)}`}
              className="inline-flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-xs font-medium tracking-wide uppercase text-white transition-colors hover:bg-[var(--color-accent-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
            >
              Request This Fragrance
            </Link>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#25D366] px-5 py-2.5 text-xs font-medium tracking-wide uppercase text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
              >
                Ask on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
