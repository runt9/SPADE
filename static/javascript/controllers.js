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
           last_season_points: "500"
       },
       {
           name: "Tom Brady",
           position: "QB",
           nfl_team: "NE",
           games_played: "16",
           espn_ranking: "2",
           last_season_points: "500"
       },
       {
           name: "LeSean McCoy",
           position: "RB",
           nfl_team: "PHI",
           games_played: "16",
           espn_ranking: "3",
           last_season_points: "499"
       }
   ];
   $scope.predicate = "name";
   $scope.reverse = true;
});
