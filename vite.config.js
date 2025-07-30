import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('R:\College data\Semester 5\Web_Application\certificates-for-https\key.pem'),
      cert: fs.readFileSync('R:\College data\Semester 5\Web_Application\certificates-for-https\cert.pem'),
    },
    port: 5173, // or whatever you use
  }
});
