/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Pure monochrome system — no hues
        ink: {
          0:    '#000000',
          50:   '#0a0a0a',
          100:  '#111111',
          150:  '#161616',
          200:  '#1a1a1a',
          300:  '#222222',
          400:  '#2e2e2e',
          500:  '#444444',
          600:  '#666666',
          700:  '#888888',
          800:  '#aaaaaa',
          900:  '#cccccc',
          950:  '#eeeeee',
          1000: '#ffffff',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        sans:    ['"DM Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        '10': '0.1em',
        '15': '0.15em',
        '20': '0.2em',
        '30': '0.3em',
      },
      boxShadow: {
        'frame':       '0 0 0 1px rgba(255,255,255,0.1)',
        'frame-hover': '0 0 0 1px rgba(255,255,255,0.5)',
        'white-sm':    '0 4px 24px rgba(255,255,255,0.06)',
        'white-lg':    '0 8px 48px rgba(255,255,255,0.1)',
      },
      animation: {
        'marquee':    'marquee 22s linear infinite',
        'fade-in':    'fadeIn 0.7s ease forwards',
        'slide-up':   'slideUp 0.7s cubic-bezier(0.4,0,0.2,1) forwards',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
