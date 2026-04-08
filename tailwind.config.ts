import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme - Using CSS variables
        light: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          highlight: 'var(--color-highlight)',
          'text-primary': 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          border: 'var(--color-border)',
        },
        // Dark theme - Using CSS variables
        dark: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          highlight: 'var(--color-highlight)',
          'text-primary': 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          border: 'var(--color-border)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
