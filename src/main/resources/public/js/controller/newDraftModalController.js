'use strict';

(function (module) {
    function NewDraftModalController($uibModalInstance, $http, $window) {
        var self = this;
        //self.loading = true;
        self.error = false;
        self.randomDraftOrder = true;
        self.draft = {
            fantasyTeams: [{abbr: '', name: '', draftOrder: 0}]
        };

        self.addTeam = function () {
            var draftOrder = self.draft.fantasyTeams.length;
            self.draft.fantasyTeams.push({abbr: '', name: '', draftOrder: draftOrder});
        };

        self.removeTeam = function (team) {
            var i = self.draft.fantasyTeams.indexOf(team);
            self.draft.fantasyTeams.splice(i, 1);
        };

        self.submit = function () {
            self.loading = true;

            $http.post('/api/draft', self.draft).then(function (data) {
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

    NewDraftModalController.$inject = ['$uibModalInstance', '$http', '$window'];
    module.controller('NewDraftModalController', NewDraftModalController);
})(angular.module('SpadeApp'));
