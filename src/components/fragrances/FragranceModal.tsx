'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${fragrance.name} details`}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--color-primary-text)] shadow-sm transition-colors hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-[var(--color-surface)]">
          <Image
            src={fragrance.imageUrl || placeholderImage(600, 450, fragrance.name, 'bottle')}
            alt={fragrance.name}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-0.5 text-xs font-medium text-[var(--color-accent-dark)]">
              {fragrance.family}
            </span>
            <span className="rounded-full bg-[var(--color-dark-bg)]/10 px-3 py-0.5 text-xs font-medium text-[var(--color-secondary-text)]">
              {fragrance.gender}
            </span>
          </div>

          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--color-primary-text)] md:text-3xl">
            {fragrance.name}
          </h2>

          {fragrance.description && (
            <p className="mb-6 text-sm leading-relaxed text-[var(--color-secondary-text)]">
              {fragrance.description}
            </p>
          )}

          {/* Notes Pyramid */}
          <div className="mb-8 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              Fragrance Notes
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Top Notes', value: fragrance.notesTop, icon: '◇' },
                { label: 'Heart Notes', value: fragrance.notesHeart, icon: '◈' },
                { label: 'Base Notes', value: fragrance.notesBase, icon: '◆' },
              ].map(
                (note) =>
                  note.value && (
                    <div
                      key={note.label}
                      className="rounded-lg border border-[var(--color-borders)] bg-[var(--color-surface)]/50 p-4"
                    >
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-dark)]">
                        {note.icon} {note.label}
                      </p>
                      <p className="text-sm text-[var(--color-primary-text)]">{note.value}</p>
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/contact?fragrance=${encodeURIComponent(fragrance.name)}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Request this fragrance
            </Link>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#25D366] px-6 py-3 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Ask on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
