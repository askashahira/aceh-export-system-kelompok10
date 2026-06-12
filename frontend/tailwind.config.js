/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0f3460', light: '#16213e', dark: '#0a2342' },
        accent: { DEFAULT: '#00b4d8', light: '#90e0ef', dark: '#0077b6' },
        gold: { DEFAULT: '#f4a261', light: '#ffd166', dark: '#e76f51' }
      }
    }
  },
  plugins: []
};
