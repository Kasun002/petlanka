/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F7A63',
        'primary-dark': '#0A5C49',
        surface: '#FAF8F3',
      },
    },
  },
  plugins: [],
};
