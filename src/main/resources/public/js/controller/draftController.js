'use strict';

(function (module) {
    function DraftController($http, $uibModal, $interval, draftService) {
        var self = this;

        self.loading = true;
        $http.get('/api/player').success(function (playersData) {
            var i;
            self.playersList = playersData.content;
            for (i in self.playersList) {
                self.playersList[i].available = self.playersList[i].draft_position === 0;
                self.playersList[i].tagged = false;
            }
            // Initialize the list of which players belong to which league team
            self.teamsPlayers = draftService.calculateTeamsPlayers(self.playersList, self.leagueTeams);
            self.loading = false;
            self.EventsPoller.startPolling();
        });

        self.positions = ['QB', 'RB', 'WR', 'TE', 'D/ST', 'K'];
        self.nflTeams = {
            ARI: 'Arizona Cardinals',
            ATL: 'Atlanta Falcons',
            BAL: 'Baltimore Ravens',
            BUF: 'Buffalo Bills',
            CAR: 'Carolina Panthers',
            CHI: 'Chicago Bears',
            CIN: 'Cincinnati Bengals',
            CLE: 'Cleveland Browns',
            DAL: 'Dallas Cowboys',
            DEN: 'Denver Broncos',
            DET: 'Detroit Lions',
            GB: 'Green Bay Packers',
            HOU: 'Houston Texans',
            IND: 'Indianapolis Colts',
            JAX: 'Jacksonville Jaguars',
            KC: 'Kansas City Chiefs',
            MIA: 'Miami Dolphins',
            MIN: 'Minnesota Vikings',
            NE: 'New England Patriots',
            NO: 'New Orleans Saints',
            NYG: 'New York Giants',
            NYJ: 'New York Jets',
            OAK: 'Oakland Raiders',
            PHI: 'Philadelphia Eagles',
            PIT: 'Pittsburgh Steelers',
            SD: 'San Diego Chargers',
            SEA: 'Seattle Seahawks',
            SF: 'San Francisco 49ers',
            STL: 'Saint Louis Rams',
            TB: 'Tampa Bay Buccaneers',
            TEN: 'Tennessee Titans',
            WAS: 'Washington Redskins'
        };
        self.leagueTeams = {
            'MRN': 'Mister Rogers Neighborhood',
            'HS': 'Heavy Sleepers',
            'RD': 'Ricksburg Dealers',
            'ZZZ': 'Catchin ZZZZs',
            'JK': 'Tatooine Jedi Knights',
            'YOUN': 'Team Youngblood',
            'KRUG': 'Team Kruger',
            'VARG': 'Team Varghese',
            'VSL': 'Virtual SideLines',
            'SKAR': 'Team Skariah'
        };
        self.predicate = "name";
        self.reverse = false;
        self.selectedLeagueTeam = "";
        self.leaguePositions = ['QB', 'RB', 'RB/WR', 'WR', 'WR/TE', 'OP', 'D/ST', 'K', 'BN1', 'BN2', 'BN3', 'BN4', 'BN5', 'BN6', 'BN7'];
        self.teamsPlayers = [];
        self.sidebarActive = false;

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
