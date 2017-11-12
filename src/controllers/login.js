'use strict';

angular.module('blih')
.controller('login', function ($scope, $state, Blih, Settings, Materialize) {
    $scope.email = Settings.get('email');
    $scope.loading = false;

    $scope.login = () => {
        $scope.loading = true;
        Blih.init($scope.email, $scope.password)
            .then(() => {
                console.log('ok');
                $scope.loading = false;
                // Store email for next connection
                Settings.set('email', $scope.email);
                $state.go('home.index');
            }).catch((err) => {
                $scope.loading = false;
                Materialize.toast(err);
            });
    };

    // TODO: init to check if blih is down.
});
