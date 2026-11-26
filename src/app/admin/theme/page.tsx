'use client';

import { useState, useEffect } from 'react';
import { getTheme, setDocument } from '@/lib/firestore';
import { ThemeColors, DEFAULT_THEME } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

export default function AdminThemePage() {
  const { updateLocalTheme } = useTheme();
  const [colors, setColors] = useState<ThemeColors>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getTheme();
        if (data) {
          setColors({ ...DEFAULT_THEME, ...data });
        }
      } catch (err) {
        console.warn('Could not load theme:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    const updated = { ...colors, [key]: value };
    setColors(updated);
    updateLocalTheme(updated);
  };

  const handleReset = () => {
    setColors(DEFAULT_THEME);
    updateLocalTheme(DEFAULT_THEME);
    setToast('Reset to default brand luxury theme.');
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast('');

    try {
      await setDocument('theme', 'colors', colors);
      setToast('Theme colors saved to database!');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Theme save error:', err);
      setToast('Failed to save theme colors.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#6B6459]">Loading theme...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Theme & Color Tokens
          </h2>
          <p className="text-xs text-[#6B6459]">
            Customize primary luxury colors with instant live preview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#6B6459] border border-[#E3DACB] hover:bg-white transition-colors"
          >
            Reset to Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Theme'}
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Color Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E3DACB] pb-3">
            Palette Controls
          </h3>

          <div className="space-y-4">
            {[
              { key: 'accent', label: 'Accent (Muted Gold)', desc: 'Primary buttons, active indicators, and badges' },
              { key: 'accentDark', label: 'Accent Dark (Hover)', desc: 'Button hover states and dark accents' },
              { key: 'background', label: 'Background (Ivory)', desc: 'Page background color' },
              { key: 'surface', label: 'Surface (Soft Sand)', desc: 'Card containers and alternating sections' },
              { key: 'primaryText', label: 'Primary Text (Charcoal)', desc: 'Headlines and high-contrast text' },
              { key: 'secondaryText', label: 'Secondary Text (Warm Grey)', desc: 'Body paragraphs, subheadings, and notes' },
              { key: 'darkBg', label: 'Dark Background', desc: 'Hero background, dark bands, and footer' },
              { key: 'borders', label: 'Borders', desc: 'Divider lines, card edges, and input borders' },
            ].map(({ key, label, desc }) => {
              const colorKey = key as keyof ThemeColors;
              const val = colors[colorKey];
              return (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-[#E3DACB] hover:border-[#B08D57]/50 transition-colors">
                  <div>
                    <label className="text-xs font-semibold text-[#1A1A1A] block">
                      {label}
                    </label>
                    <span className="text-[11px] text-[#6B6459]">{desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={val}
                      onChange={(e) => handleColorChange(colorKey, e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[#E3DACB] cursor-pointer p-0.5 bg-white"
                      aria-label={`Color picker for ${label}`}
                    />
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleColorChange(colorKey, e.target.value)}
                      className="w-24 px-2 py-1 text-xs font-mono uppercase rounded-lg border border-[#E3DACB] text-center"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Interactive Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E3DACB] shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-4">
              Live Theme Preview
            </h3>

            {/* Light Card Preview */}
            <div
              style={{
                backgroundColor: colors.background,
                borderColor: colors.borders,
              }}
              className="p-6 rounded-2xl border mb-6 space-y-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ color: colors.accentDark, backgroundColor: `${colors.accent}20` }}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  Floral • Unisex
                </span>
                <span style={{ color: colors.secondaryText }} className="text-xs">
                  50ml EDP
                </span>
              </div>

              <h4
                style={{ color: colors.primaryText }}
                className="font-serif text-xl font-bold"
              >
                Midnight Amber Oud
              </h4>

              <p
                style={{ color: colors.secondaryText }}
                className="text-xs leading-relaxed"
              >
                A regal composition of Cambodian agarwood and golden amber. Handcrafted private-label formulation.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  style={{ backgroundColor: colors.accent, color: '#FFFFFF' }}
                  className="px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-wider shadow-sm hover:opacity-95"
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  style={{ borderColor: colors.borders, color: colors.primaryText, backgroundColor: colors.surface }}
                  className="px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-wider border"
                >
                  Secondary
                </button>
              </div>
            </div>

            {/* Dark Section Card Preview */}
            <div
              style={{ backgroundColor: colors.darkBg }}
              className="p-6 rounded-2xl text-white space-y-3 transition-colors"
            >
              <span
                style={{ color: colors.accent }}
                className="text-[10px] font-semibold uppercase tracking-widest block"
              >
                Dark Section Contrast
              </span>
              <h4 className="font-serif text-lg font-bold text-white">
                Launch Your Signature Perfume Brand
              </h4>
              <p className="text-xs text-[#D1C9BE] leading-relaxed">
                Experience high-contrast elegance in footers and call-to-action sections.
              </p>
              <div className="pt-2">
                <span
                  style={{ backgroundColor: colors.accent }}
                  className="inline-block px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-wider text-white"
                >
                  Action Accent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
