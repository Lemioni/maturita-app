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
          accent: '#8b5cf6',  // Changed from pure white to purple for visual identity
          glow: '#8b5cf6',
          red: '#ff3333',
          green: '#33ff33',
          dim: '#1a1a1a',
        },
      },
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
      },
      boxShadow: {
        'glow-green': '0 0 10px rgba(51, 255, 51, 0.3)',
        'glow-red': '0 0 10px rgba(255, 51, 51, 0.3)',
        'glow-white': '0 0 10px rgba(255, 255, 255, 0.3)',
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom, 0px)',
      },
    },
  },
  plugins: [],
}
