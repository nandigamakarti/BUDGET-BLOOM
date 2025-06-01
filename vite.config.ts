// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    allowedHosts: ["gentle-growth-finance-main.onrender.com"]
  }
})
