'use strict';

const Store = require('electron-store');

angular.module('blih')
.factory('Settings', () => {
    const settings = new Store({
        name: 'settings'
    });

    return {
        store: () => settings.store,
        get: (key) => settings.get(key),
        set: (key, value) => { settings.set(key, value); },
        clear: () => { settings.clear(); }
    };
});
