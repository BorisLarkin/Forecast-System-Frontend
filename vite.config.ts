import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Forecast-System-Frontend", // Замените RepoName на имя вашего репозитория
  server: {
    port: 3000,
    host:'localhost',
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
  },
  plugins: [react()],
})
