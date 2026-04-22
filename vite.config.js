import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// host: слухає всі інтерфейси — можна відкрити http://<IP-ПК>:5173 з телефону в одній Wi‑Fi
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
