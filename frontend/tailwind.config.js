const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors:{
        'primary': "#006794",
        'secondary': "#3EAFE4"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
