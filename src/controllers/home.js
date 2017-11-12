'use strict';

const moment = require('moment');

angular.module('blih')
/* Home */
.controller('home', function ($scope, $state, Blih) {
    $scope.exit = () => {
        Blih.reset();
        $state.go('login');
    };
})
/* Home.Repositories */
.controller('home.repositories', function ($scope, $state, Blih, Materialize) {
    $scope.loading = false;
    $scope.init = true;

    $scope.addModal = () => {
        addModal.open();
    };

    $scope.create = () => {
        $scope.loading = true;
        Blih.create($scope.name)
            .then((data) => {
                Materialize.toast(data.message);
                addModal.close();
                $state.go('home.repository', { repository: $scope.name });
            }).catch((err) => {
                Materialize.toast(err);
            }).finally(() => {
                $scope.loading = false;
            });
    };

    /* Init */
    const addModal = new M.Modal(document.querySelector('#addModal'));
    Blih.getRepositories()
        .then((data) => { $scope.repositories = Object.keys(data.repositories).filter(r => r.length > 0).sort(); })
        .catch((err) => { $scope.error = err; Materialize.toast(err); })
        .finally(() => { $scope.init = false; });
})
/* Home.Repositories.Detail */
.controller('home.repository', function ($scope, $state, $stateParams, Blih, Materialize) {
    $scope.rights = { 'r': false, 'w': false, 'a': false};
    $scope.loading = false;
    $scope.init = true;

    $scope.deleteModal = () => {
        deleteModal.open();
    };

    $scope.addModal = () => {
        addModal.open();
    };

    $scope.delete = () => {
        $scope.loading = true;
        Blih.delete($scope.info.name)
            .then((data) => {
                Materialize.toast(data.message);
                deleteModal.close();
                $state.go('home.repositories');
            }).catch((err) => {
                Materialize.toast(err);
            }).finally(() => {
                $scope.loading = false;
            });
    };

    $scope.add = () => {
        let rightsStr = Object.keys($scope.rights)
                        .filter(k => $scope.rights[k] == true)
                        .reduce((acc, r) => acc + r, '');
        if (rightsStr.length == 0) {
            Materialize.toast('No ACL selected');
        } else {
            $scope.loading = true;
            Blih.setACL($scope.info.name, $scope.name, rightsStr)
                .then((data) => {
                    Materialize.toast(data.message);
                    return Blih.getACL($scope.info.name);
                })
                .then((data) => {
                    $scope.acl = Object.keys(data).map(c => ({ name: c, rights: data[c] }));
                    addModal.close();
                }).catch((err) => {
                    Materialize.toast(err);
                }).finally(() => {
                    $scope.loading = false;
                });
        }
    };

    /* Init */
    const deleteModal = new M.Modal(document.querySelector('#deleteModal'));
    const addModal = new M.Modal(document.querySelector('#addModal'));
    Blih.all([
        Blih.getRepository($stateParams.repository),
        Blih.getACL($stateParams.repository),
    ]).then((data) => {
        $scope.info = data[0].message;
        $scope.info.name = $stateParams.repository;
        $scope.info.creation_time = moment(Number($scope.info.creation_time)).format('LLL');
        $scope.acl = Object.keys(data[1]).map(c => ({ name: c, rights: data[1][c] }));
    })
    .catch((err) => { $scope.error = err; Materialize.toast(err); })
    .finally(() => { $scope.init = false; });
})
/* Home.SSH-Keys */
.controller('home.ssh-keys', function ($scope, $state, Blih, Materialize) {
    $scope.loading = false;
    $scope.init = true;

    $scope.keysModal = () => {
        ins.open();
    };

    $scope.upload = () => {
        $scope.loading = true;
        // Read key
        Blih.upload($scope.keyPath)
            .then((data) => {
                Materialize.toast(data);
                ins.close();
            }).catch((err) => {
                Materialize.toast(err);
            }).finally(() => {
                $scope.loading = false;
            });
    };

    /* Init */
    const modal = document.querySelector('.modal');
    const ins = new M.Modal(modal);
    Blih.getKeys()
        .then((data) => { $scope.keys = Object.keys(data); })
        .catch((err) => { $scope.error = err; Materialize.toast(err); })
        .finally(() => { $scope.init = false; });
})
// $scope.keys = Object.keys(data).map(k => ({ id: k, data: data[k] }));
/* Home.Settings */
.controller('home.settings', function ($scope, $state, Blih, Settings, Materialize) {
    $scope.welcome = Settings.get('welcome', true);

    $scope.save = () => {
        Settings.set('welcome', $scope.welcome);
        Materialize.toast('Changes saved');
    };
});
