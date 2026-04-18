import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { compression } from "vite-plugin-compression2";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "apple-touch-icon.png", "robots.txt"],
        manifest: {
          name: "Dan Bahadur Bist Portfolio",
          short_name: "DBB Portfolio",
          description: "Professional portfolio of Dan Bahadur Bist",
          theme_color: "#ffffff",
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
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <mccoremem id="1" />
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "gstatic-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/api\/.*\/*.*/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "images-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
      ...(isProd
        ? [
            compression({ algorithm: "gzip" }), // Compress assets in production
            compression({ algorithm: "brotli" }), // Brotli compression for modern browsers
          ]
        : []),
    ],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      alias: {
        "vaul@1.1.2": "vaul",
        "sonner@2.0.3": "sonner",
        "recharts@2.15.2": "recharts",
        "react-resizable-panels@2.1.7": "react-resizable-panels",
        "react-hook-form@7.55.0": "react-hook-form",
        "react-day-picker@8.10.1": "react-day-picker",
        "next-themes@0.4.6": "next-themes",
        "lucide-react@0.487.0": "lucide-react",
        "input-otp@1.4.2": "input-otp",
        "embla-carousel-react@8.6.0": "embla-carousel-react",
        "cmdk@1.1.1": "cmdk",
        "class-variance-authority@0.7.1": "class-variance-authority",
        "@radix-ui/react-tooltip@1.1.8": "@radix-ui/react-tooltip",
        "@radix-ui/react-toggle@1.1.2": "@radix-ui/react-toggle",
        "@radix-ui/react-toggle-group@1.1.2": "@radix-ui/react-toggle-group",
        "@radix-ui/react-tabs@1.1.3": "@radix-ui/react-tabs",
        "@radix-ui/react-switch@1.1.3": "@radix-ui/react-switch",
        "@radix-ui/react-slot@1.1.2": "@radix-ui/react-slot",
        "@radix-ui/react-slider@1.2.3": "@radix-ui/react-slider",
        "@radix-ui/react-separator@1.1.2": "@radix-ui/react-separator",
        "@radix-ui/react-select@2.1.6": "@radix-ui/react-select",
        "@radix-ui/react-scroll-area@1.2.3": "@radix-ui/react-scroll-area",
        "@radix-ui/react-radio-group@1.2.3": "@radix-ui/react-radio-group",
        "@radix-ui/react-progress@1.1.2": "@radix-ui/react-progress",
        "@radix-ui/react-popover@1.1.6": "@radix-ui/react-popover",
        "@radix-ui/react-navigation-menu@1.2.5":
          "@radix-ui/react-navigation-menu",
        "@radix-ui/react-menubar@1.1.6": "@radix-ui/react-menubar",
        "@radix-ui/react-label@2.1.2": "@radix-ui/react-label",
        "@radix-ui/react-hover-card@1.1.6": "@radix-ui/react-hover-card",
        "@radix-ui/react-dropdown-menu@2.1.6": "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-dialog@1.1.6": "@radix-ui/react-dialog",
        "@radix-ui/react-context-menu@2.2.6": "@radix-ui/react-context-menu",
        "@radix-ui/react-collapsible@1.1.3": "@radix-ui/react-collapsible",
        "@radix-ui/react-checkbox@1.1.4": "@radix-ui/react-checkbox",
        "@radix-ui/react-avatar@1.1.3": "@radix-ui/react-avatar",
        "@radix-ui/react-aspect-ratio@1.1.2": "@radix-ui/react-aspect-ratio",
        "@radix-ui/react-alert-dialog@1.1.6": "@radix-ui/react-alert-dialog",
        "@radix-ui/react-accordion@1.2.3": "@radix-ui/react-accordion",
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      sourcemap: !isProd, // Only generate sourcemaps in development
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
      open: true,
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
