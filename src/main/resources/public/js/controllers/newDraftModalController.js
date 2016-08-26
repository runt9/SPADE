'use strict';

(function (module) {
    function NewDraftModalController($uibModalInstance, $http, $window) {
        var self = this;
        self.loading = true;
        self.error = false;
        self.leaguePositions = [];
        self.draft = {};

        self.$onInit = function () {
            $http.get('/api/leaguePositions').then(function (data) {
                self.leaguePositions = data.data;
                self.loading = false;
            }, function (err) {
                self.loading = false;
                console.error(err);
            });
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
