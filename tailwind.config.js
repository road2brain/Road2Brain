/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#14213D',
          blue: '#2563EB',
          teal: '#14B8A6',
          violet: '#7C3AED',
          orange: '#F59E0B',
          lightBg: '#F8FAFC',
          darkBg: '#0B132B',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(20, 33, 61, 0.04), 0 1px 2px -1px rgba(20, 33, 61, 0.04)',
        'card-hover': '0 12px 28px -6px rgba(20, 33, 61, 0.08), 0 8px 12px -6px rgba(20, 33, 61, 0.04)',
        'elevated': '0 20px 35px -10px rgba(37, 99, 235, 0.15)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.35)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ken-burns': 'kenburns 18s ease-in-out infinite alternate',
        'badge-float': 'badgeFloat 4s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        kenburns: {
          '0%': { transform: 'scale(1) translate(0%, 0%)' },
          '100%': { transform: 'scale(1.08) translate(-1.5%, -1%)' },
        },
        badgeFloat: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
