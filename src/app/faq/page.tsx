'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { getFAQs } from '@/lib/firestore';
import { FAQ } from '@/types';

const SEED_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is private-label perfume manufacturing?',
    answer:
      'Private-label manufacturing means we formulate, bottle, label, and package luxury perfumes under your brand name. You provide your brand identity and vision, and Alfaisal Perfumes handles the formulation, hardware sourcing, and production. The finished perfume carries your company name and branding exclusively.',
    sortOrder: 1,
    visible: true,
  },
  {
    id: 'faq-2',
    question: 'What is your Minimum Order Quantity (MOQ)?',
    answer:
      'We understand that emerging brands and boutiques need flexible order sizes. Our minimum order quantities are designed to be accessible for startup launches. Please contact us with your bottle style and packaging preferences for our current introductory MOQ specifications.',
    sortOrder: 2,
    visible: true,
  },
  {
    id: 'faq-3',
    question: 'How long does the entire production process take?',
    answer:
      'Standard turnarounds generally range from 2 to 4 weeks depending on bottle style selection, custom label printing, and proper maceration time to ensure maximum scent stability. Expedited schedules can be discussed during your consultation.',
    sortOrder: 3,
    visible: true,
  },
  {
    id: 'faq-4',
    question: 'Can I test fragrance samples before placing a full batch order?',
    answer:
      'Yes, sample approval is an essential milestone in our 5-step process. Once we discuss your brand profile, we prepare and dispatch a fragrance sample kit for your evaluation. Full bulk manufacturing commences only after you have personally approved the fragrance and bottle presentation.',
    sortOrder: 4,
    visible: true,
  },
  {
    id: 'faq-5',
    question: 'Do you provide label and box packaging design assistance?',
    answer:
      'Yes. If you have an existing logo or brand colors, our production team assists with technical die-lines, label material selection (foil stamping, matte, gloss, textured), and luxury presentation box layout so your product meets international retail visual standards.',
    sortOrder: 5,
    visible: true,
  },
  {
    id: 'faq-6',
    question: 'How is the pricing calculated for custom perfume orders?',
    answer:
      'Pricing in PKR is determined by three transparent factors: your chosen perfume oil concentration (EDP / EDT), the selected bottle and cap hardware, and your total batch quantity. Larger production runs benefit from economies of scale. Contact us for a detailed itemized quote.',
    sortOrder: 6,
    visible: true,
  },
  {
    id: 'faq-7',
    question: 'What concentration of perfume oil do you use?',
    answer:
      'We specialize in Eau de Parfum (EDP) formulations with generous fragrance oil concentrations (typically 18% to 25%), guaranteeing superior projection, longevity, and skin-safe performance. Lighter Eau de Toilette (EDT) or intense Extrait concentrations are also available upon request.',
    sortOrder: 7,
    visible: true,
  },
  {
    id: 'faq-8',
    question: 'Where is Alfaisal Perfumes located, and do you ship across Pakistan?',
    answer:
      'We are headquartered in Malakand, Khyber Pakhtunkhwa (KPK), Pakistan. We safely package and dispatch finished private-label consignments nationwide via insured express logistics to Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, and all other cities.',
    sortOrder: 8,
    visible: true,
  },
  {
    id: 'faq-9',
    question: 'Can I provide my own bottles or custom packaging?',
    answer:
      'Yes. While we offer a full catalog of ready-to-brand bottles, pumps, and rigid gift boxes, clients with their own proprietary bottles or imported glass are welcome to supply their hardware for our filling, crimping, and packaging service.',
    sortOrder: 9,
    visible: true,
  },
  {
    id: 'faq-10',
    question: 'How do I start building my brand with Alfaisal Perfumes?',
    answer:
      'Getting started is straightforward: submit a quote request on our Contact page or message us directly on WhatsApp with your brand concept. One of our private-label perfume advisors will contact you to discuss scent directions and arrange your discovery samples.',
    sortOrder: 10,
    visible: true,
  },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(SEED_FAQS);
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'faq-1': true, 'faq-2': true });

  useEffect(() => {
    async function load() {
      try {
        const data = await getFAQs(true);
        if (data && data.length > 0) {
          setFaqs(data);
        }
      } catch (err) {
        console.warn('Using seed FAQs:', err);
      }
    }
    load();
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PublicLayout>
      <div className="py-10 sm:py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
            Everything You Need To Know
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
          <p className="text-sm sm:text-base text-[var(--color-secondary-text)] leading-relaxed">
            Transparent answers regarding minimum order quantities, production timelines, fragrance formulation, and custom bottle packaging.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3 sm:space-y-4 mb-14 sm:mb-20">
          {faqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[var(--color-borders)] overflow-hidden transition-all duration-200 shadow-sm hover:shadow"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-4 py-4 sm:px-6 sm:py-5 min-h-[44px] text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-inset"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg sm:text-xl font-semibold text-[var(--color-primary-text)]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[var(--color-surface)] flex items-center justify-center flex-shrink-0 text-[var(--color-accent-dark)] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[var(--color-accent)] text-white' : ''
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[var(--color-secondary-text)] leading-relaxed border-t border-[var(--color-borders)]/40 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-[var(--color-surface)] rounded-3xl p-8 sm:p-10 border border-[var(--color-borders)] text-center">
          <h3 className="font-serif text-2xl font-bold text-[var(--color-primary-text)] mb-2">
            Have a Specific Question About Your Brand?
          </h3>
          <p className="text-sm text-[var(--color-secondary-text)] max-w-md mx-auto mb-6">
            Our team is available to discuss your exact formulations, timeline, and packaging requirements directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] transition-colors shadow-sm"
            >
              Send Us a Message
            </Link>
            <Link
              href="/services"
              className="px-8 py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-[var(--color-primary-text)] bg-white border border-[var(--color-borders)] hover:bg-[var(--color-background)] transition-colors"
            >
              Learn More About Services
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
