import { ignoreCaseSort, getConfig, getData } from '../helpers';

let [data, config] = [getData(), getConfig()];

export default {
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
    state.repositories = state.repositories.filter(r => r.name !== payload.name);
  },
  UPDATE_KEYS (state, payload) {
    state.keys = payload.keys;
  },
  ADD_KEY (state, payload) {
    state.keys.push(payload);
    state.keys = state.keys.sort(ignoreCaseSort);
  },
  REMOVE_KEY (state, payload) {
    state.keys = state.keys.filter(k => k.name !== payload.name);
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
    state.collaborators.push(payload);
    data.set('collaborators', state.collaborators.sort(ignoreCaseSort));
  },
  UPDATE_COLLABORATOR (state, payload) {
    let index = state.collaborators.findIndex(c => c.name === payload.name);
    if (index >= 0) {
      state.collaborators[index] = payload;
      data.set('collaborators', state.collaborators.sort(ignoreCaseSort));
    }
  },
  UPDATE_MODULE (state, payload) {
    let index = state.modules.findIndex(c => c.name === payload.name);
    if (index >= 0) {
      state.modules[index] = payload;
      data.set('modules', state.modules.sort(ignoreCaseSort));
    }
  }
};
