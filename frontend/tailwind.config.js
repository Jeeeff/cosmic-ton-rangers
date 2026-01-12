/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          dark: '#0a0e27',
          purple: '#6366f1',
          pink: '#ec4899',
          blue: '#3b82f6',
        }
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'cosmic-gradient': 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
      }
    },
  },
  plugins: [],
}
