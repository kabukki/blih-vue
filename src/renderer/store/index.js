import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

Vue.use(Vuex);

/*
 * Vuex
 */

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  strict: process.env.NODE_ENV !== 'production'
});
