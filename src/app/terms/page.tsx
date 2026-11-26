'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { getLegal } from '@/lib/firestore';
import { LegalPage } from '@/types';

const DEFAULT_TERMS: LegalPage = {
  title: 'Terms & Conditions of Service',
  content: `
    <h3>1. Scope of Private-Label Manufacturing</h3>
    <p>Alfaisal Perfumes operates as a custom private-label fragrance manufacturer. We produce spray perfumes (EDP / EDT), bottles, and packaging according to agreed commercial specifications for registered businesses, boutiques, and entrepreneurs. Our website serves as an informational and quote-request portal; it is not an e-commerce direct retail store.</p>

    <h3>2. Quotations and Production Orders</h3>
    <p>All quotes provided by Alfaisal Perfumes are denominated in PKR (or designated international currency for export inquiries) and remain valid for the period stated on the formal proposal. Production begins following mutual sign-off on fragrance samples, bottle specifications, and payment of the agreed production advance.</p>

    <h3>3. Client Branding & Trademarks</h3>
    <p>Clients are solely responsible for ensuring they possess legal rights, copyright, and trademark clearance for any brand name, logo, typography, or packaging design provided to Alfaisal Perfumes for printing. Alfaisal Perfumes does not manufacture or duplicate counterfeit or unauthorized replica brands.</p>

    <h3>4. Sample Approval</h3>
    <p>We require written or digital approval of olfactory samples and physical packaging proofs prior to initiating full-batch factory runs. Once client approval is given, mass production proceeds according to approved sample specifications.</p>

    <h3>5. Delivery & Transit</h3>
    <p>Consignments are securely packed and dispatched from our facility in Malakand, KPK, Pakistan via recognized logistics carriers. Risk of transit is governed by the agreed commercial dispatch terms.</p>

    <h3>6. Governing Law</h3>
    <p>These terms and all commercial agreements entered into with Alfaisal Perfumes are governed by the applicable laws of Khyber Pakhtunkhwa and the Islamic Republic of Pakistan.</p>
  `,
};

export default function TermsPage() {
  const [data, setData] = useState<LegalPage>(DEFAULT_TERMS);

  useEffect(() => {
    async function load() {
      try {
        const doc = await getLegal('terms');
        if (doc && doc.content) {
          setData(doc);
        }
      } catch (err) {
        console.warn('Using default terms:', err);
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
