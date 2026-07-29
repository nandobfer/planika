import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
        setupFiles: ['./__tests__/setup.ts'],
    },
})
