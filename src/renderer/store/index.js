import Vue from 'vue'
import Vuex from 'vuex'

import Blih from 'blih'
import Store from 'electron-store';

Vue.use(Vuex)

function ignoreCaseSort (a, b) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  else return 0;
}

/* Default data */

const defaultColorMap = {
    a: 'red', b: 'pink', c: 'purple', d: 'deep-purple',
    e: 'indigo', f: 'blue', g: 'light-blue', h: 'cyan',
    i: 'teal', j: 'green', k: 'light-green', l: 'lime',
    m: 'yellow darken-1', n: 'amber', o: 'orange', p: 'deep-orange',
    q: 'brown', r: 'blue-grey', s: 'grey', t: 'red lighten-2',
    u: 'pink lighten-2', v: 'purple lighten-2',w: 'deep-purple lighten-2', x: 'indigo lighten-2',
    y: 'blue lighten-2', z: 'light-blue lighten-2', '0': 'cyan lighten-2', '1': 'teal lighten-2',
    '2': 'green lighten-2', '3': 'light-green lighten-2', '4': 'lime lighten-2', '5': 'yellow',
    '6': 'amber lighten-2', '7': 'orange lighten-2', '8': 'deep-orange lighten-2', '9': 'brown lighten-2',
};

const defaultModules = [
    {
        name: 'Artificial Intelligence',
        icon: 'bubble_chart',
        color: 'green',
        regexp: [
            '^dante$', '^gomoku$'
        ]
    }, {
        name: 'Assembly',
        icon: 'code',
        color: 'brown',
        regexp: [
            '^asm_'
        ]
    }, {
        name: 'Mathematics',
        icon: 'functions',
        color: 'indigo',
        regexp: [
            '101pong', '102cipher', '103architect', '104intersection', '105torus', '106bombyx', '107transfer', '108trigo', '109titration', '110borwein',
            '201yams', '202unsold', '203hotline', '207demography', '208dowels', '209poll',
            '301dannon'
        ]
    }, {
        name: 'French',
        icon: 'edit',
        color: 'red',
        regexp: [
            'B1Lettre', 'B1Mailpro', 'B1Rush',
            'B2EMPLOI', 'B2PRECISER', 'B2VENTE',
            'B4BILAN', 'B4DIAPO', 'B4RECADRER',
            'B53EMAILS', 'B5AVOCAT', 'B5MEMO', 'FICTION1',
            '^Disparition20\\d{2}'
        ]
    }, {
        name: 'CPE',
        icon: 'code',
        color: 'grey',
        regexp: [
            '^CPE_', '^marvin_', '^sudoki-bi$'
        ]
    }, {
        name: 'PSU',
        icon: 'code',
        color: 'amber',
        regexp: [
            '^PSU_'
        ]
    }, {
        name: 'C++',
        icon: 'code',
        color: 'lime',
        regexp: [
            '^cpp_nanotekspice$', '^cpp_arcade$'
        ]
    }, {
        name: 'Computer graphics',
        icon: 'desktop_windows',
        color: 'deep-orange',
        regexp: [
            '^alphachannel_20\\d{2}$', '^binarizer_20\\d{2}$', '^chatty_20\\d{2}$', '^chromatic_20\\d{2}$',
            '^flip_part_20\\d{2}$', '^flashlight_20\\d{2}$', '^iconofsin_20\\d{2}$', '^lightning_20\\d{2}$',
            '^mystic_20\\d{2}$', '^mystify_20\\d{2}$', '^nocss_20\\d{2}$', '^noise_20\\d{2}$', '^starfield_20\\d{2}$',
            '^stretcher_20\\d{2}$', '^text_foot_20\\d{2}$', '^whirlpool_20\\d{2}$', '^xorshape_20\\d{2}$',
            '^gfx_', '^tekadventure$', '^bsraytracer1$', '^raytracer1$', '^wireframe$', '^wolf3d$'
        ]
    }, {
        name: 'C Pool',
        icon: 'pool',
        color: 'light-blue',
        regexp: [
            '^Piscine_C', '^CPool_'
        ]
    }, {
        name: 'C++ Pool',
        icon: 'pool',
        color: 'cyan',
        regexp: [
            '^cpp_d[01]\\d[am]*', '^cpp_gkrellm$', '^cpp_spider$'// TODO: add rush repos
        ]
    }, {
        name: '.NET',
        icon: 'code',
        color: 'teal',
        regexp: [
            '^DOT_'
        ]
    }, {
        name: 'OCaml',
        icon: 'code',
        color: 'yellow',
        regexp: [
            '^OCAML_'
        ]
    }, {
        name: 'Shell',
        icon: 'code',
        color: 'blue-grey',
        regexp: [
            '^SHL_'
        ]
    }, {
        name: 'Java',
        icon: 'code',
        color: 'orange',
        regexp: [
            '^Java_\\w+_20\\d{2}'
        ]
    }, {
        name: 'Internship',
        icon: 'work',
        color: 'pink',
        regexp: [
            '^stageTEK'
        ]
    }, {
        name: 'Security',
        icon: 'lock',
        color: 'deep-orange',
        regexp: [
            '^binary_seminar$'
        ]
    }, {
        name: 'Cryptography',
        icon: 'lock',
        color: 'deep-purple',
        regexp: [
            '^pamela$'
        ]
    }, {
        name: 'Android',
        icon: 'android',
        color: 'light-green',
        regexp: [

        ]
    }, {
        name: 'Synthesis pool',
        icon: 'pool',
        color: 'blue',
        regexp: [
            '^ADM_', 'automakefile', 'calendar', 'FASTAtools', 'palindrome', 'projTester', 'SBMLparser'
        ]
    }
];

const defaultThemes = [
    {
        name: 'Default',
        colors: {
            "primary": "#1976D2",
            "secondary": "#424242",
            "accent": "#82B1FF",
            "error": "#FF5252",
            "warning": "#FFC107",
            "info": "#2196F3",
            "success": "#4CAF50"
        },
    }, {
        name: 'Halloween',
        colors: {
            "primary": "#FB8C00",
            "secondary": "#000000",
            "accent": "#FFD180",
            "error": "#F44336",
            "warning": "#FFC107",
            "info": "#2196F3",
            "success": "#4CAF50"
        }
    }, {
        name: 'Christmas',
        colors: {
            "primary": "#F44336",
            "secondary": "#2E7D32",
            "accent": "#795548",
            "error": "#F44336",
            "warning": "#FFC107",
            "info": "#2196F3",
            "success": "#4CAF50"
        }
    }
];

/* Persistent data */

let config = new Store({
    defaults: {
        lastEmail: '',
        theme: 'light',
        dark: false,
        welcome: true,
    }
});

let data = new Store({
    name: 'data',
    defaults: {
        collaborators: [],
        colorMap: defaultColorMap,
        modules: defaultModules,
        themes: defaultThemes
    }
});

/*
 * Vuex
 */

// TODO: one object for all config and data
const state = {
    api: null,
    email: null,
    login: null,
    repositories: [],
    keys: [],
    /* Config */
    lastEmail: config.get('lastEmail'),
    theme: config.get('theme'),
    dark: config.get('dark'),
    welcome: config.get('welcome'),
    /* Data */
    collaborators: data.get('collaborators').sort(ignoreCaseSort),
    colorMap: data.get('colorMap'),
    modules: data.get('modules').sort(ignoreCaseSort),
    themes: data.get('themes').sort(ignoreCaseSort)
};

const getters = {
    api: state => state.api,
    email: state => state.email,
    login: state => state.login,
    repositories: state => state.repositories,
    keys: state => state.keys,
    /* Config */
    lastEmail: state => state.lastEmail,
    theme: state => state.theme,
    dark: state => state.dark,
    welcome: state => state.welcome,
    /* Data */
    collaborators: state => state.collaborators,
    colorMap: state => state.colorMap,
    colorOf: state => text => {
        const letter = (text && text.length) && text[0].toLowerCase() || '?';
        return defaultColorMap[letter] || 'black';
    },
    modules: state => state.modules,
    getModule: state => repo => {
        for (const module of state.modules) {
            for (const regexp of module.regexp) {
                if (repo.match(regexp)) {
                    return {
                        name: module.name,
                        icon: module.icon,
                        color: module.color,
                    };
                }
            }
        }
        return null;
    },
    themes: state => state.themes
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
    ADD_REPOSITORY (state, payload) {
        state.repositories.push(payload);
        state.repositories = state.repositories.sort(ignoreCaseSort);
    },
    REMOVE_REPOSITORY (state, payload) {
        state.repositories = state.repositories.filter(r => r.name != payload.name);
    },
    UPDATE_KEYS (state, payload) {
        state.keys = payload.keys;
    },
    ADD_KEY (state, payload) {
        state.keys.push(payload);
        state.keys = state.keys.sort(ignoreCaseSort);
    },
    REMOVE_KEY (state, payload) {
        state.keys = state.keys.filter(k => k.name != payload.name);
    },
    /* Config */
    SET_LAST_EMAIL (state, payload) {
        state.lastEmail = payload.email;
        config.set('lastEmail', state.lastEmail);
    },
    SET_THEME (state, payload) {
        state.theme = payload.theme;
        config.set('theme', state.theme);
    },
    SET_DARK (state, payload) {
        state.dark = payload.value;
        config.set('dark', state.dark);
    },
    SET_WELCOME (state, payload) {
        state.welcome = payload.value;
        config.set('welcome', state.welcome);
    },
    /* Data */
    ADD_COLLABORATOR (state, payload) {
        console.log('adding ' + payload.name);
        state.collaborators.push({
            name: payload.name,
            picture: payload.picture || false
        });
        data.set('collaborators', state.collaborators.sort(ignoreCaseSort));
    },
};

const actions = {
    authenticate (context, credentials) {
        try {
            let api = new Blih({ email: credentials.email, password: credentials.password });

            return api.whoami()
                .then(data => {
                    context.commit('AUTHENTICATE', {
                        api,
                        email: credentials.email,
                        login: data.message
                    });
                });
        } catch (err) {
            return Promise.reject(err);
        }
    },
    updateRepositories (context) {
        return context.getters.api.listRepositories()
            .then(data => {
                context.commit('UPDATE_REPOSITORIES', {
                  repositories: data.sort(ignoreCaseSort)
                    .map(r => Object.freeze({
                        ...r,
                        module: context.getters.getModule(r.name)
                    }))
                });
            });
    },
    createRepository (context, name) {
        return context.getters.api.createRepository(name)
            .then(_ => {
                context.commit('ADD_REPOSITORY', {
                    name,
                    label: context.getters.getModule(name)
                });
            });
    },
    deleteRepository (context, name) {
        return context.getters.api.deleteRepository(name)
            .then(_ => {
                context.commit('REMOVE_REPOSITORY', {
                    name
                });
            });
    },
    updateKeys (context) {
        return context.getters.api.listKeys()
            .then(data => {
                context.commit('UPDATE_KEYS', { keys: data });
            });
    },
    uploadKey (context, key) {
        const oldKeys = context.getters.keys;
        return context.getters.api.uploadKey(key)
            .then(_ => context.dispatch('updateKeys'))
            // Return the new key
            .then(_ => context.getters.keys.filter(k => !oldKeys.find(ok => ok.name == k.name))[0])
    },
    deleteKey (context, key) {
        return context.getters.api.deleteKey(key)
            .then(_ => {
                context.commit('REMOVE_KEY', {
                    name: key
                });
            });
    },
    /* Config */
    setLastEmail (context, email) {
        context.commit('SET_LAST_EMAIL', { email });
    },
    setTheme (context, theme) {
        context.commit('SET_THEME', { theme });
    },
    setDark (context, value) {
        context.commit('SET_DARK', { value });
    },
    setWelcome (context, value) {
        context.commit('SET_WELCOME', { value });
    },
    /* Data */
    addCollaborator (context, name) {
        if (!context.getters.collaborators.find(c => c.name == name)) {
            context.commit('ADD_COLLABORATOR', {
                name,
                picture: (name.includes('@epitech.eu'))
                ? 'https://cdn.local.epitech.eu/userprofil/profilview/' + name.split('@epitech.eu')[0] + '.jpg'
                : false
            });
        }
    },
};

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    strict: process.env.NODE_ENV !== 'production'
});
