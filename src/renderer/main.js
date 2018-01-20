import Vue from 'vue';

import App from './App';
import store from './store';
import router from './router';

/* CSS */
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import './assets/css/fonts/icon.css';
import './assets/css/custom.css';

const theme = store.getters.themes.find(t => t.name === store.getters.theme);
Vue.use(Vuetify, theme && {
    theme: theme.colors
});

Vue.config.productionTip = false;

/* Skip welcome page ? */
if (!store.getters.welcome) {
    router.push({ name: 'login' });
}

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app');
