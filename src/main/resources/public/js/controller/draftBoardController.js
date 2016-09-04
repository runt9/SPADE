'use strict';

(function (module) {
    function DraftBoardController($http, $interval, EventsPoller) {
        var self = this;

        self.draftId = location.pathname.split('/')[2];
        self.draft = null;
        self.teamsPlayers = {};

        self.$onInit = function () {
            self.loading = true;
            $http.get('/api/draft/' + self.draftId + '/draftBoard').success(function (data) {
                self.draft = data.draft;
                self.teamsPlayers = data.teamsPlayers;

                var roundCount = 0;
                angular.forEach(self.draft.positionCounts, function (pc) {
                    if (pc.count !== null) {
                        for (var i = 0; i < pc.count; i++) {
                            roundCount++;
                        }
                    }
                });

                self.rounds = new Array(roundCount);
                self.eventsPoller = new EventsPoller(self.draftId, data.latestEventId, self.handleEventsPollerResponse);
                self.eventsPoller.startPolling();
                $interval(self.timer.updateTimer, 1000);
                self.loading = false;
            });
        };

        // Timer object to maintain configuration and updating of the timer
        self.timer = {
            time: 300,
            playing: false,

            updateTimer: function () {
                if (self.timer.playing && self.timer.time > 0) {
                    self.timer.time--;
                }
            },
            formatTime: function () {
                var time = self.timer.time;

                var minutes = Math.floor(time / 60);
                var seconds = Math.floor(time - (minutes * 60));
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }

                return minutes + ":" + seconds;
            },
            toggle: function () {
                self.timer.playing = !self.timer.playing;
            }
        };

        self.toggleTimer = function () {
            self.timer.toggle();
        };

        self.getDraftedPlayer = function(team, round) {
            if (self.teamsPlayers.hasOwnProperty(team.id)) {
                for (var i in self.teamsPlayers[team.id]) {
                    var player = self.teamsPlayers[team.id][i];
                    if (player.draftRound == round) {
                        return player;
                    }
                }
            }

            return null;
        };

        self.getCssClassForPlayer = function (player) {
            var className = '';

            if (player === null) {
                return;
            }

            switch (player.player.position.abbr) {
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
                case 'DEF':
                    className = 'bg-doc';
                    break;
                case 'K':
                    className = 'bg-alert';
                    break;
                default:
                    break;
            }

            return className;
        };

        self.getCurrentRound = function () {
            var numTeams = self.draft.fantasyTeams.length;
            var round = 0;
            var roundCount = 0;
            for (var i in self.teamsPlayers) {
                var team = self.teamsPlayers[i];
                for (var j in team) {
                    var p = team[j];
                    if (p.draftRound > round) {
                        round = p.draftRound;
                        roundCount = 1;
                    } else if (p.draftRound == round) {
                        roundCount++;
                    }
                }
            }

            if (roundCount >= numTeams) {
                return round + 1;
            } else {
                return round;
            }
        };

        // Returns whether or not we're in "reverse" this round
        self.isSnaking = function () {
            return self.getCurrentRound() % 2 === 1;
        };

        // Gets the list of teams for on the clock, next up, and on deck
        self.getNextTeams = function () {
            var currentTeam, nextTeam, onDeckTeam;
            if (self.draft === null) {
                return;
            }

            var teams = self.draft.fantasyTeams;
            var currentRound = self.getCurrentRound();

            teams.sort(function (a, b) {
                var num = a.draftOrder - b.draftOrder;
                return self.isSnaking() ? -num : num;
            });

            for (var i in teams) {
                var team = teams[i];
                var teamDraftedRound = false;
                for (var j in self.teamsPlayers[team.id]) {
                    var p = self.teamsPlayers[team.id][j];
                    if (p.draftRound == currentRound) {
                        teamDraftedRound = true;
                        break;
                    }
                }
                if (!teamDraftedRound) {
                    if (currentTeam === undefined) {
                        currentTeam = team;
                    } else if (nextTeam === undefined) {
                        nextTeam = team;
                    } else if (onDeckTeam === undefined) {
                        onDeckTeam = team;
                        break;
                    }
                }
            }

            if (onDeckTeam === undefined) {
                if (currentRound + 1 < self.rounds.length) {
                    teams.sort(function (a, b) {
                        var num = a.draftOrder - b.draftOrder;
                        return self.isSnaking() ? num : -num;
                    });

                    if (nextTeam === undefined) {
                        nextTeam = teams[0];
                        onDeckTeam = teams[1];
                    } else {
                        onDeckTeam = teams[0];
                    }
                }
            }

            return {
                '1. On the Clock': currentTeam !== undefined ? currentTeam.name : '',
                '2. Next Up': nextTeam !== undefined ? nextTeam.name : '',
                '3. On Deck': onDeckTeam !== undefined ? onDeckTeam.name : ''
            };
        };

        self.handleEventsPollerResponse = function (events) {
            if (events.length === 0) {
                return;
            }

            angular.forEach(events, function(event) {
                self.eventsPoller.lastId = event.id;

                var player = self.findPlayer(event.player.id);
                if (player === null) {
                    return;
                }
            });
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

    DraftBoardController.$inject = ['$http', '$interval', 'EventsPoller'];
    module.controller('DraftBoardController', DraftBoardController);
})(angular.module('SpadeApp'));
