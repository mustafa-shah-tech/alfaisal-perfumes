'use client';

import { useState, useEffect } from 'react';
import { getServices, setDocument, getProcessSteps } from '@/lib/firestore';
import { ServicesContent, ProcessStep } from '@/types';

const DEFAULT_SERVICES: ServicesContent = {
  title: 'Bespoke Private Label Perfume Manufacturing',
  intro:
    'We empower boutiques, fashion houses, beauty salons, corporate gift specialists, and ambitious entrepreneurs to launch their own luxury fragrance brands.',
  included: [
    'Private-label Eau de Parfum (EDP) & Eau de Toilette (EDT) formulations',
    'Custom bottle selection (50ml, 100ml, travel sizes, cylinders & squares)',
    'High-end cap and atomiser choices (gold, matte black, weighted magnetic)',
    'Custom label design, foil stamping, embossing, and waterproof finishes',
    'Rigid luxury presentation boxes, sleeve boxes, and carton packaging',
    'Low minimum order quantities (MOQ) tailored for startups and test launches',
    'Fragrance sample approval kit before final bulk production batching',
    'End-to-end quality assurance and batch consistency checks',
    'Comprehensive logistics coordination directly from Malakand, KPK across Pakistan',
  ],
  sections: [],
  ctaText: 'Launch Your Signature Fragrance Brand Today',
  ctaDescription: 'Request a private label consultation and sample kit in PKR.',
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServicesContent>(DEFAULT_SERVICES);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [newIncludedItem, setNewIncludedItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [servData, stepData] = await Promise.all([
          getServices(),
          getProcessSteps(),
        ]);
        if (servData) setServices({ ...DEFAULT_SERVICES, ...servData });
        if (stepData && stepData.length > 0) setSteps(stepData);
      } catch (err) {
        console.warn('Load services error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddIncluded = () => {
    if (!newIncludedItem.trim()) return;
    setServices({
      ...services,
      included: [...(services.included || []), newIncludedItem.trim()],
    });
    setNewIncludedItem('');
  };

  const handleRemoveIncluded = (index: number) => {
    setServices({
      ...services,
      included: services.included.filter((_, i) => i !== index),
    });
  };

  const handleStepChange = (index: number, field: keyof ProcessStep, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast('');

    try {
      await setDocument('services', 'main', services);
      // Save process steps
      for (const step of steps) {
        if (step.id) {
          await setDocument('processSteps', step.id, step);
        }
      }
      setToast('Services and process content saved successfully!');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Save error:', err);
      setToast('Failed to save services content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#6B6459]">Loading services...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Services & 5-Step Process
          </h2>
          <p className="text-xs text-[#6B6459]">
            Edit private-label services, turnkey inclusions, and creation steps.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Main Services Intro */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Services Page Overview
        </h3>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Page Title
          </label>
          <input
            type="text"
            value={services.title}
            onChange={(e) => setServices({ ...services, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Introductory Narrative
          </label>
          <textarea
            rows={3}
            value={services.intro}
            onChange={(e) => setServices({ ...services, intro: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>
      </div>

      {/* What's Included Checklist */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E3DACB] pb-3">
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
            &ldquo;What’s Included&rdquo; Items
          </h3>
          <span className="text-xs text-[#6B6459]">
            {services.included?.length || 0} features
          </span>
        </div>

        {/* Add item */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add new turnkey feature (e.g. In-house stability testing)..."
            value={newIncludedItem}
            onChange={(e) => setNewIncludedItem(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-[#E3DACB] text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
          <button
            type="button"
            onClick={handleAddIncluded}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#B08D57] text-white hover:bg-[#8F6F3E]"
          >
            + Add
          </button>
        </div>

        {/* List */}
        <div className="space-y-2">
          {services.included?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E3DACB] text-xs"
            >
              <span className="text-[#1A1A1A] font-medium">{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveIncluded(idx)}
                className="text-red-600 hover:text-red-800 font-bold ml-4"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Process Steps */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          5-Step Timeline Creation Process
        </h3>

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="p-4 rounded-2xl border border-[#E3DACB] bg-[#FAF7F2]/50 space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B08D57] text-white text-xs font-bold flex items-center justify-center">
                  0{idx + 1}
                </span>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs font-bold text-[#1A1A1A] rounded-lg border border-[#E3DACB] focus:outline-none focus:ring-1 focus:ring-[#B08D57]"
                />
              </div>
              <textarea
                rows={2}
                value={step.description}
                onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                className="w-full px-3 py-1.5 text-xs text-[#6B6459] rounded-lg border border-[#E3DACB] focus:outline-none focus:ring-1 focus:ring-[#B08D57]"
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
          {saving ? 'Saving...' : 'Save All Services Changes'}
        </button>
      </div>
    </form>
  );
}
