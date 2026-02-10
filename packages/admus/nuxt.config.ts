export default defineNuxtConfig({
   modules: [
      '@nuxt/ui',
      '@nuxt/test-utils',
      '@nuxtjs/i18n',
      '@admus/nuxt-module',
   ],

   devtools: {
      enabled: true,
   },

   css: ['~/assets/css/main.css'],

   compatibilityDate: '2025-01-15',

   nitro: {
      rollupConfig: {
         external: ['@rollup/rollup-linux-x64-gnu'],
      },
   },
})
