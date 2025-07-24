/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0d0b1f',
        lightBlack: '#1a1a2e',
        deepPurple: '#5f27cd',
        softPurple: '#a29bfe',
        neonPurple: '#b388eb',
        glass: 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        modern: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        purpleGlow: '0 0 20px rgba(179, 136, 235, 0.5)',
        glassBorder: '0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at top left, #2d0b52, #000000)',
      },
    },
  },
  plugins: [],
};
