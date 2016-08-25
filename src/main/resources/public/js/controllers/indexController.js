'use strict';

(function(module) {
    function IndexController($window, $http) {
        var self = this;

        self.login = function () {
            $window.location.href = '/login';
        };

        self.logout = function () {
            $http.post('/logout');
        };
    }

    IndexController.$inject = ['$window', '$http'];
    module.controller('IndexController', IndexController);
})(angular.module('SpadeApp'));
