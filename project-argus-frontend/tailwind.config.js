/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0f1e',
          card: '#111827'
        },
        status: {
          genuine: '#10b981',
          suspicious: '#f59e0b',
          scam: '#ef4444'
        },
        accent: '#6366f1'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
