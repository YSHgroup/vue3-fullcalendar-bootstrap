// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///F:/Git%20hub%20work/Collaborator/vue3-fullcalendar-bootstrap/node_modules/vite/dist/node/index.js";
import vue from "file:///F:/Git%20hub%20work/Collaborator/vue3-fullcalendar-bootstrap/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///F:/Git%20hub%20work/Collaborator/vue3-fullcalendar-bootstrap/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Components from "file:///F:/Git%20hub%20work/Collaborator/vue3-fullcalendar-bootstrap/node_modules/unplugin-vue-components/dist/vite.js";
import { BootstrapVueNextResolver } from "file:///F:/Git%20hub%20work/Collaborator/vue3-fullcalendar-bootstrap/node_modules/unplugin-vue-components/dist/resolvers.js";
import sass from "file:///F:/Git%20hub%20work/Collaborator/vue3-fullcalendar-bootstrap/node_modules/sass/sass.node.mjs";
var __vite_injected_original_import_meta_url = "file:///F:/Git%20hub%20work/Collaborator/vue3-fullcalendar-bootstrap/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [BootstrapVueNextResolver()]
      // Automatically register the bootstrap components globally
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass
      }
    }
  },
  base: process.env.NODE_ENV === "production" ? "/vue3-fullcalendar-bootstrap/" : "/"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxHaXQgaHViIHdvcmtcXFxcQ29sbGFib3JhdG9yXFxcXHZ1ZTMtZnVsbGNhbGVuZGFyLWJvb3RzdHJhcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcR2l0IGh1YiB3b3JrXFxcXENvbGxhYm9yYXRvclxcXFx2dWUzLWZ1bGxjYWxlbmRhci1ib290c3RyYXBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L0dpdCUyMGh1YiUyMHdvcmsvQ29sbGFib3JhdG9yL3Z1ZTMtZnVsbGNhbGVuZGFyLWJvb3RzdHJhcC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHtCb290c3RyYXBWdWVOZXh0UmVzb2x2ZXJ9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuaW1wb3J0IHNhc3MgZnJvbSAnc2FzcydcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICB2dWVKc3goKSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICByZXNvbHZlcnM6IFtCb290c3RyYXBWdWVOZXh0UmVzb2x2ZXIoKV0gLy8gQXV0b21hdGljYWxseSByZWdpc3RlciB0aGUgYm9vdHN0cmFwIGNvbXBvbmVudHMgZ2xvYmFsbHlcclxuICAgIH0pXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY3NzOiB7XHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBpbXBsZW1lbnRhdGlvbjogc2FzcyxcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmFzZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gJy92dWUzLWZ1bGxjYWxlbmRhci1ib290c3RyYXAvJyA6IFwiL1wiLFxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNXLFNBQVMsZUFBZSxXQUFXO0FBRXpZLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUSxnQ0FBK0I7QUFDdkMsT0FBTyxVQUFVO0FBUDhNLElBQU0sMkNBQTJDO0FBVWhSLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyx5QkFBeUIsQ0FBQztBQUFBO0FBQUEsSUFDeEMsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNLFFBQVEsSUFBSSxhQUFhLGVBQWUsa0NBQWtDO0FBQ2xGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
