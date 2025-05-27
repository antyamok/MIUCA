/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sage': '#2A11D8',
        'offwhite': '#F7F4F2',
        'terracotta': '#2A11D8',
        'dark': '#0C0539',
        'light-gray': '#CCCCCC',
        'accent': '#A47B67',
        'copper': '#A47B67', // ajout de copper comme alias explicite
      },
      fontFamily: {
        'lufga': ['Lufga', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'h1': '48px',
        'h2': '36px',
        'h3': '24px',
        'body': '16px',
        'nav': '18px',
        'label': '14px',
      },
      spacing: {
        'nav-spacing': '30px',
      },
      borderRadius: {
        'button': '4px',
      },
      transitionDuration: {
        'button': '300ms',
      },
    },
  },
  plugins: [],
};
