import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import en from './i18n/en.json';
import de from './i18n/de.json';
import App from './App.vue';

const i18n = createI18n({
  locale: 'de-DE',
  fallbackLocale: 'de',
  messages: {
    en,
    de,
  },
});

const app = createApp(App);
app.use(i18n);
app.mount('#app');
