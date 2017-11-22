import Vue from 'vue'
import Vuex from 'vuex'

import Blih from 'blih'

Vue.use(Vuex)

const state = {
    api: null,
    email: null,
    login: null,
    repositories: [],
    keys: []
};

const getters = {
    api: state => state.api,
    email: state => state.email,
    login: state => state.login,
    repositories: state => state.repositories,
    keys: state => state.keys
};

const mutations = {
    AUTHENTICATE (state, payload) {
        state.api = payload.api;
        state.email = payload.email;
        state.login = payload.login;
    },
    UPDATE_REPOSITORIES (state, payload) {
        state.repositories = payload.repositories;
    },
    UPDATE_KEYS (state, payload) {
        state.keys = payload.keys;
    }
};

const actions = {
    authenticate (context, credentials) {
        let api = new Blih(credentials.email, credentials.password);

        return api.whoami()
            .then(data => {
                context.commit('AUTHENTICATE', {
                    api,
                    email: credentials.email,
                    login: data.message
                });
            });
    },
    updateRepositories (context) {
        return context.getters.api.listRepositories()
            .then(data => {
                const repositories = data.repositories;
                context.commit('UPDATE_REPOSITORIES', {
                    repositories: Object.keys(repositories)
                                    .filter(r => r.length > 0).sort()
                                    .map(r => ({
                                        name: r,
                                        url: repositories[r].url,
                                        uuid: repositories[r].uuid
                                    }))
                });
            });
    },
    updateKeys (context) {
        return context.getters.api.listKeys()
            .then(data => {
                context.commit('UPDATE_KEYS', {
                     keys: Object.keys(data)
                            .filter(k => k.length > 0).sort()
                            .map(k => ({
                                name: k,
                                data: data[k]
                            }))
                });
            });
    }
};

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    strict: process.env.NODE_ENV !== 'production'
});
