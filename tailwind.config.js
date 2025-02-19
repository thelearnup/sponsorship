/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-delay': 'float-delay 12s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'liquid-1': 'liquid1 12s ease-in-out infinite',
        'wave-1': 'wave1 10s ease-in-out infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-delay': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(20px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'liquid1': {
          '0%, 100%': {
            'border-radius': '63% 37% 54% 46% / 55% 48% 52% 45%',
          },
          '50%': {
            'border-radius': '42% 58% 42% 58% / 45% 55% 45% 55%',
          }
        },
        'wave1': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-15px)',
          },
        }
      },
    },
  },
  plugins: [],
};
