'use strict';

/*
* Angular App
*/

angular.module('blih', [
    'ui.router',
    //'ui.materialize'
])
.config(($stateProvider, $urlRouterProvider) => {
    $stateProvider

    /***************/
    /*** Welcome ***/
    /***************/

    .state('welcome', {
        url: '/',
        templateUrl: '../views/welcome.html',
    })

    /*************/
    /*** Login ***/
    /*************/

    .state('login', {
        url: '/login',
        templateUrl: '../views/login.html',
        controller: 'login'
    })

    /************/
    /*** Home ***/
    /************/

    .state('home', {
        url: '/home',
        templateUrl: '../views/home.html',
        controller: 'home'
    })

    /* Index */
    .state('home.index', {
        url: '/home/index',
        templateUrl: '../views/home/index.html',
    })

    /* Repositories */
    .state('home.repositories', {
        url: '/home/repositories',
        templateUrl: '../views/home/repositories.html',
        controller: 'home.repositories'
    })

    /* Repository */
    .state('home.repository', {
        url: '/home/repository',
        templateUrl: '../views/home/repository.html',
        controller: 'home.repository',
        params: { repository: null }
    })

    /* SSH keys */
    .state('home.ssh-keys', {
        url: '/home/ssh-keys',
        templateUrl: '../views/home/ssh-keys.html',
        controller: 'home.ssh-keys'
    })

    /* Settings */
    .state('home.settings', {
        url: '/home/settings',
        templateUrl: '../views/home/settings.html',
        controller: 'home.settings'
    });

    $urlRouterProvider.otherwise('/home/index');
});
