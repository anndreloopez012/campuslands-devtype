/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          petroleum: '#07102B',
          darker: '#030816',
          surface: '#0d1838',
          surfaceLight: '#14224d',
          border: '#1E3264',
          deep: '#1B00BF',
          blue: '#2C67BA',
          'cyan-dark': '#0076B7',
          cyan: '#2CAAFF',
          sky: '#57BBFF',
          aqua: '#00AA80',
          amber: '#FFB800',
          coral: '#FF4D6D',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(44, 170, 255, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(44, 170, 255, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'shake-fast': 'shake 0.2s ease-in-out',
      }
    },
  },
  plugins: [],
};
