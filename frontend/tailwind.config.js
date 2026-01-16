/** @type {import('tailwindcss').Config} */
import tokens from '../../design-tokens.json';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      fontFamily: tokens.typography.fontFamily,
      boxShadow: tokens.shadows,
      borderRadius: tokens.borderRadius,
    },
  },
  plugins: [],
}
