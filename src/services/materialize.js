'use strict';

angular.module('blih')
.factory('Materialize', () => {
    return {
        toast: (data) => {
            M.Toast.dismissAll();
            M.toast({ html: data });
        }
    };
});
