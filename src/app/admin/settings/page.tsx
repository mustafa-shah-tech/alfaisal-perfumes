'use client';

import { useState, useEffect } from 'react';
import { getSettings, setDocument } from '@/lib/firestore';
import { SiteSettings } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';
import { DEFAULT_SETTINGS } from '@/hooks/useSettings';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettings();
        if (data) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data,
            logo: { ...DEFAULT_SETTINGS.logo, ...(data.logo || {}) },
            socialLinks: { ...DEFAULT_SETTINGS.socialLinks, ...(data.socialLinks || {}) },
          });
        }
      } catch (err) {
        console.warn('Could not load settings:', err);
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
      await setDocument('settings', 'general', settings);
      setToast('Site settings saved successfully!');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Save error:', err);
      setToast('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#6B6459]">Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Site & Brand Settings
          </h2>
          <p className="text-xs text-[#6B6459]">
            Manage brand identity, contact numbers, address, and social links.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Brand Identity Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Brand & Logo Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Logo Type
            </label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="logoType"
                  checked={settings.logo?.type === 'text'}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      logo: { ...settings.logo, type: 'text' },
                    })
                  }
                  className="text-[#B08D57] focus:ring-[#B08D57]"
                />
                Text Logo (ALFAISAL PERFUMES)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="logoType"
                  checked={settings.logo?.type === 'image'}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      logo: { ...settings.logo, type: 'image' },
                    })
                  }
                  className="text-[#B08D57] focus:ring-[#B08D57]"
                />
                Custom Image Logo
              </label>
            </div>
          </div>
        </div>

        {settings.logo?.type === 'text' ? (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Text Logo Value
            </label>
            <input
              type="text"
              value={settings.logo?.text || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  logo: { ...settings.logo, text: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>
        ) : (
          <ImageUpload
            label="Upload Logo Image"
            value={settings.logo?.imageUrl || ''}
            onChange={(url) =>
              setSettings({
                ...settings,
                logo: { ...settings.logo, imageUrl: url },
              })
            }
            folder="logos"
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Primary Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Sub-Headline
            </label>
            <input
              type="text"
              value={settings.subHeadline}
              onChange={(e) => setSettings({ ...settings, subHeadline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>
        </div>
      </div>

      {/* Contact Channels Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Contact Channels & Numbers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              WhatsApp Number (for floating button & wa.me links)
            </label>
            <input
              type="text"
              placeholder="e.g. 923001234567"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
            <span className="text-[10px] text-[#6B6459] mt-1 block">
              Format: country code + number without plus or dashes (e.g. 923001234567)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Direct Phone Call Number
            </label>
            <input
              type="text"
              placeholder="e.g. +92 300 1234567"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Official Email
            </label>
            <input
              type="email"
              placeholder="info@alfaisalperfumes.com"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Business Address / Facility Location
            </label>
            <input
              type="text"
              placeholder="Malakand, Khyber Pakhtunkhwa (KPK), Pakistan"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Default WhatsApp Pre-Filled Message
          </label>
          <input
            type="text"
            value={settings.whatsappMessage}
            onChange={(e) => setSettings({ ...settings, whatsappMessage: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
          />
        </div>
      </div>

      {/* Social Media Links Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Social Media Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/alfaisalperfumes"
              value={settings.socialLinks?.instagram || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              placeholder="https://facebook.com/alfaisalperfumes"
              value={settings.socialLinks?.facebook || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              TikTok URL
            </label>
            <input
              type="url"
              placeholder="https://tiktok.com/@alfaisalperfumes"
              value={settings.socialLinks?.tiktok || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, tiktok: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
          Footer Text
        </h3>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Copyright & Bottom Bar Note
          </label>
          <input
            type="text"
            value={settings.footerText}
            onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
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
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </form>
  );
}
