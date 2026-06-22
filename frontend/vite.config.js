import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const vercelUrl = env.VERCEL_URL ? `https://${env.VERCEL_URL}` : '';
  const publicSiteUrl = env.VITE_PUBLIC_SITE_URL || vercelUrl;

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_PUBLIC_SITE_URL': JSON.stringify(publicSiteUrl),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});