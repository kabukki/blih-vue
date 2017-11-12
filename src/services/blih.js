'use strict';

const Blih = require('blih-api');

angular.module('blih')
.factory('Blih', ($q) => {
    let api = null;
    let email = null;

    function blih(method, ...args) {
        let defer = $q.defer();
        args[args.length] = (err, data) => {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(data);
            }
        };
        api[method](...args);
        return defer.promise;
    }

    return {
        init: (email, password) => {
            let defer = $q.defer();
            /* First, check if Blih is down */
            this.email = email;
            api = new Blih(email, password);
            // get whoami or something
            api.getRepositories((err) => {
                if (err) {
                    defer.reject(err);
                } else {
                    defer.resolve();
                }
            });
            return defer.promise;
        },
        create: (name) => blih('createRepository', name),
        delete: (name) => blih('deleteRepository', name),
        setACL: (repository, name, rights) => blih('setAcl', repository, name, rights),
        upload: (key) => blih('setSshKey', key),
        getRepositories: () => blih('getRepositories'),
        getRepository: (repository) => blih('getRepositoriesInfo', repository),
        getACL: (repository) => {
            // TODO: check if only specific error is caught
            return blih('getAcl', repository)
                .catch((err) =>  err !== 'No ACLs');
        },
        getKeys: () => blih('getSshKey'),
        email: () => email,
        reset: () => {
            api = null;
            email = null;
        },
        all: (promises) => {
            return $q.all(promises);
        }
    };
});
