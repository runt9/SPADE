'use strict';

(function (module) {
    function draftBoardService() {
        return {
            // Given a team, a round, and a list of players, return the player that was drafted by
            // that team in the given round, if there is one.
            getDraftedPlayer: function (team, round, players) {
                var retPlayer = {};
                var index;

                for (index in players) {
                    if (players[index].league_team == team.short_name && players[index].round == round) {
                        retPlayer = players[index];
                    }
                }

                return retPlayer;
            },

            // Determine what background style we should use for the given player based off of their position
            getCssClassForPlayer: function (player) {
                var className = '';

                switch (player.position) {
                    case 'QB':
                        className = 'bg-success';
                        break;
                    case 'RB':
                        className = 'bg-info';
                        break;
                    case 'WR':
                        className = 'bg-warning';
                        break;
                    case 'TE':
                        className = 'bg-danger';
                        break;
                    case 'D/ST':
                        className = 'bg-doc';
                        break;
                    case 'K':
                        className = 'bg-alert';
                        break;
                    default:
                        break;
                }

                return className;
            },

            isObjectEmpty: function (obj) {
                var prop;

                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        return false;
                    }
                }

                return true;
            },

            getLastDraftPosition: function (players) {
                var player, i;
                var max = 0;
                for (i in players) {
                    player = players[i];
                    if (player.draft_position > max) {
                        max = player.draft_position;
                    }
                }
                return max;
            },

            getCurrentTeam: function (players, draftBoard) {
                var i;
                var max = this.getLastDraftPosition(players);

                for (i in draftBoard) {
                    if (draftBoard[i].draft_position == max) {
                        return draftBoard[i].team;
                    }
                }
                return null;
            },

            prepareDraftBoard: function (rounds, teams) {
                var i, j, round;
                var count = 0;
                var retVal = [];

                for (i in rounds) {
                    round = rounds[i];
                    teams.sort(function (a, b) {
                        if (a.pick < b.pick) {
                            return (round % 2 === 0) ? 1 : -1;
                        }
                        if (a.pick > b.pick) {
                            return (round % 2 === 0) ? -1 : 1;
                        }

                        return 0;
                    });
                    for (j in teams) {
                        retVal.push({
                            draft_position: count,
                            team: teams[j]
                        });
                        count++;
                    }
                }
                return retVal;
            }
        }
    }

    module.factory('draftBoardService', draftBoardService);
})(angular.module('SpadeApp'));
