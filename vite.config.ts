import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';
import {dest_api, dest_img, dest_root} from "./target-config"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https:{
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      "/api": {
        target: dest_api,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
      "/img-proxy": {
           target: dest_img,
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/img-proxy/, "/"),
      },
    },
  },
  build: {
    target: 'chrome105'
  },
  base: dest_root,
  plugins: [react(), mkcert()],
})
