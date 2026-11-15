/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      borderRadius: {
        hud: '14px',
      },
      boxShadow: {
        hud: '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)',
        card: '0 2px 8px rgba(0,0,0,0.09), 0 8px 24px rgba(0,0,0,0.06)',
      },
      colors: {
        // Light clean palette
        canvas: {
          50:  '#FFFFFF',
          100: '#F8F7F7',
          200: '#F0EFEF',
          300: '#E5E5E5',
          400: '#D1D5DB',
        },
        accent: {
          DEFAULT: '#3B82F6',
          soft:    '#EFF6FF',
          hover:   '#2563EB',
        },
        // Keep these for semantic status colors
        hud: {
          cyan:    '#3B82F6',   // rebrand cyan → blue
          sky:     '#38BDF8',
          emerald: '#10B981',
          amber:   '#F59E0B',
          rose:    '#EF4444',
        },
        space: {
          950: '#111827',
          900: '#1F2937',
          850: '#374151',
          800: '#4B5563',
          700: '#6B7280',
        },
      },
      fontFamily: {
        body:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
