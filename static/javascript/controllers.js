// Initialize our PlayersApp controller
// TODO: Remove hardcoded players list and wire up to endpoint
angular.module('PlayersApp.controllers', []).controller('playersController', ['$scope', 'playerTeamService', '$log', function($scope, playerTeamService, $log) {
    "use strict";
    $scope.playersList = [
       {
           name: "Peyton Manning",
           position: "QB",
           nfl_team: "DEN",
           games_played: "16",
           espn_ranking: "1",
           last_season_points: "500",
           league_team: "RD",
           available: false,
           tagged: false,
           passing_yards: "5000"
       },
       {
           name: "Tom Brady",
           position: "QB",
           nfl_team: "NE",
           games_played: "16",
           espn_ranking: "2",
           last_season_points: "500",
           league_team: "RD",
           available: false,
           tagged: false,
           passing_yards: "4000"
       },
       {
           name: "LeSean McCoy",
           position: "RB",
           nfl_team: "PHI",
           games_played: "16",
           espn_ranking: "3",
           last_season_points: "499",
           league_team: 'MRN',
           available: false,
           tagged: false,
           rushing_yards: "1500"
       },
       {
           name: "Calvin Johnson",
           position: "WR",
           nfl_team: "DET",
           games_played: "16",
           espn_ranking: "4",
           last_season_points: "496",
           league_team: "",
           available: true,
           tagged: false,
           receiving_yards: "1800",
           receiving_tds: "18"
       },
    ];
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
    $scope.leaguePositions = ['QB1', 'QB2', 'RB', 'RB/WR', 'WR', 'WR/TE', 'OP', 'D/ST', 'K', 'BN1', 'BN2', 'BN3', 'BN4', 'BN5', 'BN6', 'BN7'];

    $scope.teamsPlayers = playerTeamService.calculateTeamsPlayers($scope.playersList, $scope.leagueTeams);

    $scope.getTeamPosition = function(team, position) {
        var retVal;
        var teamsPlayers = $scope.teamsPlayers;

        if (teamsPlayers[team] !== undefined && teamsPlayers[team][position] !== undefined) {
            retVal = teamsPlayers[team][position];
        }

        return retVal;
    };
}]);
