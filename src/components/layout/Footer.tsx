'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SiteSettings } from '@/types';
import { NAV_LINKS } from '@/lib/constants';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const logoConfig = settings.logo || { type: 'text', text: 'ALFAISAL' };

  return (
    <footer className="bg-[var(--color-dark-bg)] text-[#D1C9BE] border-t border-[#2A2520] pt-12 sm:pt-16 pb-10 sm:pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 pb-10 sm:pb-14 border-b border-[#2A2520]">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {logoConfig.type === 'image' && logoConfig.imageUrl ? (
                <div className="relative h-10 w-40">
                  <Image
                    src={logoConfig.imageUrl}
                    alt={settings.businessName || 'Alfaisal Perfumes'}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--color-accent)]/40 bg-[#14110F]">
                    <Image
                      src="/images/alfaisal-perfume-logo.jpeg"
                      alt={settings.businessName || 'Alfaisal Perfumes'}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#FAF7F2] group-hover:text-[var(--color-accent)] transition-colors">
                      {logoConfig.text || 'ALFAISAL'}
                    </span>
                    <span className="font-sans text-[10px] tracking-[0.35em] text-[var(--color-accent)] uppercase mt-0.5">
                      PERFUMES
                    </span>
                  </div>
                </>
              )}
            </Link>
            <p className="text-sm text-[#A0988D] leading-relaxed max-w-sm">
              {settings.subHeadline ||
                'Custom-branded spray perfumes (EDP / EDT) crafted for visionary businesses, boutiques, and entrepreneurs.'}
            </p>
            <div className="pt-2 text-xs text-[#827A70] flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{settings.address || 'Malakand, Khyber Pakhtunkhwa (KPK), Pakistan'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wider text-[#FAF7F2] uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A0988D] hover:text-[var(--color-accent)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Private Label Offerings */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wider text-[#FAF7F2] uppercase mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A0988D]">
              <li>
                <Link href="/services" className="hover:text-[var(--color-accent)] transition-colors">
                  Private Label EDP / EDT
                </Link>
              </li>
              <li>
                <Link href="/fragrances" className="hover:text-[var(--color-accent)] transition-colors">
                  Fragrance Selection Library
                </Link>
              </li>
              <li>
                <Link href="/packaging" className="hover:text-[var(--color-accent)] transition-colors">
                  Custom Bottle & Box Design
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[var(--color-accent)] transition-colors">
                  Low MOQ Brand Launch
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--color-accent)] transition-colors">
                  Request Sample Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wider text-[#FAF7F2] uppercase mb-4">
              Direct Inquiries
            </h4>
            <div className="space-y-3 text-sm text-[#A0988D]">
              {settings.email && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </div>
              )}
              {settings.phone && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings.whatsapp && (
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-accent)] font-semibold text-xs">WA:</span>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    +{settings.whatsapp.replace(/[^0-9]/g, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Social links */}
            {settings.socialLinks && Object.keys(settings.socialLinks).length > 0 && (
              <div className="pt-4 flex items-center space-x-3">
                {settings.socialLinks.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-lg bg-[#201C19] border border-[#2D2723] flex items-center justify-center text-[#A0988D] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {settings.socialLinks.facebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-lg bg-[#201C19] border border-[#2D2723] flex items-center justify-center text-[#A0988D] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                )}
                {settings.socialLinks.tiktok && (
                  <a
                    href={settings.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-lg bg-[#201C19] border border-[#2D2723] flex items-center justify-center text-[#A0988D] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-colors"
                    aria-label="TikTok"
                  >
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.28 6.28 0 0 0 1.86-4.48V8.71a8.28 8.28 0 0 0 4.84 1.55v-3.57a4.85 4.85 0 0 1-.93 0z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#827A70] gap-4 text-center sm:text-left">
          <p>
            {settings.footerText || `© ${currentYear} Alfaisal Perfumes. All rights reserved.`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="hover:text-[#D1C9BE] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#D1C9BE] transition-colors">
              Terms of Service
            </Link>
            <Link href="/admin/login" className="hover:text-[var(--color-accent)] transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
