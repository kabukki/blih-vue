import Vue from 'vue'

import App from './App'
import store from './store'
import router from './router'

/* CSS */
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import './assets/css/fonts/icon.css'
import './assets/css/custom.css'

Vue.use(Vuetify);

Vue.config.productionTip = false

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
}).$mount('#app')
