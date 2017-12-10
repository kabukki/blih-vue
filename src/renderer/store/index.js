import Vue from 'vue'
import Vuex from 'vuex'

import Blih from 'blih'

Vue.use(Vuex)

function ignoreCaseSort (a, b) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  else return 0;
}

const state = {
    theme: 'light',
    api: null,
    email: null,
    login: null,
    repositories: [],
    keys: [],
    knownRepositories: {
        maths: [
            '101pong', '102cipher', '103architect', '104interville', '106bombyx', '107transfer', '108', '109titration', '110borwein',
            '201', '202', '203hotline', '204', '205', '206', '207', '209', '210',
            '301dannon', '302', '303', '304', '305', '306', '307', '309', '310',
        ],
        french: [
            'B1Lettre', 'B1Mailpro', 'B1Rush',
            'B2EMPLOI', 'B2PRECISER',
            'B4BILAN', 'B4DIAPO', 'B4RECADRER',
            'B53EMAILS', 'B5AVOCAT', 'B5MEMO', 'FICTION1'
        ],
        cppPool: [
            'cpp_d01', 'cpp_d02m', 'cpp_d02a', 'cpp_d03', // TODO: add rush repos
            'cpp_d06', 'cpp_d07m', 'cpp_d07a', 'cpp_d08', 'cpp_d09', 'cpp_d10',
            'cpp_d13', 'cpp_d14m', 'cpp_d14a', 'cpp_d15', 'cpp_d16', 'cpp_d17'
        ],
        internship: []
    },
    knownCollaborators: [
        'ramassage-tek', 'fernan_x', 'benhab_i', 'jaunet_n', 'da-pur_c', 'ophelie.berrier@epitech.eu', 'pellat_c'
    ]
};

const getters = {
    theme: state => state.theme,
    api: state => state.api,
    email: state => state.email,
    login: state => state.login,
    repositories: state => state.repositories,
    keys: state => state.keys,
    knownRepositories: state => state.knownRepositories,
    knownCollaborators: state => state.knownCollaborators
};

const mutations = {
    SET_THEME (state, payload) {
        state.theme = payload.theme;
    },
    /* API */
    AUTHENTICATE (state, payload) {
        state.api = payload.api;
        state.email = payload.email;
        state.login = payload.login;
    },
    /* Repositories */
    UPDATE_REPOSITORIES (state, payload) {
        state.repositories = payload.repositories;
    },
    ADD_REPOSITORY (state, payload) {
        state.repositories.push(payload);
        state.repositories = state.repositories.sort(ignoreCaseSort);
    },
    REMOVE_REPOSITORY (state, payload) {
        state.repositories = state.repositories.filter(r => r.name != payload.name);
    },
    /* SSH keys */
    UPDATE_KEYS (state, payload) {
        state.keys = payload.keys;
    }
};

const actions = {
    setTheme (context, theme) {
        context.commit('SET_THEME', { theme });
    },
    authenticate (context, credentials) {
        let api = new Blih({ email: credentials.email, password: credentials.password });

        return api.whoami()
            .then(data => {
                context.commit('AUTHENTICATE', {
                    api,
                    email: credentials.email,
                    login: data.message
                });
            });
    },
    /* Repositories */
    updateRepositories (context) {
        return context.getters.api.listRepositories()
            .then(data => {
                context.commit('UPDATE_REPOSITORIES', {
                  repositories: data.sort(ignoreCaseSort)
                });
            });
    },
    createRepository (context, name) {
        return context.getters.api.createRepository(name);
    },
    deleteRepository (context, name) {
        return context.getters.api.deleteRepository(name);
    },
    /* SSH keys */
    updateKeys (context) {
        return context.getters.api.listKeys()
            .then(data => {
                context.commit('UPDATE_KEYS', { keys: data });
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
