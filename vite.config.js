import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ["./src/components"],
    }),
    AutoImport({
      dts: true, // or a custom path
      dirs: [
        "./src/stores",
        "./src/classes",
        "./src/utils",
        "./src/composables",
      ],
      imports: ["vue"],
    }),
  ],
});
