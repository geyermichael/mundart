import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
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

  modules: [
    '@nuxt/eslint',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error config.plugins is not defined in the type
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
