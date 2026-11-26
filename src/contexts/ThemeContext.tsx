// ============================================================
// Theme Context — Dynamic CSS Variables from Firestore
// ============================================================
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DEFAULT_THEME, ThemeColors } from '@/types';
import { getTheme } from '@/lib/firestore';

interface ThemeContextType {
  theme: ThemeColors;
  loading: boolean;
  updateLocalTheme: (newTheme: ThemeColors) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  loading: true,
  updateLocalTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeColors>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      try {
        const dbTheme = await getTheme();
        if (dbTheme) {
          setTheme((prev) => ({ ...prev, ...dbTheme }));
        }
      } catch (error) {
        console.warn('Theme loading notice (using defaults until initialized):', error);
      } finally {
        setLoading(false);
      }
    }
    loadTheme();
  }, []);

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    // Standard names
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-primary-text', theme.primaryText);
    root.style.setProperty('--color-secondary-text', theme.secondaryText);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-dark', theme.accentDark);
    root.style.setProperty('--color-dark-bg', theme.darkBg);
    root.style.setProperty('--color-borders', theme.borders);

    // Short names matching globals.css
    root.style.setProperty('--color-bg', theme.background);
    root.style.setProperty('--color-sf', theme.surface);
    root.style.setProperty('--color-pt', theme.primaryText);
    root.style.setProperty('--color-st', theme.secondaryText);
    root.style.setProperty('--color-ac', theme.accent);
    root.style.setProperty('--color-acd', theme.accentDark);
    root.style.setProperty('--color-dbg', theme.darkBg);
    root.style.setProperty('--color-bd', theme.borders);
  }, [theme]);

  const updateLocalTheme = (newTheme: ThemeColors) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, loading, updateLocalTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
