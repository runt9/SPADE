'use strict';

(function() {
    angular.module('SpadeApp', [
        'ui.bootstrap'
    ]).filter('removeUnderscores', function () {
        return function (input) {
            return input.replace(/_/g, ' ');
        }
    });
})();