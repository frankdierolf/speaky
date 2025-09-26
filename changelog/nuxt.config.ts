// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxtjs/mdc",
  ],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  mdc: {
    highlight: {
      langs: ["diff", "ts", "vue", "css"],
    },
    remarkPlugins: {
      "remark-github": {
        options: {
          repository: "frankdierolf/speaky",
        },
      },
    },
  },

  ui: {
    theme: {
      defaultVariants: {
        color: "neutral",
      },
    },
  },

  routeRules: {
    "/": { prerender: true },
  },

  nitro: {
    preset: "vercel",
  },

  experimental: {
    appManifest: false,
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
