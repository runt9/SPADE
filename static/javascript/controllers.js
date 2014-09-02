// Initialize our PlayersApp controller
angular.module('PlayersApp.controllers', []).controller('playersController',
    ['$scope', '$http', '$modal', '$interval', 'playerTeamService',
    function($scope, $http, $modal, $interval, playerTeamService) {
    "use strict";

    $scope.loading = true;
    $http.get('/api/player/').success(function(playersData) {
        var i;
        $scope.playersList = playersData.objects;
        for (i in $scope.playersList) {
            $scope.playersList[i].available = $scope.playersList[i].draft_position === 0;
            $scope.playersList[i].tagged = false;
        }
        // Initialize the list of which players belong to which league team
        $scope.teamsPlayers = playerTeamService.calculateTeamsPlayers($scope.playersList, $scope.leagueTeams);
        $scope.loading = false;
        $scope.EventsPoller.startPolling();
    });

    $scope.positions = ['QB', 'RB', 'WR', 'TE', 'D/ST', 'K'];
    $scope.nflTeams = {
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
    $scope.leagueTeams = {
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
    $scope.predicate = "name";
    $scope.reverse = false;
    $scope.selectedLeagueTeam = "";
    $scope.leaguePositions = ['QB', 'RB', 'RB/WR', 'WR', 'WR/TE', 'OP', 'D/ST', 'K', 'BN1', 'BN2', 'BN3', 'BN4', 'BN5', 'BN6', 'BN7'];
    $scope.teamsPlayers = [];
    $scope.sidebarActive = false;

    // Given a team and a position, grab the player in that position on the given team and return it
    $scope.getTeamPosition = function(team, position) {
        var teamsPlayers = $scope.teamsPlayers;
        return (teamsPlayers[team] !== undefined && teamsPlayers[team][position] !== undefined) ?  teamsPlayers[team][position] : undefined;
    };

    // Wrapper for service layer handler
    $scope.getTeamPositionPlayerCount = function(team, position) {
        return playerTeamService.getTeamPositionPlayerCount(team, position, $scope.teamsPlayers);
    };

    // Login stuff
    $scope.authorized = false;
    $scope.openLoginModal = function () {
        // There's weird scoping issues in angular bootstrap-ui. We have to use this password object
        // to work around this. It would be nice to do this a cleaner way, though
        $scope.password = {
            string: ''
        };

        // Main modal
        $modal.open({
            templateUrl: 'login_modal.html',
            backdrop: true,
            size: 'sm',
            controller: function ($scope, $modalInstance, password) {
                $scope.loading = false;
                $scope.error = false;
                $scope.errorMessage = '';
                $scope.password = password;

                // On submit, post the password to the login endpoint. If it succeeds, return that success
                // so we can set global authorization. Otherwise, show an error message and keep the modal up
                $scope.submit = function () {
                    $scope.loading = true;
                    $http.post('/admin_login/', {password: $scope.password.string}).success(function () {
                        $modalInstance.close(true);
                    }).error(function (response) {
                        $scope.error = true;
                        $scope.errorMessage = response;
                        $scope.loading = false;
                    });
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss(false);
                };
            },
            resolve: {
                password: function() {
                    return $scope.password;
                }
            }
        }).result.then(function(result) {
            if (result) {
                $scope.authorized = true;
            }
        });
    };

    // Quick logout method to destroy our authorization
    $scope.logout = function() {
        $scope.loading = true;
        $http.get('/admin_logout/').success(function() {
            $scope.authorized = false;
            $scope.loading = false;
        }).error(function() {
            $scope.loading = false;
        });
    };

    $scope.playerClicked = function(clicked) {
        var player = clicked.player;
        if (player.available) {
            $scope.openDraftPlayerModal(player)
        } else {
            $scope.unassignPlayer(player);
        }
    };

    // Draft player modal
    $scope.openDraftPlayerModal = function (player) {
        // Pull in the scope'd stuff we need below
        var leagueTeams = $scope.leagueTeams;
        $scope.team = {
            id: 0
        };

        // Main modal
        $modal.open({
            templateUrl: 'draft_player_modal.html',
            backdrop: true,
            size: 'sm',
            controller: function ($scope, $modalInstance, leagueTeams, playerId, team) {
                $scope.loading = false;
                $scope.error = false;
                $scope.errorMessage = '';
                $scope.team = team;
                $scope.leagueTeams = leagueTeams;
                $scope.playerId = playerId;

                $scope.submit = function () {
                    $scope.loading = true;
                    // Post the team id to the player draft endpoint, close the modal on success
                    $http.post('/api/player/' + $scope.playerId + '/draft/', {teamId: $scope.team.id}).success(function () {
                        $modalInstance.close(true);
                    }).error(function (response) {
                        $scope.error = true;
                        $scope.errorMessage = response;
                        $scope.loading = false;
                    });
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss(false);
                };
            },
            resolve: {
                leagueTeams: function() {
                    return leagueTeams;
                },
                playerId: function() {
                    return player.id;
                },
                team: function() {
                    return $scope.team;
                }
            }
        });
    };

    // Draft player modal
    $scope.unassignPlayer = function (player) {
        // Main modal
        $modal.open({
            templateUrl: 'unassign_player_modal.html',
            backdrop: true,
            size: 'sm',
            controller: function ($scope, $modalInstance, player) {
                $scope.loading = false;
                $scope.error = false;
                $scope.errorMessage = '';
                $scope.player = player;

                $scope.submit = function () {
                    $scope.loading = true;
                    // Call the player unassign endpoint and close the modal when done
                    $http.get('/api/player/' + $scope.player.id + '/unassign/').success(function () {
                        $modalInstance.close(true);
                    }).error(function (response) {
                        $scope.error = true;
                        $scope.errorMessage = response;
                        $scope.loading = false;
                    });
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss(false);
                };
            },
            resolve: {
                player: function() {
                    return player;
                }
            }
        });
    };

    // Events Poller object
    $scope.EventsPoller = {
        isPolling: false,
        lastId: 0, // Tracks the last id we got
        pollInstance: null,
        doPoll: function() {
            // Send along our last poll time to the events endpoint to let the server know
            // how far back to check for new events to give us
            $http.get('/events/?id=' + $scope.EventsPoller.lastId).success(function(response) {
                $scope.EventsPoller.handleResponse(response);
            });
        },
        // Big handler of the response. Knows about all event types and data that can be sent.
        handleResponse: function(response) {
            var i, events, event, data, index;
            if (response.length === 0) {
                return;
            }
            events = response;
            for (i in events) {
                event = events[i];
                $scope.EventsPoller.lastId = event.id;
                data = event.data;
                switch (event.type) {
                    case 'playerDrafted':
                        index = $scope.findPlayer(data.id);
                        if (index === -1) {
                            return;
                        }

                        $scope.playersList[index].draft_position = data.draft_position;
                        $scope.playersList[index].league_team = data.league_team;
                        $scope.playersList[index].available = false;
                        $scope.playersList[index].tagged = false;
                        $scope.teamsPlayers = playerTeamService.calculateTeamsPlayers($scope.playersList, $scope.leagueTeams);
                        break;
                    case 'playerUnassigned':
                        index = $scope.findPlayer(data.id);
                        if (index === -1) {
                            return;
                        }

                        $scope.playersList[index].draft_position = 0;
                        $scope.playersList[index].league_team = '';
                        $scope.playersList[index].available = true;
                        $scope.teamsPlayers = playerTeamService.calculateTeamsPlayers($scope.playersList, $scope.leagueTeams);
                        break;
                    case 'playerAdded':
                        data.available = true;
                        data.tagged = false;
                        $scope.playersList.push(data);
                        break;
                    default:
                }
            }
        },
        startPolling: function() {
            $scope.EventsPoller.pollInstance = $interval(function() { $scope.EventsPoller.doPoll(); }, 10000);
            $scope.EventsPoller.isPolling = true;
        },
        stopPolling: function() {
            $interval.cancel($scope.EventsPoller.pollInstance);
            $scope.EventsPoller.pollInstance = null;
            $scope.EventsPoller.isPolling = false;
        }
    };

    $scope.findPlayer = function(id) {
        var i;
        for (i in $scope.playersList) {
            if ($scope.playersList[i].id == id) {
                return i;
            }
        }
        return -1;
    };

    // Draft player modal
    $scope.openAddPlayerModal = function (player) {
        // Pull in the scope'd stuff we need below
        var nflTeams = $scope.nflTeams;
        var positions = $scope.positions;
        $scope.player = {
            name: "",
            position: "",
            nfl_team: "",
            bye_week: 0
        };

        // Main modal
        $modal.open({
            templateUrl: 'add_player_modal.html',
            backdrop: true,
            size: 'sm',
            controller: function ($scope, $modalInstance, nflTeams, positions, player) {
                $scope.loading = false;
                $scope.error = false;
                $scope.errorMessage = '';
                $scope.nflTeams = nflTeams;
                $scope.positions = positions;
                $scope.player = player;

                $scope.submit = function () {
                    var data = {
                        name: $scope.player.name,
                        position: $scope.player.position,
                        nfl_team: $scope.player.nfl_team,
                        bye_week: $scope.player.bye_week
                    };
                    $scope.loading = true;
                    $http.post('/api/player/new/', data).success(function () {
                        $modalInstance.close(true);
                    }).error(function (response) {
                        $scope.error = true;
                        $scope.errorMessage = response;
                        $scope.loading = false;
                    });
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss(false);
                };
            },
            resolve: {
                nflTeams: function() {
                    return nflTeams;
                },
                positions: function() {
                    return positions;
                },
                player: function() {
                    return $scope.player;
                }
            }
        });
    };
}]);

angular.module('DraftBoardApp.controllers', []).controller('draftBoardController',
    ['$scope', '$http', 'draftBoardService', '$interval',
    function($scope, $http, draftBoardService, $interval) {
    "use strict";

    $scope.playersList = [];
    $scope.loading = true;
    $http.get('/api/player/').success(function(playersData) {
        var i;
        $scope.playersList = playersData.objects;
        $scope.playersList.sort(function(a, b) {
            if (a.draft_position < b.draft_position) {
                return -1;
            }
            if (a.draft_position > b.draft_position) {
                return 1;
            }

            return 0
        });
        for (i in $scope.playersList) {
            if ($scope.playersList[i].draft_position > 0) {
                $scope.addToDraftedPlayers($scope.playersList[i]);
            }
        }
        $scope.loading = false;
        $scope.currentTeam = draftBoardService.getCurrentTeam($scope.playersList, $scope.draftBoard);
        $scope.EventsPoller.startPolling();
    });

    $scope.draftedPlayers = [];
    $scope.currentRound = 1;
    $scope.rounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    $scope.leagueTeams = [
        {pick: 0, short_name: 'MRN', long_name: 'Mister Rogers Neighborhood'},
        {pick: 7, short_name: 'HS', long_name: 'Heavy Sleepers'},
        {pick: 9, short_name: 'RD', long_name: 'Ricksburg Dealers'},
        {pick: 1, short_name: 'ZZZ', long_name: 'Catchin ZZZZs'},
        {pick: 3, short_name: 'JK', long_name: 'Tatooine Jedi Knights'},
        {pick: 4, short_name: 'YOUN', long_name: 'Team Youngblood'},
        {pick: 2, short_name: 'KRUG', long_name: 'Team Kruger'},
        {pick: 8, short_name: 'VARG', long_name: 'Team Varghese'},
        {pick: 6, short_name: 'VSL', long_name: 'Virtual SideLines'},
        {pick: 5, short_name: 'SKAR', long_name: 'Team Skariah'},
    ];
    $scope.currentTeam = $scope.leagueTeams[0];
    $scope.draftBoard = draftBoardService.prepareDraftBoard($scope.rounds, $scope.leagueTeams);

    $scope.getDraftedPlayer = function(team, round) {
        return draftBoardService.getDraftedPlayer(team, round, $scope.draftedPlayers)
    };

    // Ticker object to maintain configuration and updating of the ticker
    $scope.ticker = {
        // Starting position
        position: angular.element(document.getElementById('tickerBox'))[0].offsetWidth,
        margin: 20,
        moveFlag: true,

        // Returns the left offset the ticker should have.
        getTickerLeft: function() {
            return $scope.ticker.position + $scope.ticker.margin + 'px';
        },

        // Moves the ticker by dropping the position by one, which causes an Angular bind to call the getTickerLeft
        // above, which will move the ticker over by 1 pixel.
        tickerMove: function() {
            var tickerDiv = angular.element(document.getElementById('ticker'))[0];
            var tickerBox = angular.element(document.getElementById('tickerBox'))[0];

            if ($scope.ticker.moveFlag) {
                $scope.ticker.position -= 2;

                // If the ticker div is all the way off the left side of the screen, reset it to the default position,
                // which is off to the right of the screen
                if (tickerDiv.offsetLeft < (0 - (tickerDiv.offsetWidth + $scope.ticker.margin))) {
                    $scope.ticker.position = tickerBox.offsetWidth + $scope.ticker.margin;
                }
            }
        }
    };

    // Timer object to maintain configuration and updating of the timer
    $scope.timer = {
        time: 300,
        playing: false,

        updateTimer: function() {
            if ($scope.timer.playing && $scope.timer.time > 0) {
                $scope.timer.time--;
            }
        },
        formatTime: function() {
            var time = $scope.timer.time;

            var minutes = Math.floor(time / 60);
            var seconds = Math.floor(time - (minutes * 60));
            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            return minutes + ":" + seconds;
        },
        toggle: function() {
            $scope.timer.playing = !$scope.timer.playing;
        }
    };

    // Initialize our ticker and timer when the page loads.
    $scope.init = function() {
        $interval($scope.ticker.tickerMove, 10);
        $interval($scope.timer.updateTimer, 1000);
    };

    $scope.getCssClassForPlayer = function(player) {
        return draftBoardService.getCssClassForPlayer(player);
    };

    $scope.isObjectEmpty = function(obj) {
        return draftBoardService.isObjectEmpty(obj);
    };

    // Returns whether or not we're in "reverse" this round
    $scope.isSnaking = function() {
        return $scope.currentRound % 2 === 0;
    };

    // Gets the list of teams for on the clock, next up, and on deck
    $scope.getNextTeams = function() {
        var i;
        var nextTeam, onDeckTeam = 'None';
        var lastDraftPosition = draftBoardService.getLastDraftPosition($scope.playersList);

        for (i in $scope.draftBoard) {
            if ($scope.draftBoard[i].draft_position == (lastDraftPosition + 1)) {
                nextTeam = $scope.draftBoard[i].team.long_name;
            } else if ($scope.draftBoard[i].draft_position == (lastDraftPosition + 2)) {
                onDeckTeam = $scope.draftBoard[i].team.long_name;
            }
        }

        return {
            '1. On the Clock': $scope.currentTeam.long_name,
            '2. Next Up': nextTeam,
            '3. On Deck': onDeckTeam
        };
    };

    // Events Poller object
    $scope.EventsPoller = {
        isPolling: false,
        lastId: 0, // Tracks the last timestamp of when we polled
        pollInstance: null,
        doPoll: function() {
            // Send along our last poll time to the events endpoint to let the server know
            // how far back to check for new events to give us
            $http.get('/events/?id=' + $scope.EventsPoller.lastId).success(function(response) {
                $scope.EventsPoller.handleResponse(response);
            });
        },
        // Big handler of the response. Knows about all event types and data that can be sent.
        handleResponse: function(response) {
            var i, j, events, event, data, index, player;
            if (response.length === 0) {
                return;
            }
            events = response;
            for (i in events) {
                event = events[i];
                $scope.EventsPoller.lastId = event.id;
                data = event.data;
                switch (event.type) {
                    case 'playerDrafted':
                        index = $scope.findPlayer(data.id);
                        if (index === -1) {
                            return;
                        }

                        player = $scope.playersList[index];
                        player.draft_position = data.draft_position;
                        player.league_team = data.league_team;
                        $scope.addToDraftedPlayers(player);
                        $scope.timer.time = 300;
                        $scope.currentTeam = draftBoardService.getCurrentTeam($scope.playersList, $scope.draftBoard);
                        break;
                    case 'playerUnassigned':
                        index = $scope.findPlayer(data.id);
                        if (index === -1) {
                            return;
                        }

                        player = $scope.playersList[index];
                        player.draft_position = 0;
                        player.league_team = '';

                        for (j in $scope.draftedPlayers) {
                            if ($scope.draftedPlayers[j].id == data.id) {
                                $scope.draftedPlayers.splice(j, 1);
                            }
                        }
                        $scope.timer.time = 300;
                        $scope.currentTeam = draftBoardService.getCurrentTeam($scope.playersList, $scope.draftBoard);
                        break;
                    case 'playerAdded':
                        data.available = true;
                        data.tagged = false;
                        $scope.playersList.push(data);
                        break;
                    default:
                }
            }
        },
        startPolling: function() {
            $scope.EventsPoller.pollInstance = $interval(function() { $scope.EventsPoller.doPoll(); }, 10000);
            $scope.EventsPoller.isPolling = true;
        },
        stopPolling: function() {
            $interval.cancel($scope.EventsPoller.pollInstance);
            $scope.EventsPoller.pollInstance = null;
            $scope.EventsPoller.isPolling = false;
        }
    };

    $scope.addToDraftedPlayers = function(player) {
        $scope.draftedPlayers.push({
           id: player.id,
           name: player.name,
           position: player.position,
           league_team: player.league_team,
           nfl_team: player.nfl_team,
           round: Math.ceil(player.draft_position / 10),
           draft_position: player.draft_position
       });
    };

    $scope.findPlayer = function(id) {
        var i;
        for (i in $scope.playersList) {
            if ($scope.playersList[i].id == id) {
                return i;
            }
        }
        return -1;
    };
}]);