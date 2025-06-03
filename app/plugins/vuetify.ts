import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    defaults: {
      global: {
        ripple: false,
        elevation: 0,
        density: 'comfortable',
        variant: 'flat',
      },
      VBtn: {
        class: 'text-none',
      },
    },
  });
  app.vueApp.use(vuetify);
});
