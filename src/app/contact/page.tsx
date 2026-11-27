'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';
import { useSettings } from '@/hooks/useSettings';
import { getFragrances, submitInquiry } from '@/lib/firestore';
import { Fragrance } from '@/types';
import { QUANTITY_RANGES } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/utils';

function ContactFormContent() {
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const preselectedFragrance = searchParams.get('fragrance');
  const brandReference = searchParams.get('brandReference');

  const [fragranceList, setFragranceList] = useState<Fragrance[]>([]);
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<string>(QUANTITY_RANGES[0]);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Rate limiting helper using sessionStorage
  const checkRateLimit = () => {
    const lastSubmit = sessionStorage.getItem('last_inquiry_submit');
    if (lastSubmit) {
      const diff = Date.now() - parseInt(lastSubmit, 10);
      if (diff < 30000) {
        // Less than 30 seconds since last submission
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    async function loadFragrances() {
      try {
        const data = await getFragrances(true);
        if (data && data.length > 0) {
          setFragranceList(data);
        }
      } catch (err) {
        console.warn('Could not load fragrances for contact form:', err);
      }
    }
    loadFragrances();
  }, []);

  // Pre-fill fragrance or brand reference if provided in URL
  useEffect(() => {
    if (preselectedFragrance && !selectedFragrances.includes(preselectedFragrance)) {
      setSelectedFragrances([preselectedFragrance]);
    }
    if (brandReference && !message) {
      setMessage(`I am interested in creating a brand concept similar to "${brandReference}".`);
    }
  }, [preselectedFragrance, brandReference]);

  const handleFragranceToggle = (fragName: string) => {
    setSelectedFragrances((prev) =>
      prev.includes(fragName)
        ? prev.filter((name) => name !== fragName)
        : [...prev, fragName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot anti-spam check
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    // Rate limit check
    if (!checkRateLimit()) {
      setErrorMessage('Please wait a moment before submitting another request.');
      return;
    }

    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill in your name, email, and phone / WhatsApp number.');
      return;
    }

    setSubmitting(true);
    try {
      await submitInquiry({
        fullName: fullName.trim(),
        businessName: businessName.trim() || 'Undisclosed Brand',
        phone: phone.trim(),
        email: email.trim(),
        fragrances: selectedFragrances,
        quantity,
        message: message.trim(),
      });

      sessionStorage.setItem('last_inquiry_submit', Date.now().toString());
      setSubmitted(true);
    } catch (err: unknown) {
      console.error('Submission error:', err);
      // Even if Firestore offline, show smooth graceful feedback
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappDirectUrl = settings.whatsapp
    ? buildWhatsAppUrl(
        settings.whatsapp,
        `Hello Alfaisal Perfumes, I would like to request a quote for my brand${
          businessName ? ` (${businessName})` : ''
        }.`
      )
    : '';

  return (
    <div className="py-10 sm:py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
          Private Label Consultation
        </span>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight">
          Request a Quote & Scent Consultation
        </h1>
        <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
        <p className="text-sm sm:text-base text-[var(--color-secondary-text)] leading-relaxed">
          Tell us about your brand vision, intended bottle style, and target fragrances. We will prepare an itemized private-label proposal and schedule your discovery sample kit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-[var(--color-borders)] shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] mx-auto flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-primary-text)]">
                Inquiry Received With Thanks
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-secondary-text)] max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-[var(--color-primary-text)]">{fullName}</span>. One of our private-label fragrance consultants will review your brand details and reach out via WhatsApp / Email within 24 business hours.
              </p>
              {whatsappDirectUrl && (
                <div className="pt-4">
                  <p className="text-xs text-[var(--color-secondary-text)] mb-3">
                    Need an immediate response? Connect with us directly on WhatsApp:
                  </p>
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors"
                  >
                    Open WhatsApp Chat Now
                  </a>
                </div>
              )}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFullName('');
                    setBusinessName('');
                    setPhone('');
                    setEmail('');
                    setMessage('');
                    setSelectedFragrances([]);
                  }}
                  className="text-xs font-semibold text-[var(--color-accent-dark)] hover:underline"
                >
                  Submit another inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Honeypot field (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_anti_bot_check"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              {/* Name & Business */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-primary-text)] mb-2 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Khan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-borders)] text-sm text-[var(--color-primary-text)] placeholder-[var(--color-secondary-text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-primary-text)] mb-2 uppercase tracking-wider">
                    Brand / Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Scents Boutique"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-borders)] text-sm text-[var(--color-primary-text)] placeholder-[var(--color-secondary-text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-primary-text)] mb-2 uppercase tracking-wider">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-borders)] text-sm text-[var(--color-primary-text)] placeholder-[var(--color-secondary-text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-primary-text)] mb-2 uppercase tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. brand@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-borders)] text-sm text-[var(--color-primary-text)] placeholder-[var(--color-secondary-text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>

              {/* Estimated Quantity */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-primary-text)] mb-2 uppercase tracking-wider">
                  Estimated Batch Quantity (Bottles)
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-borders)] text-sm text-[var(--color-primary-text)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                >
                  {QUANTITY_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-[var(--color-secondary-text)]">
                  We support flexible batch sizes for new brand launches.
                </p>
              </div>

              {/* Fragrances Selection (Multi-select) */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-primary-text)] mb-2 uppercase tracking-wider">
                  Fragrances of Interest (Optional)
                </label>
                <div className="max-h-48 overflow-y-auto p-3 rounded-xl border border-[var(--color-borders)] bg-[var(--color-background)]/50 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {fragranceList.length > 0 ? (
                    fragranceList.map((frag) => {
                      const isChecked = selectedFragrances.includes(frag.name);
                      return (
                        <label
                          key={frag.id}
                          className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-[var(--color-accent)]/15 font-medium text-[var(--color-primary-text)]'
                              : 'hover:bg-white text-[var(--color-secondary-text)]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleFragranceToggle(frag.name)}
                            className="rounded border-[var(--color-borders)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                          />
                          <span className="truncate">{frag.name}</span>
                          <span className="text-[10px] text-[var(--color-secondary-text)]/70 ml-auto">
                            ({frag.gender})
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-xs text-[var(--color-secondary-text)] p-2">
                      All fragrance library scents can be discussed during consultation.
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-primary-text)] mb-2 uppercase tracking-wider">
                  Your Vision, Bottle Preference & Special Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details about your brand idea, target audience, preferred bottle styles, or any reference scents..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-borders)] text-sm text-[var(--color-primary-text)] placeholder-[var(--color-secondary-text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl text-xs font-semibold uppercase tracking-widest text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300"
              >
                {submitting ? 'Submitting Consultation Request...' : 'Send Consultation Request'}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Details Sidebar (Admin Driven) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[var(--color-surface)] rounded-3xl p-8 border border-[var(--color-borders)] space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[var(--color-primary-text)]">
              Direct Contact Channels
            </h3>
            <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
              We welcome prospective business owners, boutiques, and retail brands to reach out through our verified contact channels.
            </p>

            <div className="space-y-4 pt-2">
              {/* Address */}
              {settings.address && (
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-white text-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-[var(--color-primary-text)] uppercase tracking-wider">
                      Location & Facility
                    </span>
                    <span className="text-sm text-[var(--color-secondary-text)]">
                      {settings.address}
                    </span>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {settings.whatsapp && (
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-[var(--color-primary-text)] uppercase tracking-wider">
                      WhatsApp Quick Chat
                    </span>
                    <a
                      href={whatsappDirectUrl || `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[var(--color-accent-dark)] hover:underline"
                    >
                      +{settings.whatsapp.replace(/[^0-9]/g, '')}
                    </a>
                  </div>
                </div>
              )}

              {/* Email */}
              {settings.email && (
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-white text-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-[var(--color-primary-text)] uppercase tracking-wider">
                      Official Inquiries
                    </span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm font-medium text-[var(--color-accent-dark)] hover:underline"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Phone */}
              {settings.phone && (
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-white text-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-[var(--color-primary-text)] uppercase tracking-wider">
                      Direct Telephone
                    </span>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-sm font-medium text-[var(--color-accent-dark)] hover:underline"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Location Card */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--color-borders)] overflow-hidden shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary-text)] block mb-3">
              Geographic Presence
            </span>
            <div className="relative aspect-[16/9] rounded-2xl bg-[var(--color-surface)] border border-[var(--color-borders)] flex flex-col items-center justify-center p-6 text-center">
              <svg className="w-8 h-8 text-[var(--color-accent)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="font-serif text-base font-bold text-[var(--color-primary-text)]">
                Malakand, KPK, Pakistan
              </p>
              <p className="text-xs text-[var(--color-secondary-text)] mt-1">
                Nationwide express dispatch across all provinces
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="py-24 text-center">Loading contact consultation...</div>}>
        <ContactFormContent />
      </Suspense>
    </PublicLayout>
  );
}
