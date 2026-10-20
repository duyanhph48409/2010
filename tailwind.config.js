/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'wm-bg': '#fff8f9',
        'wm-glow': '#ffeef1',
        'wm-env': '#f9d5da',
        'wm-env-light': '#fbe3e6',
        'wm-border': '#f4b8c2',
        'wm-title': '#c9707c',
        'wm-heart': '#e8576f',
        'wm-leaf': '#6fb35a',
        'wm-navy': '#2d2a4a',
      },
      fontFamily: {
        'script': ['"Dancing Script"', 'cursive'],
        'letter': ['"Itim"', '"Mali"', 'cursive'],
      },
    },
  },
  plugins: [],
}
