/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#4f46e5',
        accent: '#0d9488',
        background: '#f8fafc',
        surface: '#ffffff',
        success: '#16a34a',
        warning: '#eab308',
        danger: '#dc2626',
      },
    },
  },
  plugins: [],
}