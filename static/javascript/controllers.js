// Initialize our PlayersApp controller
// TODO: Remove hardcoded players list and wire up to endpoint
angular.module('PlayersApp.controllers', []).controller('playersController', function($scope) {
    "use strict";
    $scope.playersList = [
       {
           name: "Peyton Manning",
           position: "QB",
           nfl_team: "DEN",
           games_played: "16",
           espn_ranking: "1",
           last_season_points: "500",
           league_team: "",
           available: true,
           passing_yards: "5000"
       },
       {
           name: "Tom Brady",
           position: "QB",
           nfl_team: "NE",
           games_played: "16",
           espn_ranking: "2",
           last_season_points: "500",
           league_team: "",
           available: true,
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
           rushing_yards: "1500"
       }
   ];
   $scope.positions = ['QB', 'RB', 'WR', 'TE', 'D/ST', 'K'];
   $scope.nfl_teams = {
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
   $scope.predicate = "name";
   $scope.reverse = false;
});
