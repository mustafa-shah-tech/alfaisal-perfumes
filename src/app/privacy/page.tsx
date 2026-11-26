'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { getLegal } from '@/lib/firestore';
import { LegalPage } from '@/types';

const DEFAULT_PRIVACY: LegalPage = {
  title: 'Privacy Policy',
  content: `
    <h3>1. Information We Collect</h3>
    <p>Alfaisal Perfumes collects information when you request a custom quote, consultation, or sample kit through our website. This includes your name, business/brand name, email address, phone/WhatsApp number, estimated quantity requirements, and any notes regarding your fragrance concepts.</p>

    <h3>2. How We Use Your Information</h3>
    <p>Your details are used strictly to communicate with you regarding your private-label manufacturing inquiry, prepare itemized quotations, coordinate sample shipments, and provide ongoing commercial client support. We do not sell, rent, or trade your contact details with any third parties.</p>

    <h3>3. Intellectual Property & Formulation Confidentiality</h3>
    <p>We hold our clients' brand names, label artworks, and proprietary fragrance specifications in the strictest confidence. Custom perfume briefs and private discussions remain protected trade secrets between your business and Alfaisal Perfumes.</p>

    <h3>4. Cookies and Analytical Data</h3>
    <p>Our website may utilize lightweight technical cookies to remember your session preferences and ensure proper form submission functionality. No invasive advertising tracking cookies are deployed.</p>

    <h3>5. Contacting Us</h3>
    <p>If you have questions regarding our privacy practices or wish to update or delete your contact records from our inquiry database, please reach out to our team in Malakand, KPK, Pakistan.</p>
  `,
};

export default function PrivacyPage() {
  const [data, setData] = useState<LegalPage>(DEFAULT_PRIVACY);

  useEffect(() => {
    async function load() {
      try {
        const doc = await getLegal('privacy');
        if (doc && doc.content) {
          setData(doc);
        }
      } catch (err) {
        console.warn('Using default privacy policy:', err);
      }
    }
    load();
  }, []);

  return (
    <PublicLayout>
      <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight mb-4">
          {data.title}
        </h1>
        <div className="w-16 h-0.5 bg-[var(--color-accent)] mb-8" />
        <div
          className="prose prose-stone max-w-none text-[var(--color-secondary-text)] leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    </PublicLayout>
  );
}
