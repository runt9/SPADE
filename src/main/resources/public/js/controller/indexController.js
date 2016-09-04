'use strict';

(function (module) {
    function IndexController($uibModal) {
        var self = this;

        self.newDraft = function () {
            $uibModal.open({
                templateUrl: '/newDraftModal',
                backdrop: true,
                size: 'lg',
                controller: 'NewDraftModalController as $ctrl'
            });
        };
    }

    IndexController.$inject = ['$uibModal'];
    module.controller('IndexController', IndexController);
})(angular.module('SpadeApp'));
