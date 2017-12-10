import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

/* CSS */
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import './assets/css/fonts/icon.css'
import './assets/css/custom.css'

Vue.use(Vuetify);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
