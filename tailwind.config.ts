import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zeus: {
          bg:      '#1A1A1A',
          surface: '#F4F4F4',
          black:   '#000000',
          white:   '#FFFFFF',
          red:     '#FF3B30',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'dot-pulse': 'dotPulse 2s ease-in-out infinite',
        'fade-in':   'fadeIn 0.25s cubic-bezier(0.4,0,0.2,1) forwards',
        'slide-up':  'slideUp 0.28s cubic-bezier(0.4,0,0.2,1) forwards',
        'scale-up':  'scaleUp 0.2s cubic-bezier(0.4,0,0.2,1) forwards',
      },
      keyframes: {
        dotPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.7', transform: 'scale(1.3)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          from: { transform: 'scale(0.97)' },
          to:   { transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        zeus: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
