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
        'card': '0 1px 3px 0 rgba(20, 33, 61, 0.05), 0 1px 2px -1px rgba(20, 33, 61, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(20, 33, 61, 0.1), 0 8px 10px -6px rgba(20, 33, 61, 0.05)',
        'elevated': '0 20px 30px -10px rgba(37, 99, 235, 0.15)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
