'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { useSettings } from '@/hooks/useSettings';
import { NAV_LINKS } from '@/lib/constants';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { settings } = useSettings();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close push drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on Escape and prevent background scroll when drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const logoText = settings.logo?.text || 'ALFAISAL';

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#14110F]">
      {/* Mobile Push Side Navigation Drawer */}
      <aside
        id="mobile-push-nav"
        aria-label="Mobile Navigation"
        aria-hidden={!mobileMenuOpen}
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-40 w-[272px] bg-[#14110F] text-[#FAF7F2] border-l border-[#2A2520] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#2A2520] flex items-center justify-between">
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold tracking-[0.2em] text-[#FAF7F2]">
              {logoText}
            </span>
            <span className="font-sans text-[9px] tracking-[0.3em] text-[var(--color-accent)] uppercase mt-1">
              PERFUMES
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#A0988D] hover:text-white hover:bg-[#201C19] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className={`min-h-[44px] flex items-center px-3.5 rounded-lg text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'bg-[var(--color-accent)] text-white font-semibold'
                    : 'text-[#D1C9BE] hover:bg-[#201C19] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-[#2A2520] space-y-2.5">
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            tabIndex={mobileMenuOpen ? 0 : -1}
            className="w-full min-h-[44px] flex items-center justify-center rounded-lg text-xs font-medium tracking-wide uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] transition-colors"
          >
            Get a Free Quote
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            tabIndex={mobileMenuOpen ? 0 : -1}
            className="w-full min-h-[36px] flex items-center justify-center text-xs text-[#A0988D] hover:text-white transition-colors"
          >
            Admin Portal →
          </Link>
        </div>
      </aside>

      {/* Pushed Page Container */}
      <div
        className={`relative z-10 min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-primary-text)] font-sans selection:bg-[var(--color-accent)] selection:text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileMenuOpen ? '-translate-x-[272px] lg:translate-x-0 shadow-2xl' : ''
        }`}
      >
        {/* Tap-to-close overlay on pushed content */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/25"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <Header
          settings={settings}
          mobileMenuOpen={mobileMenuOpen}
          onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />
        <main className={`flex-1 ${isHome ? 'pt-0' : 'pt-20 sm:pt-24 md:pt-28'}`}>
          {children}
        </main>
        <Footer settings={settings} />
        <WhatsAppButton
          whatsappNumber={settings.whatsapp}
          defaultMessage={settings.whatsappMessage}
        />
      </div>
    </div>
  );
}
