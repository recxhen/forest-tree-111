import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

/**
 * Vite library mode：將主題打包為 IIFE bundle（theme-entry.js）。
 * - 不使用 @vitejs/plugin-react（避免注入 ESM import）
 * - 改用 esbuild 內建 JSX transform（classic mode：React.createElement）
 * - react / react-dom 映射為全域變數（由平台在載入前注入 window）
 */
export default defineConfig({
  plugins: [tailwindcss()],
  esbuild: {
    jsx: "transform",
    jsxFactory: "__hypelink__.React.createElement",
    jsxFragment: "__hypelink__.React.Fragment",
  },
  build: {
    lib: {
      entry: resolve(__dirname, "app/theme-entry.tsx"),
      formats: ["iife"],
      name: "HypeLinkTheme",
      fileName: () => "theme-entry.js",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      output: {
        globals: {
          react: "__hypelink__.React",
          "react-dom": "__hypelink__.ReactDOM",
          "react/jsx-runtime": "__hypelink__.jsxRuntime",
          "react/jsx-dev-runtime": "__hypelink__.jsxRuntime",
        },
        inlineDynamicImports: true,
        assetFileNames: "style[extname]",
      },
    },
    outDir: "dist/esm",
    cssCodeSplit: false,
    assetsInlineLimit: 1024 * 1024,
  },
});
