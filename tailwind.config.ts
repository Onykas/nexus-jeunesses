import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1E3C',
          50: '#E8EDF5',
          100: '#C5D1E8',
          200: '#8EA5CE',
          300: '#5679B4',
          400: '#2A4D8A',
          500: '#0A1E3C',
          600: '#081830',
          700: '#061224',
          800: '#040C18',
          900: '#02060C',
        },
        brand: {
          red: '#D32F2F',
          green: '#4CAF50',
          orange: '#FF9800',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'count-up': 'countUp 2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/hero-bg.jpg')",
      },
      boxShadow: {
        card: '0 4px 20px rgba(10, 30, 60, 0.08)',
        'card-hover': '0 8px 40px rgba(10, 30, 60, 0.16)',
        glow: '0 0 20px rgba(211, 47, 47, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
