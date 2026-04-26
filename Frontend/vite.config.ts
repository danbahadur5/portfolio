import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { compression } from "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
    css: {
      transformer: "lightningcss",
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
        manifest: {
          name: "Dan Bahadur Bist Portfolio",
          short_name: "DBB Portfolio",
          description: "Full Stack Developer Portfolio",
          theme_color: "#000000",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
      compression({
        algorithm: "gzip",
        exclude: [/\.(br)$/, /\.(gz)$/],
      }),
      compression({
        algorithm: "brotliCompress",
        exclude: [/\.(br)$/, /\.(gz)$/],
      }),
    ],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "esnext",
      outDir: "dist",
      cssMinify: true,
      sourcemap: !isProd,
      minify: "esbuild", // Switched to esbuild to avoid terser dependency issues on Vercel
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
                return "vendor-core";
              }
              if (id.includes("@radix-ui")) {
                return "vendor-ui";
              }
              if (id.includes("framer-motion") || id.includes("motion")) {
                return "vendor-animation";
              }
              if (id.includes("lucide-react")) {
                return "vendor-icons";
              }
              if (id.includes("recharts")) {
                return "vendor-charts";
              }
              return "vendor-others";
            }
            if (id.includes("/src/components/ui")) {
              return "ui-components";
            }
            if (id.includes("/src/components/dashboard")) {
              return "dashboard-components";
            }
          },
          // Use hashed filenames for better caching
          entryFileNames: isProd
            ? "assets/[name].[hash].js"
            : "assets/[name].js",
          chunkFileNames: isProd
            ? "assets/[name].[hash].js"
            : "assets/[name].js",
          assetFileNames: isProd
            ? "assets/[name].[hash].[ext]"
            : "assets/[name].[ext]",
        },
      },
    },
    server: {
      port: 5000,
          },
    // Use root path for Vercel static hosting; absolute origins break asset URLs
    base: "/",
    // Enable dependency optimization
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
    // Cache busting for production
    cacheDir: ".vite-cache",
  };
});
