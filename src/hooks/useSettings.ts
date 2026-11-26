'use client';

import { useState, useEffect } from 'react';
import { SiteSettings } from '@/types';
import { getSettings } from '@/lib/firestore';

export const DEFAULT_SETTINGS: SiteSettings = {
  businessName: 'Alfaisal Perfumes',
  logo: {
    type: 'text',
    text: 'ALFAISAL',
    imageUrl: '',
  },
  tagline: 'Your Name. Your Scent. Your Perfume Brand.',
  subHeadline: 'We build your perfume business, from the first fragrance to the finished bottle.',
  favicon: '',
  phone: '',
  whatsapp: '',
  whatsappMessage: 'Hello! I am interested in creating a custom perfume brand with Alfaisal Perfumes.',
  email: '',
  address: 'Malakand, Khyber Pakhtunkhwa (KPK), Pakistan',
  socialLinks: {},
  footerText: '© Alfaisal Perfumes. All rights reserved.',
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchSettings() {
      try {
        const data = await getSettings();
        if (data && isMounted) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data,
            logo: { ...DEFAULT_SETTINGS.logo, ...(data.logo || {}) },
            socialLinks: { ...DEFAULT_SETTINGS.socialLinks, ...(data.socialLinks || {}) },
          });
        }
      } catch (err) {
        console.warn('Could not fetch settings from Firestore, using defaults:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading, setSettings };
}
