angular.module('PlayersApp.services', []).factory('playerTeamService', ['$log', function($log) {
    'use strict';

    return {
        getNextTeamBenchPosition: function (team) {
            var index = '1';
            while (team['BN' + index] !== undefined) {
                index++;
            }

            return 'BN' + index;
        },

        findFirstUndefinedPosition: function(team, positions) {
            var position;
            var i;
            var retPosition;

            for (i in positions) {
                position = positions[i];
                if (team[position] === undefined) {
                    retPosition = position;
                }
            }

            if (retPosition === undefined) {
                retPosition = this.getNextTeamBenchPosition(team);
            }

            return retPosition;
        },

        getPlayerTeamPosition: function (player, team) {
            var position = player.position;
            var retPosition;
            switch (position) {
                case 'QB':
                    retPosition = this.findFirstUndefinedPosition(team, ['OP', 'QB1', 'QB2']);
                    break;
                case 'RB':
                    retPosition = this.findFirstUndefinedPosition(team, ['OP', 'RB/WR', 'RB']);
                    break;
                case 'WR':
                    retPosition = this.findFirstUndefinedPosition(team, ['OP', 'WR/RB', 'RB/WR', 'WR']);
                    break;
                case 'TE':
                    retPosition = this.findFirstUndefinedPosition(team, ['OP', 'WR/TE']);
                    break;
                case 'D/ST':
                    retPosition = this.findFirstUndefinedPosition(team, ['D/ST']);
                    break;
                case 'K':
                    retPosition = this.findFirstUndefinedPosition(team, ['K']);
                    break;
                default:
                    retPosition = this.getNextTeamBenchPosition(team);
            }

            return retPosition;
        },

        calculateTeamsPlayers: function(playersList, leagueTeams) {
            var teamName;
            var teamsPlayers = [];

            for (teamName in leagueTeams) {
                teamsPlayers[teamName] = this.calculateTeamPlayers(playersList, teamName);
            }

            $log.log(teamsPlayers);
            return teamsPlayers;
        },

        calculateTeamPlayers: function (playersList, teamName) {
            var position;
            var player;
            var i;
            var team = [];

            for (i in playersList) {
                player = playersList[i];
                if (player.league_team == teamName) {
                    position = this.getPlayerTeamPosition(player, team);
                    team[position] = player;
                }
            }

            return team;
        }
    };
}]);

