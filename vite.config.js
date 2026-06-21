import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path' // 1. Added this to handle file path resolution

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    react({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ],
  resolve: {
    alias: {
      // 2. This maps the "@" shortcut straight to your "src" directory
      '@': path.resolve(__dirname, './src'),
    },
  },
});
