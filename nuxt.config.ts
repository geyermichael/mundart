import fs from 'fs';
import { name, version, description } from './package.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    localeDirPath: process.env.NODE_ENV === 'development' ? 'dev/locales' : 'src/locales',
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
        generatePackageJson();
      },
    },
  },

  modules: ['@nuxt/ui', '@nuxt/eslint'],

  colorMode: {
    preference: 'light',
  },
});

function generatePackageJson() {
  const packageJson = {
    name,
    version,
    description,
    main: 'server/index.mjs',
    keywords: ['i18n', 'editor', 'internationalization', 'localization'],
  };

  fs.writeFileSync(`${process.cwd()}/dist/package.json`, JSON.stringify(packageJson, null, 2));

  console.log('Generated package.json');
}
