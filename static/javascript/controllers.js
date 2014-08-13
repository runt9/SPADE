// Initialize our PlayersApp controller
angular.module('PlayersApp.controllers', []).controller('playersController', ['$scope', '$http', 'playerTeamService', function($scope, $http, playerTeamService) {
    "use strict";

    $http.get('/api/player/').success(function(playersData) {
        var i;
        $scope.playersList = playersData.objects;
        for (i in $scope.playersList) {
            $scope.playersList[i].available = $scope.playersList[i].draft_position == 0;
            $scope.playersList[i].tagged = false;
        }
        // Initialize the list of which players belong to which league team
        $scope.teamsPlayers = playerTeamService.calculateTeamsPlayers($scope.playersList, $scope.leagueTeams);
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
        MRN: 'Mister Rogers Neighborhood',
        HS: 'Heavy Sleepers',
        RD: 'Ricksburg Dealers'
    };
    $scope.predicate = "name";
    $scope.reverse = false;
    $scope.selectedLeagueTeam = "";
    $scope.leaguePositions = ['QB', 'RB', 'RB/WR', 'WR', 'WR/TE', 'OP', 'D/ST', 'K', 'BN1', 'BN2', 'BN3', 'BN4', 'BN5', 'BN6', 'BN7'];
    $scope.teamsPlayers = [];

    // Given a team and a position, grab the player in that position on the given team and return it
    $scope.getTeamPosition = function(team, position) {
        var teamsPlayers = $scope.teamsPlayers;
        return (teamsPlayers[team] !== undefined && teamsPlayers[team][position] !== undefined) ?  teamsPlayers[team][position] : undefined;
    };

    // Wrapper for service layer handler
    $scope.getTeamPositionPlayerCount = function(team, position) {
        return playerTeamService.getTeamPositionPlayerCount(team, position, $scope.teamsPlayers);
    };

}]);

angular.module('DraftBoardApp.controllers', []).controller('draftBoardController', ['$scope', 'draftBoardService', '$interval', function($scope, draftBoardService, $interval) {
    "use strict";
    $scope.draftedPlayers = [
        {
            name: "LeSean McCoy",
            position: "RB",
            league_team: "Team One",
            nfl_team: "PHI",
            round: 1
        },
        {
            name: "Peyton Manning",
            position: "QB",
            league_team: "Team Two",
            nfl_team: "DEN",
            round: 1,
        },
        {
            name: "Tom Brady",
            position: "QB",
            league_team: "Team Three",
            nfl_team: "NE",
            round: 1
        },
    ];
    $scope.currentRound = 1;
    $scope.currentTeam = 'Team Four';
    $scope.rounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    $scope.leagueTeams = ['Team One', 'Team Two', 'Team Three', 'Team Four', 'Team Five', 'Team Six', 'Team Seven', 'Team Eight', 'Team Nine', 'Team Ten'];
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
        var leagueTeams = $scope.leagueTeams;
        var currentIndex = leagueTeams.indexOf($scope.currentTeam);
        var nextIndex;
        var onDeckIndex;
        if ($scope.isSnaking()) {
            nextIndex = (currentIndex - 1 > 0) ? currentIndex - 1 : currentIndex + 1;
            onDeckIndex = (nextIndex - 1 > 0) ? nextIndex - 1 : nextIndex + 1;
        } else {
            nextIndex = (currentIndex + 1 < leagueTeams.length) ? currentIndex + 1 : currentIndex - 1;
            onDeckIndex = (nextIndex + 1 < leagueTeams.length) ? nextIndex + 1 : nextIndex - 1;
        }

        return {
            '1. On the Clock': $scope.currentTeam,
            '2. Next Up': leagueTeams[nextIndex],
            '3. On Deck': leagueTeams[onDeckIndex]
        };
    };

    // TEMPORARY: Exists only for prototype stage. Simulates a draft event coming in.
    $scope.simulated = false;
    $scope.simulateDraftEvent = function() {
        if ($scope.simulated) {
            return;
        }

        $scope.draftedPlayers.push({
            name: "Calvin Johnson",
            position: "WR",
            league_team: "Team Four",
            nfl_team: "DET",
            round: 1
        });

        $scope.timer.time = 300;
        $scope.currentTeam = 'Team Five';

        $scope.simulated = true;
    };
}]);