/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        green: colors.emerald,
        purple: colors.violet,
        yellow: colors.yellow,
        brand: colors.violet,
        brand2: colors.pink,
      }
    }
  },
  plugins: [],
}
