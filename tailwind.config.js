/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nude': '#F7F3EE',
        'brand': '#E8B4B8',
        'dark': '#3D2C2E',
      }
    },
  },
  plugins: [],
}