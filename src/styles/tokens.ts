export const designTokens = {
  colors: {
    bg: '#07111d',
    bgElevated: '#0d1728',
    panel: '#111d2d',
    panelSoft: '#0e1726',
    border: '#22314a',
    borderSoft: '#2b3a52',
    text: '#e2e8f0',
    textMuted: '#94a3b8',
    accent: '#5aa9ff',
    accentSoft: '#9ec9ff',
    success: '#34d399',
    warning: '#fbbf24',
    critical: '#f87171',
    glow: 'rgba(90, 169, 255, 0.35)',
  },
  radius: {
    small: '12px',
    medium: '18px',
    large: '24px',
    xl: '30px',
  },
  shadow: {
    soft: '0 18px 44px rgba(15, 23, 42, 0.18)',
    glow: '0 0 0 1px rgba(90, 169, 255, 0.12), 0 20px 44px rgba(36, 99, 235, 0.2)',
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  font: {
    body: 'Inter, "Segoe UI", sans-serif',
    heading: 'Inter, "Segoe UI", sans-serif',
  },
}

export type ThemeMode = 'dark' | 'light'
