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
        // Deep cosmic midnight backgrounds
        void: {
          50:  '#f0f0ff',
          100: '#e0dfff',
          200: '#c3c1ff',
          300: '#a09bff',
          400: '#7e71ff',
          500: '#6247ff',
          600: '#4f26f5',
          700: '#3f18e0',
          800: '#2c0fb8',
          900: '#1a0a8c',
          950: '#050511',
        },
        // Electric teal — the hero accent
        teal: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          glow: '#00d9ff',
        },
        // Hot coral — energy and passion
        coral: {
          400: '#ff6b8a',
          500: '#ff4d6d',
          600: '#e03055',
        },
        // Electric violet — creativity
        violet: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        },
        // Warm pearl for text
        pearl: {
          50:  '#ffffff',
          100: '#f0f0ff',
          200: '#d8d8f0',
          300: '#b0b0d0',
          400: '#8080a8',
          500: '#606080',
        },
        // Emerald highlight
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', '"Syne"', '"Playfair Display"', 'Georgia', 'serif'],
        accent:  ['"Syne"', '"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic':       'radial-gradient(ellipse at 20% 50%, rgba(98,71,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,217,255,0.1) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(255,77,109,0.08) 0%, transparent 50%)',
        'card-shine':   'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)',
        'teal-glow':    'radial-gradient(circle, rgba(0,217,255,0.3) 0%, transparent 70%)',
        'violet-glow':  'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
        'coral-glow':   'radial-gradient(circle, rgba(255,77,109,0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'teal':   '0 0 40px rgba(0,217,255,0.2), 0 0 80px rgba(0,217,255,0.08)',
        'violet': '0 0 40px rgba(168,85,247,0.25), 0 0 80px rgba(168,85,247,0.1)',
        'coral':  '0 0 40px rgba(255,77,109,0.25), 0 0 80px rgba(255,77,109,0.1)',
        'card':   '0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.6)',
        'card-hover': '0 1px 0 rgba(0,217,255,0.15), 0 16px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,217,255,0.15)',
        'btn-teal': '0 4px 24px rgba(0,217,255,0.35), 0 0 0 1px rgba(0,217,255,0.3)',
        'btn-coral': '0 4px 24px rgba(255,77,109,0.4)',
        'inner': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      animation: {
        'drift-slow':  'drift 20s ease-in-out infinite',
        'drift-fast':  'drift 12s ease-in-out infinite reverse',
        'pulse-teal':  'pulseTeal 4s ease-in-out infinite',
        'float-card':  'floatCard 6s ease-in-out infinite',
        'shimmer':     'shimmerAnim 1.8s ease infinite',
        'gradient-x':  'gradientX 6s ease infinite',
        'spin-slow':   'spin 20s linear infinite',
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%':     { transform: 'translate(30px,-20px) scale(1.05)' },
          '66%':     { transform: 'translate(-20px,15px) scale(0.97)' },
        },
        pulseTeal: {
          '0%,100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':     { opacity: '1',   transform: 'scale(1.08)' },
        },
        floatCard: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        shimmerAnim: {
          '0%':   { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
