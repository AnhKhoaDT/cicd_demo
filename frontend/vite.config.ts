import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Luôn build cho root ('/'). Muốn deploy Project Pages thì phải đổi chiến lược
// (ví dụ chuyển repo sang anhkhoadt.github.io hoặc cấu hình reverse proxy).
export default defineConfig({
  plugins: [react()],
  base: '/',
});
