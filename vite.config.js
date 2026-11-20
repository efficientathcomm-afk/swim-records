import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Tailwind CSS v4 runs cleanly via postcss.config.js (@tailwindcss/postcss)
export default defineConfig({
  plugins: [react()],
});
