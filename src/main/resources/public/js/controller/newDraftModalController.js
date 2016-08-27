'use strict';

(function (module) {
    function NewDraftModalController($uibModalInstance, $http, $window, appConstants) {
        var self = this;
        self.loading = true;
        self.error = false;
        self.leaguePositions = appConstants.possibleLeaguePositions;
        self.draft = {};

        self.submit = function () {
            self.loading = true;

            // ng-list + jade = not happy, so just manually split before post here...
            var draftData = self.draft;
            draftData.fantasyTeams = draftData.fantasyTeams.split('\n');
            draftData.positions = draftData.positions.split('\n');

            $http.post('/api/draft', draftData).then(function (data) {
                $window.location.href = '/draft/' + data.data.id;
            }, function (err) {
                self.error = true;
                self.loading = false;
                console.error(err);
            });
        };

        self.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }

    NewDraftModalController.$inject = ['$uibModalInstance', '$http', '$window', 'appConstants'];
    module.controller('NewDraftModalController', NewDraftModalController);
})(angular.module('SpadeApp'));
