import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Required to handle the folder path mappings

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    react() // Clean, standard React plugin without the missing Base44 dependencies
  ],
  resolve: {
    alias: {
      // This tells Vite that '@/' points directly to your 'src' folder
      '@': path.resolve(__dirname, './src'),
    },
  },
})
