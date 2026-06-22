import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#F8F9FB',
        card: '#FFFFFF',
        primary: '#4A90E2',
        secondary: '#6FAFF7',
        'blue-light': '#DCEBFF',
        'text-primary': '#1E293B',
        'text-secondary': '#64748B',
        border: '#E8EDF3',
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        badge: '6px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      },
      fontSize: {
        display: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        heading: ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        subheading: ['15px', { lineHeight: '1.4', fontWeight: '500' }],
        body: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        micro: ['11px', { lineHeight: '1.3', fontWeight: '400' }],
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
} satisfies Config
