import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  html: {
    title: 'Guía de integración de Cuenti',
  },
  plugins: [
    pluginReact({
      reactCompiler: true,
    }),
    pluginTailwindcss(),
  ],
  server: {
    port: 4000,
    proxy: [
      {
        pathFilter: '/jServerj4ErpPro',
        target: process.env.ERP_PROXY_TARGET ?? 'http://127.0.0.1:8081',
      },
    ],
  },
});
