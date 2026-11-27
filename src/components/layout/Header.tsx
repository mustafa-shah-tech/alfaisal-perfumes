'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SiteSettings } from '@/types';
import { NAV_LINKS } from '@/lib/constants';

interface HeaderProps {
  settings: SiteSettings;
  mobileMenuOpen?: boolean;
  onMenuToggle?: () => void;
}

export default function Header({ settings, mobileMenuOpen = false, onMenuToggle }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoConfig = settings.logo || { type: 'text', text: 'ALFAISAL' };
  const isHome = pathname === '/';
  const overDarkHero = isHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--color-background)]/95 backdrop-blur-md shadow-sm border-b border-[var(--color-borders)] py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded">
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
              <>
                <div className="relative h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--color-accent)]/40 bg-[#14110F]">
                  <Image
                    src="/images/alfaisal-perfume-logo.jpeg"
                    alt={settings.businessName || 'Alfaisal Perfumes'}
                    fill
                    sizes="44px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span
                    className={`font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] transition-colors ${
                      overDarkHero
                        ? 'text-[#FAF7F2] group-hover:text-[var(--color-accent)]'
                        : 'text-[var(--color-primary-text)] group-hover:text-[var(--color-accent)]'
                    }`}
                  >
                    {logoConfig.text || 'ALFAISAL'}
                  </span>
                  <span className="font-sans text-[10px] tracking-[0.35em] text-[var(--color-accent)] uppercase mt-0.5 font-medium">
                    PERFUMES
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs xl:text-sm font-medium tracking-wide transition-colors duration-200 relative py-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[var(--color-accent)] font-semibold'
                      : overDarkHero
                      ? 'text-[#D1C9BE] hover:text-white'
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
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 min-h-[40px] rounded-lg text-xs font-medium tracking-wide uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] transition-colors duration-150 whitespace-nowrap"
            >
              Get a Free Quote
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={onMenuToggle}
              className={`lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
                overDarkHero
                  ? 'text-[#FAF7F2] hover:bg-white/10'
                  : 'text-[var(--color-primary-text)] hover:bg-[var(--color-surface)]'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-push-nav"
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
    </header>
  );
}
