'use strict';

(function (module) {
    function NewDraftModalController($scope, $uibModalInstance, $http, $window, scoringDefaultsService) {
        var self = this;

        self.loading = true;
        self.error = false;
        self.randomDraftOrder = true;
        self.stats = [];
        self.scoringSettingCategories = [];
        self.draft = {
            leagueType: null,
            fantasyTeams: [{abbr: '', name: '', draftOrder: 0}],
            positionCounts: [],
            scoringSettings: []
        };

        self.$onInit = function () {
            $http.get('/api/newDraftInfo').success(function (data) {
                self.leagueTypes = data.leagueTypes;
                self.draft.leagueType = data.leagueTypes[0];

                angular.forEach(data.positions, function (p) {
                    self.draft.positionCounts.push({
                        position: p,
                        count: 0
                    });
                });

                self.stats = data.stats;
                self.recalculateScoringDefaults();
                self.loading = false;
            });
        };

        self.recalculateScoringDefaults = function () {
            // Empty the scoring settings first
            self.draft.scoringSettings = [];
            angular.forEach(self.stats, function (s) {
                // null, empty string, whatever, it's fine. Ignore this stat if scoring type isn't set
                if (!s.scoringType) {
                    return;
                }

                if (self.scoringSettingCategories.indexOf(s.groupName) === -1) {
                    self.scoringSettingCategories.push(s.groupName);
                }

                self.draft.scoringSettings.push({
                    stat: s,
                    valuePerStat: scoringDefaultsService.getDefaultForStat(s, self.draft.leagueType)
                });
            });
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
        };

        $scope.$watch('$ctrl.draft.leagueType', function () {
            self.recalculateScoringDefaults();
        });
    }

    NewDraftModalController.$inject = ['$scope', '$uibModalInstance', '$http', '$window', 'scoringDefaultsService'];
    module.controller('NewDraftModalController', NewDraftModalController);
})(angular.module('SpadeApp'));
