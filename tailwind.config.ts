// ============================================================
// Tailwind CSS v4 — Legacy Config Bridge
// ============================================================
// Tailwind v4 uses CSS-first configuration via @theme in globals.css.
// This file is kept for compatibility with tooling that reads it,
// but all theme tokens are defined in src/styles/globals.css.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        surface: "var(--color-sf)",
        "primary-text": "var(--color-pt)",
        "secondary-text": "var(--color-st)",
        accent: "var(--color-ac)",
        "accent-dark": "var(--color-acd)",
        "dark-bg": "var(--color-dbg)",
        borders: "var(--color-bd)",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out both",
        "slide-in": "slideIn 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
