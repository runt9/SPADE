angular.module('PlayersApp.services', []).factory('playerTeamService', function() {
    'use strict';

    return {
        // Loops through all possible bench positions until it finds one that has not
        // been filled yet and returns that as a string.
        getNextTeamBenchPosition: function (team) {
            var index = '1';
            while (team['BN' + index] !== undefined) {
                index++;
            }

            return 'BN' + index;
        },

        // Given a team defined as an object with position: player pairs and an array of position
        // names, loop through the positions and return the first position that does not yet have
        // a player associated with it on the given team. If we didn't find a position, get the
        // next available bench position and return that instead
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

        // Given a player with position as a key and a team that is an object of position: player pairs,
        // find the first position on that team that has not been filled by a player in the same position
        // as the given player and return that position as a string.
        // NB: The arrays are given in inverse order of how they want to be searched because that's how JS
        // reads arrays, in inverse order of how they're defined. E.X. QB defines OP, QB2, QB1. JS will loop
        // starting at QB1, moving to QB2 then OP.
        getPlayerTeamPosition: function (player, team) {
            var position = player.position;
            var retPosition;
            switch (position) {
                case 'QB':
                    retPosition = this.findFirstUndefinedPosition(team, ['OP', 'QB2', 'QB1']);
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

        // Given an array of player objects and an array of league_team objects, calculate which position
        // on each league_team each player fills based on the player's position and the team they were
        // drafted by.
        calculateTeamsPlayers: function(playersList, leagueTeams) {
            var teamName;
            var teamsPlayers = [];

            // Sort list by draft position so that the first player drafted by a team gets priority in the list
            // of players on their team as to which position they fill.
            playersList.sort(function(a, b) {
                if (a.draft_position < b.draft_position) {
                    return -1;
                }
                if (a.draft_position > b.draft_position) {
                    return 1;
                }

                return 0;
            });

            for (teamName in leagueTeams) {
                teamsPlayers[teamName] = this.calculateTeamPlayers(playersList, teamName);
            }

            return teamsPlayers;
        },

        // Given a list of players and a team name, find out which players belong to which team
        // if they have already been drafted.
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
});

