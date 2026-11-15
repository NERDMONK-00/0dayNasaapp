/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        twinkle: {
          '0%': { opacity: '0.4', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      borderRadius: {
        hud: '14px',
      },
      boxShadow: {
        hud: '0 1px 4px rgba(7,10,18,0.45), 0 12px 28px rgba(96,165,250,0.08)',
        card: '0 10px 30px rgba(10,13,23,0.35)',
        glow: '0 0 0 1px rgba(34,211,238,0.14), 0 0 24px rgba(34,211,238,0.18)',
      },
      colors: {
        canvas: {
          950: '#05070E',
          900: '#090A14',
          850: '#101827',
          800: '#111827',
          700: '#1F2937',
        },
        accent: {
          cyan: '#00F0FF',
          violet: '#8B5CF6',
          magenta: '#EC4899',
          blue: '#60A5FA',
          DEFAULT: '#8B5CF6',
          soft: '#1E293B',
          hover: '#7C3AED',
        },
        space: {
          base: '#05070E',
          panel: 'rgba(15, 23, 42, 0.72)',
          border: 'rgba(255,255,255,0.1)',
          text: '#F8FAFC',
          muted: '#94A3B8',
          dim: '#64748B',
          cyan: '#00F0FF',
          violet: '#8B5CF6',
          magenta: '#EC4899',
          green: '#34D399',
          amber: '#FBBF24',
          red: '#F87171',
        },
        hud: {
          cyan: '#00F0FF',
          sky: '#38BDF8',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
        },
      },
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
