'use client';

import { useState, useEffect } from 'react';
import { getAbout, setDocument } from '@/lib/firestore';
import { AboutContent } from '@/types';

const DEFAULT_ABOUT: AboutContent = {
  title: 'Artisan Perfumery Meets Commercial Excellence',
  story: `Alfaisal Perfumes was founded with a singular conviction: exceptional private-label fragrance manufacturing should be accessible to visionary entrepreneurs, boutiques, salons, and established fashion houses without requiring astronomical minimum orders or foreign supply chain nightmares.

Rooted in Malakand, Khyber Pakhtunkhwa (KPK), our workshop blends the age-old heritage of Eastern olfactory traditions with contemporary European formulation standards. We partner with passionate brand owners across Pakistan and beyond.`,
  mission:
    'To be Pakistan’s most trusted and prestigious private-label perfume manufacturing partner, turning entrepreneurial fragrance visions into world-class consumer products.',
  values: [
    { title: 'Uncompromised Oil Quality', description: 'High concentration EDP ratings and exceptional skin-safe longevity.' },
    { title: 'Artisan Craftsmanship', description: 'Hand inspection of every flacon, pump, and box.' },
    { title: 'Empowering Local Brands', description: 'Lowering barriers to entry for Pakistani entrepreneurs.' },
    { title: 'Confidentiality & Integrity', description: 'Strict protection of proprietary brand client formulations.' },
  ],
  locationText:
    'Proudly based in Malakand, Khyber Pakhtunkhwa (KPK), Pakistan. From the serene valleys of KPK, we blend and dispatch custom private-label fragrance consignments to clients throughout Islamabad, Lahore, Karachi, Peshawar, and across the nation.',
  images: [],
};

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getAbout();
        if (data) setAbout({ ...DEFAULT_ABOUT, ...data });
      } catch (err) {
        console.warn('Load about error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleValueChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...(about.values || [])];
    updated[index] = { ...updated[index], [field]: value };
    setAbout({ ...about, values: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast('');

    try {
      await setDocument('about', 'main', about);
      setToast('About page content saved successfully!');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Save about error:', err);
      setToast('Failed to save about content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#6B6459]">Loading about...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            About Page & Heritage Narrative
          </h2>
          <p className="text-xs text-[#6B6459]">
            Edit brand story, mission, core values, and KPK location block.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save About Page'}
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Main Narrative Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Heritage & Story
        </h3>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Page Title
          </label>
          <input
            type="text"
            value={about.title}
            onChange={(e) => setAbout({ ...about, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Brand Story (Paragraphs separated by blank lines)
          </label>
          <textarea
            rows={8}
            value={about.story}
            onChange={(e) => setAbout({ ...about, story: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Mission Statement
          </label>
          <textarea
            rows={3}
            value={about.mission}
            onChange={(e) => setAbout({ ...about, mission: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>
      </div>

      {/* Location Block */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Geographic Location Block (Malakand, KPK)
        </h3>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Location Narrative
          </label>
          <textarea
            rows={3}
            value={about.locationText}
            onChange={(e) => setAbout({ ...about, locationText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>
      </div>

      {/* Values */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Guiding Values (4 Blocks)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {about.values?.map((val, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-[#E3DACB] bg-[#FAF7F2]/50 space-y-2">
              <input
                type="text"
                placeholder="Value Title"
                value={val.title}
                onChange={(e) => handleValueChange(idx, 'title', e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E3DACB] text-[#1A1A1A]"
              />
              <textarea
                rows={2}
                placeholder="Value Description"
                value={val.description}
                onChange={(e) => handleValueChange(idx, 'description', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E3DACB] text-[#6B6459]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-md disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save About Page'}
        </button>
      </div>
    </form>
  );
}
