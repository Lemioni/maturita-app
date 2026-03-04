import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy vendor libs into separate cached chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-markdown': ['react-markdown', 'rehype-raw', 'remark-gfm'],
          'vendor-icons': ['react-icons'],
          // Split large data files into their own chunks
          'data-it': ['./src/data/it-questions.json'],
          'data-cj': ['./src/data/cj-books.json', './src/data/cj-books-2.json', './src/data/cj-book-terms.generated.json'],
        },
      },
    },
    // Increase chunk size warning limit (we're already splitting)
    chunkSizeWarningLimit: 600,
  },
})
