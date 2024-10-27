import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import basicSsl from '@vitejs/plugin-basic-ssl'
import { compression } from 'vite-plugin-compression2'
import { ViteMinifyPlugin } from 'vite-plugin-minify' 
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import { visualizer } from 'rollup-plugin-visualizer';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/',
  
  build: {
    // sourcemap: true,
    outDir: 'dist',  
    emptyOutDir:true,
    // minify: 'terser',
    rollupOptions: {
      treeshake: true,
      output:{
        manualChunks: {
          'react-venders': ['react', 'react-dom'],
          'recharts-chunk': ['recharts'],
          'd3-chunk': ['d3'],
          // 'lodash-chunk': ['lodash'],
        }}
  }},
  plugins: [
    // nodePolyfills({
    //   include: ['process'],
    //   globals: { global: true, process: true },
    // }),
    visualizer({ open: true, filename: 'bundle-visualization.html' }),
    // chunkSplitPlugin(),
    // ViteMinifyPlugin(),
    compression(),
    react(
      { jsxRuntime: 'automatic' })
  ],
  css: {
    postcss: {
      
      plugins: [
        
        tailwindcss(),
        autoprefixer({
          overrideBrowserslist: [
            "> 1%",
            "last 2 versions",
            "not dead",
            "not Safari < 9",
            "not IE 11",
            "not Edge < 79"
          ],
        }),
      ],
    }
    },
    optimizeDeps: {
      // exclude: ['cjs-dep'], 
      // include: ['esm-dep > cjs-dep']

    },
  resolve: {
    extensions: ['.js','.jsx','.ts','.tsx'],
    alias: {
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      // lodash: 'lodash-es',
      
  },
  },


  preview: {
    plugins:[ basicSsl()],
    cors: {
      origin: [
        'https://carmagnole.ohnoimded.com',
      ],
      credentials: true, // Allow credentials
    },

    port: 3001,
  },
// for dev

  server: {

    port: 3001,
    watch: {
      usePolling: true
    },
  }
});
