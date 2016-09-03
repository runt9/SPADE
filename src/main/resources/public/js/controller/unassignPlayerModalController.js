'use strict';

(function (module) {
    function UnassignPlayerModalController($uibModalInstance, $http, player) {
        var self = this;
        self.player = player;
        self.loading = false;
        self.error = false;

        self.submit = function () {
            $http.post('/api/draft/player/' + self.player.id + '/unassign').success(function () {
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

    UnassignPlayerModalController.$inject = ['$uibModalInstance', '$http', 'player'];
    module.controller('UnassignPlayerModalController', UnassignPlayerModalController);
})(angular.module('SpadeApp'));
