import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import manifest from './manifest.json';

// Plugin to copy static files
function copyStaticFiles() {
  return {
    name: 'copy-static-files',
    writeBundle() {
      // Ensure directory exists
      const targetDir = resolve(__dirname, 'dist/src/content');
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }
      // Copy CSS file
      copyFileSync(
        resolve(__dirname, 'src/content/styles.css'),
        resolve(targetDir, 'styles.css')
      );
    },
  };
}

export default defineConfig({
  plugins: [
    crx({ manifest }),
    copyStaticFiles(),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.html',
      },
    },
  },
});
