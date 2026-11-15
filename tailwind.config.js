/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      borderRadius: {
        hud: '14px',
      },
      boxShadow: {
        hud: '0 12px 36px rgba(0, 0, 0, 0.45)',
        glow: '0 0 25px rgba(56, 189, 248, 0.2)',
      },
      colors: {
        space: {
          950: '#02040a',
          900: '#030712',
          850: '#060b18',
          800: '#0b1426',
          700: '#111d38',
        },
        hud: {
          cyan: '#00f0ff',
          sky: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#ef4444',
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
