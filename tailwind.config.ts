import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f9f4',
          100: '#e8f0e4',
          200: '#d4e4cd',
          300: '#b5d1a8',
          400: '#8fb87d',
          500: '#6b9b57',
          600: '#547d44',
          700: '#436338',
          800: '#384f30',
          900: '#2f4229',
          950: '#162314',
        },
        cream: {
          50: '#fdfcfa',
          100: '#faf8f3',
          200: '#f5f1e8',
          300: '#ebe5d6',
          400: '#d9cdb5',
          500: '#c4b493',
        },
        forest: {
          700: '#3d4a3a',
          800: '#2a332a',
          900: '#1c231c',
          950: '#0f140f',
        },
        terra: {
          400: '#c9a86c',
          500: '#b8935a',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -4px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 16px -4px rgba(0, 0, 0, 0.08), 0 8px 32px -8px rgba(0, 0, 0, 0.12)',
        'inner-soft': 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.4s ease-out',
        'slideIn': 'slideIn 0.4s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
