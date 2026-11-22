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
        background: '#000000',
        surface: {
          DEFAULT: '#050507',
          card: 'rgba(10, 10, 14, 0.75)',
          hover: 'rgba(18, 18, 24, 0.85)',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(0, 229, 255, 0.35)'
        },
        cyan: {
          glow: '#00E5FF',
          muted: '#00B4D8'
        },
        accent: {
          blue: '#3B82F6',
          sky: '#38BDF8'
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.2))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(0, 229, 255, 0.6))' }
        }
      }
    },
  },
  plugins: [],
};
