// D:\university-files\SEM I - 2026\web-2\Practicos\final-project\world-cup-2026-predictions\wc2026-frontend\vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // <-- Revisa que esta línea esté idéntica

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Aquí se ejecuta la variable importada arriba
  ],
});
