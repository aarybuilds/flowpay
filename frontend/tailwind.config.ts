import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Veridian Terminal Palette ──
        primary: {
          DEFAULT: '#00D4AA',
          50:  '#E6FBF7',
          100: '#B3F2E6',
          200: '#80E9D5',
          300: '#4DDFC4',
          400: '#26D6B3',
          500: '#00D4AA',
          600: '#00B892',
          700: '#009C7A',
          800: '#008062',
          900: '#00644A',
        },
        accent: {
          DEFAULT: '#00FF87',
          300: '#80FFBE',
          400: '#4DFFAA',
          500: '#00FF87',
          600: '#00E077',
        },
        tertiary: {
          DEFAULT: '#FFA858',
          300: '#FFCF9B',
          400: '#FFB978',
          500: '#FFA858',
          600: '#FF8E38',
        },
        // Surface (dark teal-tinted)
        surface: {
          DEFAULT: 'rgba(0,212,170,0.04)',
          hover:   'rgba(0,212,170,0.07)',
          border:  'rgba(0,212,170,0.1)',
          strong:  'rgba(0,212,170,0.12)',
        },
        bg: {
          base:    '#0D1412',
          elevated:'#111A18',
          card:    '#14201D',
        },
        success: '#00FF87',
        warning: '#FFA858',
        danger:  '#FF5E5E',
        usdc:  '#2775CA',
        eth:   '#627EEA',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
        'bounce-soft':'bounceSoft 1s ease-in-out infinite',
        'scan-line':  'scanLine 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(124,58,237,0.6)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        scanLine: {
          from: { transform: 'translateY(-100%)' },
          to:   { transform: 'translateY(300%)' },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'teal-glow':        'radial-gradient(ellipse at top, rgba(0,212,170,0.12) 0%, transparent 65%)',
        'mint-glow':        'radial-gradient(ellipse at bottom, rgba(0,255,135,0.08) 0%, transparent 65%)',
        'hero-gradient':    'linear-gradient(135deg, #0D1412 0%, #111A18 60%, #0D1412 100%)',
        'card-gradient':    'linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(0,255,135,0.03) 100%)',
        'brand-gradient':   'linear-gradient(135deg, #00D4AA 0%, #00FF87 100%)',
        'orange-gradient':  'linear-gradient(135deg, #FFA858 0%, #FF8E38 100%)',
        'dots':             'radial-gradient(circle, rgba(0,212,170,0.1) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow-sm':     '0 0 15px rgba(0,212,170,0.25)',
        'glow-md':     '0 0 30px rgba(0,212,170,0.35)',
        'glow-lg':     '0 0 60px rgba(0,212,170,0.45)',
        'glow-orange': '0 0 24px rgba(255,168,88,0.4)',
        'card':        '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover':  '0 8px 40px rgba(0,0,0,0.7)',
        'inner-glow':  'inset 0 1px 0 rgba(0,212,170,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
