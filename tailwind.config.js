/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#0a0a0a',
          text: '#e0e0e0',
          border: '#ffffff',
          accent: '#ffffff', // bílá pro text/bordery
          glow: '#ffffff',
          red: '#ff3333',
          green: '#33ff33', // zelená jen pro checkboxy
          dim: '#1a1a1a',
        },
      },
      boxShadow: {
        'glow-green': '0 0 10px rgba(51, 255, 51, 0.3)',
        'glow-red': '0 0 10px rgba(255, 51, 51, 0.3)',
        'glow-white': '0 0 10px rgba(255, 255, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
