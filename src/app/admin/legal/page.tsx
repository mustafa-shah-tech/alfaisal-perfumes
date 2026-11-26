'use client';

import { useState, useEffect } from 'react';
import { getLegal, setDocument } from '@/lib/firestore';
import { LegalPage } from '@/types';

export default function AdminLegalPage() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const [privacy, setPrivacy] = useState<LegalPage>({
    title: 'Privacy Policy',
    content: '<p>Alfaisal Perfumes collects information when you request a custom quote...</p>',
  });
  const [terms, setTerms] = useState<LegalPage>({
    title: 'Terms & Conditions of Service',
    content: '<p>Alfaisal Perfumes operates as a custom private-label fragrance manufacturer...</p>',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [pData, tData] = await Promise.all([
          getLegal('privacy'),
          getLegal('terms'),
        ]);
        if (pData) setPrivacy(pData);
        if (tData) setTerms(tData);
      } catch (err) {
        console.warn('Load legal error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast('');

    try {
      if (activeTab === 'privacy') {
        await setDocument('legal', 'privacy', privacy);
        setToast('Privacy Policy updated successfully!');
      } else {
        await setDocument('legal', 'terms', terms);
        setToast('Terms of Service updated successfully!');
      }
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Save legal error:', err);
      setToast('Failed to save legal document.');
    } finally {
      setSaving(false);
    }
  };

  const currentDoc = activeTab === 'privacy' ? privacy : terms;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Legal & Policy Pages
          </h2>
          <p className="text-xs text-[#6B6459]">
            Edit published Privacy Policy and commercial Terms of Service.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : `Save ${activeTab === 'privacy' ? 'Privacy' : 'Terms'}`}
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3DACB] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'privacy'
              ? 'bg-[#B08D57] text-white shadow-sm'
              : 'text-[#6B6459] hover:bg-white'
          }`}
        >
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'terms'
              ? 'bg-[#B08D57] text-white shadow-sm'
              : 'text-[#6B6459] hover:bg-white'
          }`}
        >
          Terms of Service
        </button>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Document Title
          </label>
          <input
            type="text"
            value={currentDoc.title}
            onChange={(e) => {
              if (activeTab === 'privacy') {
                setPrivacy({ ...privacy, title: e.target.value });
              } else {
                setTerms({ ...terms, title: e.target.value });
              }
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Document Content (HTML / Text formatted)
          </label>
          <textarea
            rows={14}
            value={currentDoc.content}
            onChange={(e) => {
              if (activeTab === 'privacy') {
                setPrivacy({ ...privacy, content: e.target.value });
              } else {
                setTerms({ ...terms, content: e.target.value });
              }
            }}
            className="w-full px-4 py-3 rounded-xl border border-[#E3DACB] font-mono text-xs text-[#1A1A1A] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>
      </div>
    </form>
  );
}
