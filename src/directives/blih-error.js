'use strict';

angular.module('blih')
.directive('blihError', () => {
    return {
        restrict: 'E',
        template: "<div class='row'><div class='col s12'><div class='center promo'><i class='teal-text material-icons'>error</i><p class='promo-caption'>Aw, snap!</p><p class='center light'>An error occurred: {{ message }}</p></div></div></div>",
        scope: {
            message: '@message'
        },
        controller: ($scope) => {
            console.log('before compilation');
        },
        link: (scope, element, attrs) => {
            console.log('after compilation');
        }
    };
});
