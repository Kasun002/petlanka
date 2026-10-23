/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F7A63',
        'primary-dark': '#0A5C49',
        surface: '#F5F3EC',
        orange: '#E8863A',
        muted: '#9A968A',
      },
      fontFamily: {
        display: ['Sora', 'Noto Sans Sinhala', 'Noto Sans Tamil', 'sans-serif'],
        body: ['Work Sans', 'Noto Sans Sinhala', 'Noto Sans Tamil', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
