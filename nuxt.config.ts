// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@element-plus/nuxt", "@pinia/nuxt"],

  css: ["~/assets/style/global.scss"],

  // buildModules: ["@nuxtjs/style-resources"],

  // styleResources: {
  //   scss: ["~/assets/style/fonts.scss"],
  // },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/style/_fonts.scss";',
        },
      },
    },
  },
});
