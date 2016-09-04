'use strict';

(function() {
    angular.module('SpadeApp', [
        'ui.bootstrap',
        'ngCookies'
    ]).filter('removeUnderscores', function () {
        return function (input) {
            return input.replace(/_/g, ' ');
        }
    });
})();