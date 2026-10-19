import vue from '@vitejs/plugin-vue';
import { metadata } from './src/data/invitation-config';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [vue(), {
    name: 'invitation-metadata',
    transformIndexHtml(html) {
      const values: Record<string, string> = {
        TITLE: metadata.title, DESCRIPTION: metadata.description,
        SHARE_DESCRIPTION: metadata.shareDescription, SITE_NAME: metadata.siteName,
        IMAGE_ALT: metadata.imageAlt,
      };
      const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      return html.replace(/__INVITATION_(\w+)__/g, (token, key: string) => key in values ? escape(values[key]) : token);
    },
  }],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: { outDir: 'dist/client', emptyOutDir: true },
});
