'use strict';

(function (module) {
    function DraftPlayerModalController($uibModalInstance, $http, player, teams) {
        var self = this;
        self.teams = teams;
        self.player = player;
        self.selectedTeam = null;
        self.loading = false;
        self.error = false;

        self.submit = function () {
            self.loading = true;
            $http.post('/api/draft/player/' + self.player.id + '/team/' + self.selectedTeam.id).success(function () {
                $uibModalInstance.close(true);
            }).error(function (err) {
                self.error = true;
                console.error(err);
                self.loading = false;
            })
        };

        self.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }

    DraftPlayerModalController.$inject = ['$uibModalInstance', '$http', 'player', 'teams'];
    module.controller('DraftPlayerModalController', DraftPlayerModalController);
})(angular.module('SpadeApp'));
