import tailwindcss from "@tailwindcss/vite";
import { siteHost } from "./app/misc";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
    "shadcn-nuxt",
    "@nuxtjs/i18n",
  ],
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
      extensions: ["vue"],
    },
  ],
  devServer: {
    port: 2362,
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  i18n: {
    restructureDir: "app/i18n",
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en.json" },
      { code: "ja", language: "ja-JP", name: "日本語", file: "ja.json" },
      { code: "zh", language: "zh-CN", name: "简体中文", file: "zh.json" },
    ],
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    baseUrl: siteHost,
  },
  icon: {
    size: "1.1rem",
  },
  fonts: {
    families: [
      { name: "Noto Sans", provider: "fontsource" },
      { name: "Noto Sans JP", provider: "fontsource" },
      { name: "Noto Sans SC", provider: "fontsource" },
    ],
  },
});
