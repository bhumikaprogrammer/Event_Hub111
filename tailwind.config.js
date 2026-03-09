/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'Segoe UI', 'Arial', 'sans-serif'],
      mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    },
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 30px rgba(0,0,0,0.15)',
        'glow': '0 0 0 4px rgba(59,130,246,0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'slide-in': 'slide-in 0.6s ease-out',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59,130,246,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(59,130,246,0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.btn-primary': {
          '@apply inline-flex items-center justify-center font-semibold rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-primary-200': {},
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: '#fff',
          padding: '0.75rem 1.5rem',
        },
        '.btn-secondary': {
          '@apply inline-flex items-center justify-center font-semibold rounded-xl border transition-colors focus:outline-none focus:ring-4 focus:ring-primary-200': {},
          background: '#ffffff',
          color: '#2563eb',
          borderColor: '#bfdbfe',
          padding: '0.75rem 1.5rem',
        },
        '.card-base': {
          '@apply bg-white rounded-2xl shadow-card transition hover:shadow-card-hover': {},
        },
        '.input-base': {
          '@apply w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 outline-none transition': {},
        },
        '.badge': {
          '@apply inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700': {},
        },
      });
    }
  ],
}
