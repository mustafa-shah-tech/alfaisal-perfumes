'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SiteSettings } from '@/types';
import { NAV_LINKS } from '@/lib/constants';

interface HeaderProps {
  settings: SiteSettings;
}

export default function Header({ settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const logoConfig = settings.logo || { type: 'text', text: 'ALFAISAL' };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--color-background)]/90 backdrop-blur-md shadow-sm border-b border-[var(--color-borders)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex flex-col items-start focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded">
            {logoConfig.type === 'image' && logoConfig.imageUrl ? (
              <div className="relative h-10 w-40">
                <Image
                  src={logoConfig.imageUrl}
                  alt={settings.businessName || 'Alfaisal Perfumes'}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[var(--color-primary-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {logoConfig.text || 'ALFAISAL'}
                </span>
                <span className="font-sans text-[10px] tracking-[0.35em] text-[var(--color-accent)] uppercase mt-0.5 font-medium">
                  PERFUMES
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-7">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-[var(--color-accent)] font-semibold'
                      : 'text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)] rounded-full animate-fadeIn" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Mobile Menu Trigger */}
          <div className="flex items-center space-x-4">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium tracking-wide uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] transition-colors duration-150"
            >
              Get a Free Quote
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--color-primary-text)] hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-black/40 backdrop-blur-sm z-30 animate-fadeIn">
          <div className="bg-[var(--color-background)] border-b border-[var(--color-borders)] px-6 py-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <nav className="flex flex-col space-y-4">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium py-2 px-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-semibold'
                        : 'text-[var(--color-primary-text)] hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-[var(--color-borders)] flex flex-col space-y-3">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-xs font-medium tracking-wide uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] transition-colors"
                >
                  Get a Free Quote
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] py-1"
                >
                  Admin Portal →
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
