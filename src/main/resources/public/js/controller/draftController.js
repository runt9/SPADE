'use strict';

(function (module) {
    function DraftController($scope, $http, $uibModal, $cookies, $window, EventsPoller) {
        var self = this;

        self.draftId = location.pathname.substr(location.pathname.lastIndexOf('/') + 1);
        self.draft = {};
        self.players = [];
        self.taggedPlayers = [];
        self.possiblePositions = [];
        self.teamPositions = [];
        self.year = new Date().getFullYear();
        self.statsYear = new Date().getFullYear() - 1;
        self.selectedLeagueTeam = null;
        self.selectedLeagueTeamPlayers = [];
        self.sidebarActive = false;
        self.pages = 0;
        self.totalItems = 0;
        self.commish = false;
        self.myTeam = {};

        // Setup the initial draftQuery
        self.draftQuery = {
            pageSize: 50,
            page: 1,
            sortProperty: 'player.draftRank',
            ascending: true,
            nameSearch: null,
            positionId: null,
            nflTeamId: null,
            available: null,
            tagged: null,
            showFreeAgents: false // TODO: Allow people to see free agents
        };

        self.$onInit = function () {
            self.loading = true;

            $http.get('/api/draft/' + self.draftId).success(function (data) {
                self.draft = data.draft;
                self.nflTeams = data.nflTeams;
                self.stats = data.stats;

                if (data.taggedPlayers) {
                    self.taggedPlayers = data.taggedPlayers;
                }

                angular.forEach(self.draft.positionCounts, function (pc) {
                    if (pc.count !== null) {
                        if (pc.position.abbr !== 'BN') {
                            self.possiblePositions.push(pc.position);
                        }
                        for (var i = 0; i < pc.count; i++) {
                            self.teamPositions.push(pc.position);
                        }
                    }
                });

                self.commish = $cookies.get('spade-commish') == self.draftId;
                self.loadTeam();
                self.eventsPoller = new EventsPoller(self.draftId, self.handleEventsPollerResponse);
                self.eventsPoller.startPolling();

                if (data.latestEventId) {
                    self.eventsPoller.lastId = data.latestEventId;
                }
            });
        };

        self.getPlayerPoints = function (player, year) {
            for (var i in player.playerPointTotals) {
                var pt = player.playerPointTotals[i];
                if (pt.year == year) {
                    return pt.value;
                }
            }

            return null;
        };

        self.getPlayerStat = function (player, year, statId) {
            for (var i in player.player.stats) {
                var stat = player.player.stats[i];
                if (stat.year == year && stat.stat.id == statId) {
                    return stat.value;
                }
            }

            return null;
        };

        $scope.$watch('ctrl.draftQuery', function () {
            self.refreshColumns();
            self.reloadPlayers();
        }, true);

        $scope.$watch('ctrl.statsYear', function () {
            self.refreshColumns();
        });

        $scope.$watch('ctrl.selectedLeagueTeam', function () {
            self.refreshSelectedTeamPlayers();
        });

        self.loadTeam = function () {
            var teamId = $cookies.get('spade-draft-' + self.draftId);
            if (teamId) {
                for (var i in self.draft.fantasyTeams) {
                    var team = self.draft.fantasyTeams[i];
                    if (team.id == teamId) {
                        self.myTeam = team;
                        self.selectedLeagueTeam = team;
                    }
                }
            } else {
                self.openSelectTeamModal();
            }
        };

        self.reloadPlayers = function () {
            self.loading = true;

            $http.post('/api/draft/' + self.draftId + '/player', self.draftQuery).success(function (data) {
                self.players = data.content;
                self.totalItems = data.totalElements;
                self.loading = false;
            }).error(function (err) {
                // TODO: error handling
                console.error(err);
            });
        };

        self.toggleTagPlayer = function (player) {
            if (!self.isPlayerAvailable(player)) {
                return;
            }

            var path = self.isPlayerTagged(player) ? '/untag' : '/tag';
            self.loading = true;

            $http.post('/api/draft/' + self.draftId + '/player/' + player.id + path).success(function (data) {
                self.taggedPlayers = data;
                self.loading = false;
                self.reloadPlayers();
            }).error(function (err) {
                // TODO: Handle errors
                console.log(err);
            });
        };

        self.isPlayerTagged = function (player) {
            for (var i in self.taggedPlayers) {
                if (self.taggedPlayers[i] == player.id) {
                    return true;
                }
            }

            return false;
        };

        self.refreshColumns = function () {
            self.columns = [
                {name: 'Pos', sortKey: 'player.position.abbr', getter: function(player){return player.player.position.abbr;}},
                {name: 'NFL Team', sortKey: 'player.nflTeam.abbr', getter: function(player){return player.player.nflTeam && player.player.nflTeam.abbr;}},
                {name: 'Bye', sortKey: 'player.nflTeam.byeWeek', getter: function(player){return player.player.nflTeam && player.player.nflTeam.byeWeek;}},
                {name: 'Team', sortKey: 'team.abbr', getter: function(player){return player.team && player.team.abbr;}},
                {name: 'ADP', sortKey: 'player.averageDraftPosition', getter: function(player){return player.player.averageDraftPosition;}},
                {name: 'Proj. Rank', sortKey: 'player.draftRank', getter: function(player){return player.player.draftRank;}},
                {name: 'Pos. Rank', sortKey: 'player.projectedRank', getter: function(player){return player.player.projectedRank;}},
                {name: 'Points', sortKey: 'points.' + self.statsYear, getter: function(player, year){return self.getPlayerPoints(player, year);}}
            ];

            angular.forEach(self.stats, function (s) {
                if (self.draftQuery.positionId !== null && self.isStatScored(s)) {
                    if (
                        (self.draftQuery.positionId == 1 && ['Passing', 'Rushing'].lastIndexOf(s.groupName) > -1) ||
                        ([2, 3, 5, 6].lastIndexOf(parseInt(self.draftQuery.positionId)) > -1 && ['Rushing', 'Receiving'].lastIndexOf(s.groupName) > -1) ||
                        (self.draftQuery.positionId == 7 && s.groupName == 'Kicking') ||
                        (self.draftQuery.positionId == 8 && s.groupName == 'Defense')
                    ) {
                        self.columns.push({
                            statId: s.id,
                            name: s.shortName,
                            sortKey: 'stat.' + self.statsYear + '.' + s.id,
                            getter: function (player, year, col) {
                                return self.getPlayerStat(player, year, col.statId);
                            }
                        });
                    }
                }
            });
        };

        self.isStatScored = function (stat) {
            for (var i in self.draft.scoringSettings) {
                var ss = self.draft.scoringSettings[i];
                if (ss.valuePerStat !== undefined && ss.valuePerStat != 0 && ss.stat.id == stat.id) {
                    return true;
                }
            }

            return false;
        };

        self.isPlayerAvailable = function (player) {
            return player.team === null;
        };

        self.refreshSelectedTeamPlayers = function () {
            if (self.selectedLeagueTeam === null) {
                return;
            }

            self.selectedLeagueTeamPlayers = [];
            self.loading = true;

            $http.get('/api/team/' + self.selectedLeagueTeam.id + '/player').success(function (teamPlayers) {
                teamPlayers.sort(function (a, b) {
                    return a.draftRound - b.draftRound;
                });

                angular.forEach(self.teamPositions, function (pos) {
                    var tpObj = {position: pos, player: null};
                    for (var j in teamPlayers) {
                        var p = teamPlayers[j];

                        if (p.teamPosition.id == pos.id) {
                            tpObj.player = p;
                            teamPlayers.splice(teamPlayers.indexOf(p), 1);
                            break;
                        }
                    }

                    self.selectedLeagueTeamPlayers.push(tpObj);
                });

                self.loading = false;
            }).error(function (err) {
                // TODO: Error handling
                console.log(err);
            });
        };

        self.playerClicked = function (player) {
            if (!self.commish) return;

            if (self.isPlayerAvailable(player)) {
                self.openDraftPlayerModal(player)
            } else {
                self.unassignPlayer(player);
            }
        };

        self.openSelectTeamModal = function () {
            var modal = $uibModal.open({
                templateUrl: '/selectTeamModal',
                backdrop: 'static',
                keyboard: false,
                size: 'sm',
                controller: 'SelectTeamModalController as $ctrl',
                resolve: {
                    teams: function() {
                        return self.draft.fantasyTeams;
                    }
                }
            });

            modal.result.then(function (data) {
                self.myTeam = data;
                self.selectedLeagueTeam = data;
                $cookies.put('spade-draft-' + self.draftId, data.id);
            });
        };

        // Draft player modal
        self.openDraftPlayerModal = function (player) {
            $uibModal.open({
                templateUrl: '/draftPlayerModal',
                backdrop: true,
                size: 'sm',
                controller: 'DraftPlayerModalController as $ctrl',
                resolve: {
                    teams: function () {
                        return self.draft.fantasyTeams;
                    },
                    player: function () {
                        return player;
                    }
                }
            });
        };

        // Draft player modal
        self.unassignPlayer = function (player) {
            // Main modal
            $uibModal.open({
                templateUrl: '/unassignPlayerModal',
                backdrop: true,
                size: 'sm',
                controller: 'UnassignPlayerModalController as $ctrl',
                resolve: {
                    player: function () {
                        return player;
                    }
                }
            });
        };

        // Events Poller object

        self.findPlayer = function (id) {
            for (var i in self.players) {
                if (self.players[i].id == id) {
                    return self.players[i];
                }
            }
            return null;
        };

        self.openDraftBoard = function () {
            $window.open('/draft/' + self.draftId + '/draftBoard', '_blank');
        };

        self.handleEventsPollerResponse = function (events) {
            if (events.length === 0) {
                return;
            }

            angular.forEach(events, function(event) {
                self.eventsPoller.lastId = event.id;

                var player = self.findPlayer(event.player.id);
                if (player === null) {
                    return;
                }

                // At least for now the event type doesn't matter. Just update the player as they are in the event.
                player.draftRound = event.player.draftRound;
                player.team = event.player.team;
                player.teamPosition = event.player.teamPosition;
                self.reloadPlayers();
                self.refreshSelectedTeamPlayers();
            });
        };
    }

    DraftController.$inject = ['$scope', '$http', '$uibModal', '$cookies', '$window', 'EventsPoller'];
    module.controller('DraftController', DraftController);
})(angular.module('SpadeApp'));
