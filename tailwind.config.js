/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      animation: {
        bob: 'bob 3s ease-in-out infinite',
        pop: 'pop .25s ease-out',
        twinkle: 'twinkle 3s ease-in-out infinite',
      },
      borderRadius: {
        toon: '20px',
      },
      boxShadow: {
        sticker: '4px 4px 0 0 #120f3a',
        'sticker-lg': '6px 6px 0 0 #120f3a',
      },
      colors: {
        ink: '#120f3a',
        space: {
          700: '#1f1d6b',
          800: '#14134a',
          900: '#0b0b2b',
        },
        toon: {
          cyan: '#4de1ff',
          mint: '#3ddc97',
          pink: '#ff6bb5',
          purple: '#7c5cff',
          red: '#ff5d5d',
          yellow: '#ffd23f',
        },
      },
      fontFamily: {
        body: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pop: {
          '0%': { transform: 'scale(.9)' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        twinkle: {
          '0%,100%': { opacity: '.3' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

