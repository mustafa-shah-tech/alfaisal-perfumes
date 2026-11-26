'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { useSettings } from '@/hooks/useSettings';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { settings } = useSettings();
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-primary-text)] font-sans selection:bg-[var(--color-accent)] selection:text-white">
      <Header settings={settings} />
      <main className={`flex-1 ${isHome ? 'pt-0' : 'pt-24 md:pt-28'}`}>
        {children}
      </main>
      <Footer settings={settings} />
      <WhatsAppButton
        whatsappNumber={settings.whatsapp}
        defaultMessage={settings.whatsappMessage}
      />
    </div>
  );
}
