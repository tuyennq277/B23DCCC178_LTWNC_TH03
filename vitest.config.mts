import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      // Vitest mặc định ẩn file đạt 100%; bật lại để bảng hiện đủ 4 file.
      reporter: [['text', { skipFull: false }], 'html'],
      include: [
        'src/lib/permissions.ts',
        'src/lib/post-validate.ts',
        'src/lib/format.ts',
        'src/components/PostForm.tsx',
      ],
    },
  },
});
