/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        banking: {
          primary: '#1a365d',
          secondary: '#2b6cb0',
          accent: '#3182ce',
          success: '#38a169',
          warning: '#d69e2e',
          danger: '#e53e3e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
