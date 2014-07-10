// Initialize our PlayersApp controller
// TODO: Remove hardcoded players list and wire up to endpoint
angular.module('PlayersApp.controllers', []).controller('playersController', ['$scope', 'playerTeamService', function($scope, playerTeamService) {
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
           draft_position: 2,
           stats: {
                qb_rating: "115.1",
                completions: "450",
                attempts: "659",
                completion_percentage: "68.3",
                passing_yards: "5477",
                passing_yards_per_game: "342.3",
                passing_yards_per_attempt: "8.3",
                passing_touchdowns: "55",
                interceptions: "10",
                rushing_attempts: "32",
                rushing_yards: "-31",
                rushing_yards_per_game: "-1.9",
                yards_per_rushing_attempt: "-1",
                rushing_touchdowns: "1",
                sacks: "18",
                yards_lost_from_sacks: "120",
                fumbles: "10",
                fumbles_lost: "6"
           }
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
           draft_position: 3,
           stats: {
               qb_rating: "87.3",
               completions: "380",
               attempts: "628",
               completion_percentage: "60.5",
               passing_yards: "4343",
               passing_yards_per_game: "271.4",
               passing_yards_per_attempt: "6.9",
               passing_touchdowns: "25",
               interceptions: "11",
               rushing_attempts: "32",
               rushing_yards: "18",
               rushing_yards_per_game: "1.1",
               yards_per_rushing_attempt: "0.6",
               rushing_touchdowns: "0",
               sacks: "40",
               yards_lost_from_sacks: "256",
               fumbles: "9",
               fumbles_lost: "3"
           }
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
           draft_position: 1,
           stats: {
               rushes: "314",
               rushing_yards: "1607",
               rushing_yards_per_game: "100.4",
               rushing_yards_per_attempt: "5.1",
               rushing_touchdowns: "9",
               receptions: "52",
               targets: "64",
               receiving_yards: "539",
               receiving_yards_per_game: "33.7",
               receiving_yards_per_reception: "10.4",
               longest_reception: "70",
               average_yards_after_catch: "12",
               first_downs: "23",
               receiving_touchdowns: "2",
               fumbles: "1",
               fumbles_lost: "1"
           }           
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
           draft_position: 4,
           stats: {
                receptions: "84",
                targets: "156",
                receiving_yards: "1492",
                receiving_yards_per_game: "106.6",
                receiving_yards_per_reception: "17.8",
                longest_reception: "87",
                average_yards_after_catch: "5.9",
                first_downs: "69",
                receiving_touchdowns: "14",
                kickoff_returns: "0",
                kickoff_return_yards: "0",
                yards_per_kickoff_return: "0",
                longest_kickoff_return: "0",
                kickoff_return_touchdowns: "0",
                punt_returns: "0",
                punt_return_yards: "0",
                yards_per_punt_return: "0",
                longest_punt_return: "0",
                punt_return_touchdowns: "0",
                fumbles: "1",
                fumbles_lost: "1"
           }           
       }
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

    // Initialize the list of which players belong to which league team
    $scope.teamsPlayers = playerTeamService.calculateTeamsPlayers($scope.playersList, $scope.leagueTeams);

    // Given a team and a position, grab the player in that position on the given team and return it
    $scope.getTeamPosition = function(team, position) {
        var teamsPlayers = $scope.teamsPlayers;
        return (teamsPlayers[team] !== undefined && teamsPlayers[team][position] !== undefined) ?  teamsPlayers[team][position] : undefined;
    };

    // Wrapper for service layer handler
    $scope.getTeamPositionPlayerCount = function(team, position) {
        return playerTeamService.getTeamPositionPlayerCount(team, position, $scope.teamsPlayers);
    };

    // Wrapper for service layer handler
    $scope.convertFieldToHeader = function(str) {
        return playerTeamService.convertFieldToHeader(str);
    };

    // Modal logic
    $scope.modalShown = false;
    $scope.modalPlayer = null;
    $scope.showModal = function(player) {
        $scope.modalPlayer = player;
        $scope.modalShown = true;
    }
}]);

angular.module('DraftBoardApp.controllers', []).controller('draftBoardController', ['$scope', function($scope) {
    "use strict";
    $scope.draftedPlayers = [];
    $scope.rounds = 16;
    $scope.roundsArray = new Array($scope.rounds);
    $scope.leagueTeams = ['team1', 'team2', 'team3', 'team4', 'team5', 'team6', 'team7', 'team8', 'team9', 'team10'];
}]);