import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Configuración de build opcional
  build: {
    outDir: 'www',  // para que Capacitor lo use directamente
    rollupOptions: {
      // No hace falta input si solo tienes index.html
      // plugins adicionales se pueden agregar aquí
    }
  },
  resolve: {
    alias: {
      // Por ejemplo, si quieres usar @ como alias de src
      '@': resolve(__dirname, 'src')
    }
  }
});