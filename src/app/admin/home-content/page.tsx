'use client';

import { useState, useEffect } from 'react';
import { getHomeContent, setDocument } from '@/lib/firestore';
import { HomeContent, SectionVisibility } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';

const DEFAULT_CONTENT: HomeContent = {
  heroTitle: 'Your Name. Your Scent. Your Perfume Brand.',
  heroSubtitle: 'We build your perfume business, from the first fragrance to the finished bottle.',
  heroImage: '',
  heroCtaText: 'Get a Free Quote',
  heroSecondaryCtaText: 'See How It Works',
  trustStrip: [
    { icon: '✦', text: 'Your Brand Name on Every Bottle' },
    { icon: '◈', text: 'Premium Concentration (EDP / EDT)' },
    { icon: '❖', text: 'Low Minimum Order Quantities' },
    { icon: '✧', text: 'Fast, Personal Turnkey Service' },
  ],
  whatWeDoTitle: 'Private-Label Spray Perfume Manufacturing',
  whatWeDoText:
    'Alfaisal Perfumes creates custom-branded spray perfumes (EDP / EDT) for other businesses. You bring your brand name, and we manufacture the perfumes under that brand.',
  whyChooseTitle: 'Why Visionary Brands Partner With Alfaisal',
  whyChooseItems: [
    { title: 'Artisan Oil Formulations', description: 'Masterfully blended oils with long-lasting sillage.', icon: '01' },
    { title: 'Turnkey Hardware & Packaging', description: 'Bottles, foil-stamped labels, and rigid boxes.', icon: '02' },
    { title: 'Low Startup MOQs', description: 'Test your market without crippling upfront capital.', icon: '03' },
    { title: 'Authentic Local Craft', description: 'Formulated and crafted in Malakand, KPK, Pakistan.', icon: '04' },
  ],
  ctaTitle: 'Ready to Launch Your Own Signature Perfume Brand?',
  ctaText: 'Whether you run a boutique, fashion salon, or are launching a new consumer brand, we make custom fragrance manufacturing straightforward.',
  sectionVisibility: {
    trustStrip: true,
    whatWeDo: true,
    process: true,
    featuredFragrances: true,
    whyChoose: true,
    portfolio: true,
    testimonials: true,
    cta: true,
  },
};

export default function AdminHomeContentPage() {
  const [content, setContent] = useState<HomeContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getHomeContent();
        if (data) {
          setContent({
            ...DEFAULT_CONTENT,
            ...data,
            sectionVisibility: {
              ...DEFAULT_CONTENT.sectionVisibility,
              ...(data.sectionVisibility || {}),
            },
          });
        }
      } catch (err) {
        console.warn('Could not load home content:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggleVisibility = (sectionKey: keyof SectionVisibility) => {
    setContent((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [sectionKey]: !prev.sectionVisibility[sectionKey],
      },
    }));
  };

  const handleTrustStripChange = (index: number, text: string) => {
    const updated = [...(content.trustStrip || [])];
    updated[index] = { ...updated[index], text };
    setContent({ ...content, trustStrip: updated });
  };

  const handleAddTrustStrip = () => {
    setContent({
      ...content,
      trustStrip: [...(content.trustStrip || []), { icon: '✦', text: 'New Highlight' }],
    });
  };

  const handleRemoveTrustStrip = (index: number) => {
    const updated = content.trustStrip.filter((_, i) => i !== index);
    setContent({ ...content, trustStrip: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast('');

    try {
      await setDocument('homeContent', 'main', content);
      setToast('Home page content updated successfully!');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Home content save error:', err);
      setToast('Failed to save home content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#6B6459]">Loading content...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Home Page Content & Sections
          </h2>
          <p className="text-xs text-[#6B6459]">
            Edit headlines, banner images, and toggle section visibility.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Home Content'}
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Section Visibility Toggles */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Section Visibility Toggles
        </h3>
        <p className="text-xs text-[#6B6459]">
          Turn sections on or off on the public home page with one click.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {[
            { key: 'trustStrip', label: 'Trust Strip' },
            { key: 'whatWeDo', label: 'What We Do' },
            { key: 'process', label: 'Our Process' },
            { key: 'featuredFragrances', label: 'Featured Scents' },
            { key: 'whyChoose', label: 'Why Choose Us' },
            { key: 'portfolio', label: 'Portfolio Preview' },
            { key: 'testimonials', label: 'Testimonials' },
            { key: 'cta', label: 'Final Call to Action' },
          ].map(({ key, label }) => {
            const secKey = key as keyof SectionVisibility;
            const isVisible = content.sectionVisibility?.[secKey] !== false;
            return (
              <label
                key={key}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  isVisible
                    ? 'bg-[#B08D57]/10 border-[#B08D57] text-[#8F6F3E]'
                    : 'bg-[#FAF7F2] border-[#E3DACB] text-[#6B6459]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => handleToggleVisibility(secKey)}
                  className="rounded border-[#E3DACB] text-[#B08D57] focus:ring-[#B08D57]"
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Hero Section Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Hero Section
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Hero Headline
            </label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Hero Sub-Headline
            </label>
            <textarea
              rows={2}
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Primary Button Label
              </label>
              <input
                type="text"
                value={content.heroCtaText}
                onChange={(e) => setContent({ ...content, heroCtaText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={content.heroSecondaryCtaText}
                onChange={(e) => setContent({ ...content, heroSecondaryCtaText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
              />
            </div>
          </div>

          <ImageUpload
            label="Hero Background Image (Optional)"
            value={content.heroImage}
            onChange={(url) => setContent({ ...content, heroImage: url })}
            folder="hero"
          />
        </div>
      </div>

      {/* Trust Strip Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E3DACB] pb-3">
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
            Trust Strip Highlights
          </h3>
          <button
            type="button"
            onClick={handleAddTrustStrip}
            className="text-xs font-semibold uppercase tracking-wider text-[#B08D57] hover:underline"
          >
            + Add Highlight
          </button>
        </div>

        <div className="space-y-3">
          {content.trustStrip?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-sm text-[#B08D57] font-mono w-6 text-center">
                {item.icon}
              </span>
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleTrustStripChange(idx, e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-[#E3DACB] text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
              />
              <button
                type="button"
                onClick={() => handleRemoveTrustStrip(idx)}
                className="px-2.5 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* What We Do Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          &ldquo;What We Do&rdquo; Section
        </h3>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={content.whatWeDoTitle}
            onChange={(e) => setContent({ ...content, whatWeDoTitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Description Text
          </label>
          <textarea
            rows={3}
            value={content.whatWeDoText}
            onChange={(e) => setContent({ ...content, whatWeDoText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>
      </div>

      {/* Final Call to Action Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Final Call to Action Band
        </h3>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            CTA Headline
          </label>
          <input
            type="text"
            value={content.ctaTitle}
            onChange={(e) => setContent({ ...content, ctaTitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            CTA Subtext
          </label>
          <textarea
            rows={2}
            value={content.ctaText}
            onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-md disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save All Home Changes'}
        </button>
      </div>
    </form>
  );
}
