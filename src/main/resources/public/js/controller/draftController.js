'use strict';

(function (module) {
    function DraftController($http, $uibModal, $interval, draftService) {
        var self = this;

        self.draftId = location.pathname.substr(location.pathname.lastIndexOf('/') + 1);
        self.draft = {};
        self.possiblePositions = [];
        self.teamPositions = [];
        self.year = new Date().getFullYear();

        self.$onInit = function () {
            self.loading = true;

            $http.get('/api/draft/' + self.draftId).success(function (data) {
                self.draft = data.draft;
                self.nflTeams = data.nflTeams;
                self.stats = data.stats;

                angular.forEach(self.draft.positionCounts, function (pc) {
                    if (pc.count !== null) {
                        self.possiblePositions.push(pc.position);
                        for (var i = 0; i < pc.count; i++) {
                            self.teamPositions.push(pc.position);
                        }
                    }
                });

                self.loading = false;
            });
        };

        self.predicate = "name";
        self.reverse = false;
        self.selectedLeagueTeam = "";
        self.teamsPlayers = [];
        self.sidebarActive = false;

        self.isPlayerAvailable = function (player) {
            return player.team === null;
        };

        // Given a team and a position, grab the player in that position on the given team and return it
        self.getTeamPosition = function (team, position) {
            var teamsPlayers = self.teamsPlayers;
            return (teamsPlayers[team] !== undefined && teamsPlayers[team][position] !== undefined) ? teamsPlayers[team][position] : undefined;
        };

        // Wrapper for service layer handler
        self.getTeamPositionPlayerCount = function (team, position) {
            return draftService.getTeamPositionPlayerCount(team, position, self.teamsPlayers);
        };

        self.playerClicked = function (clicked) {
            var player = clicked.player;
            if (player.available) {
                self.openDraftPlayerModal(player)
            } else {
                self.unassignPlayer(player);
            }
        };

        // Draft player modal
        self.openDraftPlayerModal = function (player) {
            // Pull in the scope'd stuff we need below
            var leagueTeams = self.leagueTeams;
            self.team = {
                id: 0
            };

            // Main modal
            $uibModal.open({
                templateUrl: 'draft_player_modal.html',
                backdrop: true,
                size: 'sm',
                controller: function (self, $modalInstance, leagueTeams, playerId, team) {
                    self.loading = false;
                    self.error = false;
                    self.errorMessage = '';
                    self.team = team;
                    self.leagueTeams = leagueTeams;
                    self.playerId = playerId;

                    self.submit = function () {
                        self.loading = true;
                        // Post the team id to the player draft endpoint, close the modal on success
                        $http.post('/api/player/' + self.playerId + '/draft/', {teamId: self.team.id}).success(function () {
                            $modalInstance.close(true);
                        }).error(function (response) {
                            self.error = true;
                            self.errorMessage = response;
                            self.loading = false;
                        });
                    };

                    self.cancel = function () {
                        $modalInstance.dismiss(false);
                    };
                },
                resolve: {
                    leagueTeams: function () {
                        return leagueTeams;
                    },
                    playerId: function () {
                        return player.id;
                    },
                    team: function () {
                        return self.team;
                    }
                }
            });
        };

        // Draft player modal
        self.unassignPlayer = function (player) {
            // Main modal
            $uibModal.open({
                templateUrl: 'unassign_player_modal.html',
                backdrop: true,
                size: 'sm',
                controller: function (self, $modalInstance, player) {
                    self.loading = false;
                    self.error = false;
                    self.errorMessage = '';
                    self.player = player;

                    self.submit = function () {
                        self.loading = true;
                        // Call the player unassign endpoint and close the modal when done
                        $http.get('/api/player/' + self.player.id + '/unassign/').success(function () {
                            $modalInstance.close(true);
                        }).error(function (response) {
                            self.error = true;
                            self.errorMessage = response;
                            self.loading = false;
                        });
                    };

                    self.cancel = function () {
                        $modalInstance.dismiss(false);
                    };
                },
                resolve: {
                    player: function () {
                        return player;
                    }
                }
            });
        };

        // Events Poller object
        self.EventsPoller = {
            isPolling: false,
            lastId: 0, // Tracks the last id we got
            pollInstance: null,
            doPoll: function () {
                // Send along our last poll time to the events endpoint to let the server know
                // how far back to check for new events to give us
                $http.get('/events/?id=' + self.EventsPoller.lastId).success(function (response) {
                    self.EventsPoller.handleResponse(response);
                });
            },
            // Big handler of the response. Knows about all event types and data that can be sent.
            handleResponse: function (response) {
                var i, events, event, data, index;
                if (response.length === 0) {
                    return;
                }
                events = response;
                for (i in events) {
                    event = events[i];
                    self.EventsPoller.lastId = event.id;
                    data = event.data;
                    switch (event.type) {
                        case 'playerDrafted':
                            index = self.findPlayer(data.id);
                            if (index === -1) {
                                return;
                            }

                            self.playersList[index].draft_position = data.draft_position;
                            self.playersList[index].league_team = data.league_team;
                            self.playersList[index].available = false;
                            self.playersList[index].tagged = false;
                            self.teamsPlayers = draftService.calculateTeamsPlayers(self.playersList, self.leagueTeams);
                            break;
                        case 'playerUnassigned':
                            index = self.findPlayer(data.id);
                            if (index === -1) {
                                return;
                            }

                            self.playersList[index].draft_position = 0;
                            self.playersList[index].league_team = '';
                            self.playersList[index].available = true;
                            self.teamsPlayers = draftService.calculateTeamsPlayers(self.playersList, self.leagueTeams);
                            break;
                        case 'playerAdded':
                            data.available = true;
                            data.tagged = false;
                            self.playersList.push(data);
                            break;
                        default:
                    }
                }
            },
            startPolling: function () {
                self.EventsPoller.pollInstance = $interval(function () {
                    self.EventsPoller.doPoll();
                }, 10000);
                self.EventsPoller.isPolling = true;
            },
            stopPolling: function () {
                $interval.cancel(self.EventsPoller.pollInstance);
                self.EventsPoller.pollInstance = null;
                self.EventsPoller.isPolling = false;
            }
        };

        self.findPlayer = function (id) {
            var i;
            for (i in self.playersList) {
                if (self.playersList[i].id == id) {
                    return i;
                }
            }
            return -1;
        };
    }

    DraftController.$inject = ['$http', '$uibModal', '$interval', 'draftService'];
    module.controller('DraftController', DraftController);
})(angular.module('SpadeApp'));
