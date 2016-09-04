'use strict';

(function (module) {
    function SelectTeamModalController($uibModalInstance, teams) {
        var self = this;
        self.teams = teams;
        self.selectedTeam = null;

        self.submit = function () {
            $uibModalInstance.close(self.selectedTeam);
        };
    }

    SelectTeamModalController.$inject = ['$uibModalInstance', 'teams'];
    module.controller('SelectTeamModalController', SelectTeamModalController);
})(angular.module('SpadeApp'));
