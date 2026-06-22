/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 👈 यह स्ट्रिंग होना अनिवार्य है
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}