import createPackageInformation from './scripts/create-package-informatin';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    localeDirPath: process.env.NODE_ENV === 'development' ? '.dev/locales' : 'src/locales',
  },

  future: {
    compatibilityVersion: 4,
  },

  nitro: {
    output: {
      dir: process.env.PLAYGROUND === 'true' ? 'playground/node_modules/mundart' : 'dist',
    },
    hooks: {
      close: () => {
        createPackageInformation();
      },
    },
  },

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  colorMode: {
    preference: 'light',
  },
});
