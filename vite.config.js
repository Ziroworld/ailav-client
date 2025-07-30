
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const useHttps = process.env.USE_HTTPS === 'true';

export default defineConfig({
  plugins: [react()],
  server: useHttps
    ? {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, '../certificates-for-https/key.pem')),
          cert: fs.readFileSync(path.resolve(__dirname, '../certificates-for-https/cert.pem')),
        },
        port: 5173,
      }
    : {
        port: 5173,
      },
});
