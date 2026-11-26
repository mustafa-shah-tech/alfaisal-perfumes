'use client';

import { useState, useEffect } from 'react';
import { getDocument, setDocument } from '@/lib/firestore';
import { PageSEO } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';

const PAGES = [
  { slug: 'home', label: 'Home Page' },
  { slug: 'services', label: 'Services Page' },
  { slug: 'fragrances', label: 'Fragrances Page' },
  { slug: 'packaging', label: 'Packaging Page' },
  { slug: 'portfolio', label: 'Portfolio Page' },
  { slug: 'about', label: 'About Page' },
  { slug: 'faq', label: 'FAQ Page' },
  { slug: 'contact', label: 'Contact / Quote Page' },
];

export default function AdminSEOPage() {
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [seo, setSeo] = useState<PageSEO>({
    pageSlug: 'home',
    title: 'Alfaisal Perfumes — Custom Private Label Perfumes',
    metaDescription: 'Crafting private-label spray perfumes (EDP / EDT) for boutiques, retailers, and entrepreneurs across Pakistan.',
    ogImage: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getDocument<PageSEO>('seo', selectedSlug);
        if (data) {
          setSeo(data);
        } else {
          setSeo({
            pageSlug: selectedSlug,
            title: `Alfaisal Perfumes — ${selectedSlug.toUpperCase()}`,
            metaDescription: 'Custom private-label perfume manufacturing in Malakand, KPK, Pakistan.',
            ogImage: '',
          });
        }
      } catch (err) {
        console.warn('Load SEO error:', err);
      }
    }
    load();
  }, [selectedSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast('');

    try {
      await setDocument('seo', selectedSlug, seo);
      setToast(`SEO metadata for ${selectedSlug} saved!`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Save SEO error:', err);
      setToast('Failed to save SEO metadata.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Search Engine Optimization (SEO)
          </h2>
          <p className="text-xs text-[#6B6459]">
            Configure custom Google search titles, descriptions, and social share cards per page.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Page SEO'}
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E3DACB]">
        {PAGES.map((page) => (
          <button
            key={page.slug}
            type="button"
            onClick={() => setSelectedSlug(page.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSlug === page.slug
                ? 'bg-[#B08D57] text-white shadow-sm'
                : 'text-[#6B6459] hover:bg-white'
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Editor Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Page Title Tag
          </label>
          <input
            type="text"
            value={seo.title}
            onChange={(e) => setSeo({ ...seo, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
          <span className="text-[10px] text-[#6B6459] mt-1 block">
            Recommended length: 50–60 characters. Current: {seo.title.length} chars
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Meta Description
          </label>
          <textarea
            rows={3}
            value={seo.metaDescription}
            onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
          <span className="text-[10px] text-[#6B6459] mt-1 block">
            Recommended length: 140–160 characters. Current: {seo.metaDescription.length} chars
          </span>
        </div>

        <ImageUpload
          label="Open Graph (Social Share Card Image)"
          value={seo.ogImage}
          onChange={(url) => setSeo({ ...seo, ogImage: url })}
          folder="seo"
        />

        {/* SERP Search Result Preview */}
        <div className="pt-4 border-t border-[#E3DACB]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6459] block mb-3">
            Google Search Snippet Preview
          </span>
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E3DACB] space-y-1">
            <span className="text-xs text-[#202124] block truncate">
              https://alfaisalperfumes.com/{selectedSlug === 'home' ? '' : selectedSlug}
            </span>
            <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
              {seo.title}
            </h4>
            <p className="text-xs text-[#4d5156] line-clamp-2">
              {seo.metaDescription}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
