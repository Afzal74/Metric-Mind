/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ghibli-inspired color palette
        ghibli: {
          sky: '#7EC8E3',
          cloud: '#F5F5F5',
          grass: '#98D8AA',
          forest: '#4A7C59',
          earth: '#8B7355',
          sunset: '#FFB347',
          rose: '#FFB6C1',
          cream: '#FFF8DC',
          stone: '#D4C4B0',
        },
        // Keep existing colors for compatibility
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        ghibli: ['Comfortaa', 'Quicksand', 'cursive'],
        nunito: ['Nunito', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'drift': 'drift 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        drift: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'ghibli': '0 8px 32px rgba(139, 195, 74, 0.15), 0 4px 16px rgba(0, 0, 0, 0.05)',
        'ghibli-lg': '0 12px 40px rgba(139, 195, 74, 0.2), 0 8px 24px rgba(0, 0, 0, 0.08)',
        'warm': '0 4px 20px rgba(139, 119, 42, 0.1)',
      },
    },
  },
  plugins: [],
}
