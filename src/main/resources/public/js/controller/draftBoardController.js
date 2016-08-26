'use strict';

(function (module) {
    function DraftBoardController($http, $interval, draftBoardService) {
        var self = this;

        self.playersList = [];
        self.loading = true;
        $http.get('/api/player/').success(function (playersData) {
            var i;
            self.playersList = playersData.objects;
            self.playersList.sort(function (a, b) {
                if (a.draft_position < b.draft_position) {
                    return -1;
                }
                if (a.draft_position > b.draft_position) {
                    return 1;
                }

                return 0
            });
            for (i in self.playersList) {
                if (self.playersList[i].draft_position > 0) {
                    self.addToDraftedPlayers(self.playersList[i]);
                }
            }
            self.loading = false;
            self.currentTeam = draftBoardService.getCurrentTeam(self.playersList, self.draftBoard);
            self.EventsPoller.startPolling();
        });

        self.draftedPlayers = [];
        self.currentRound = 1;
        self.rounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        self.leagueTeams = [
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
        self.currentTeam = self.leagueTeams[0];
        self.draftBoard = draftBoardService.prepareDraftBoard(self.rounds, self.leagueTeams);

        self.getDraftedPlayer = function (team, round) {
            return draftBoardService.getDraftedPlayer(team, round, self.draftedPlayers)
        };

        // Ticker object to maintain configuration and updating of the ticker
        self.ticker = {
            // Starting position
            position: angular.element(document.getElementById('tickerBox'))[0].offsetWidth,
            margin: 20,
            moveFlag: true,

            // Returns the left offset the ticker should have.
            getTickerLeft: function () {
                return self.ticker.position + self.ticker.margin + 'px';
            },

            // Moves the ticker by dropping the position by one, which causes an Angular bind to call the getTickerLeft
            // above, which will move the ticker over by 1 pixel.
            tickerMove: function () {
                var tickerDiv = angular.element(document.getElementById('ticker'))[0];
                var tickerBox = angular.element(document.getElementById('tickerBox'))[0];

                if (self.ticker.moveFlag) {
                    self.ticker.position -= 2;

                    // If the ticker div is all the way off the left side of the screen, reset it to the default position,
                    // which is off to the right of the screen
                    if (tickerDiv.offsetLeft < (0 - (tickerDiv.offsetWidth + self.ticker.margin))) {
                        self.ticker.position = tickerBox.offsetWidth + self.ticker.margin;
                    }
                }
            }
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

        // Initialize our ticker and timer when the page loads.
        self.init = function () {
            $interval(self.ticker.tickerMove, 10);
            $interval(self.timer.updateTimer, 1000);
        };

        self.getCssClassForPlayer = function (player) {
            return draftBoardService.getCssClassForPlayer(player);
        };

        self.isObjectEmpty = function (obj) {
            return draftBoardService.isObjectEmpty(obj);
        };

        // Returns whether or not we're in "reverse" this round
        self.isSnaking = function () {
            return self.currentRound % 2 === 0;
        };

        // Gets the list of teams for on the clock, next up, and on deck
        self.getNextTeams = function () {
            var i;
            var nextTeam, onDeckTeam = 'None';
            var lastDraftPosition = draftBoardService.getLastDraftPosition(self.playersList);

            for (i in self.draftBoard) {
                if (self.draftBoard[i].draft_position == (lastDraftPosition + 1)) {
                    nextTeam = self.draftBoard[i].team.long_name;
                } else if (self.draftBoard[i].draft_position == (lastDraftPosition + 2)) {
                    onDeckTeam = self.draftBoard[i].team.long_name;
                }
            }

            return {
                '1. On the Clock': self.currentTeam.long_name,
                '2. Next Up': nextTeam,
                '3. On Deck': onDeckTeam
            };
        };

        // Events Poller object
        self.EventsPoller = {
            isPolling: false,
            lastId: 0, // Tracks the last timestamp of when we polled
            pollInstance: null,
            doPoll: function () {
                // Send along our last poll time to the events endpoint to let the server know
                // how far back to check for new events to give us
                $http.get('/events/?id=' + self.EventsPoller.lastId).success(function (response) {
                    self.EventsPoller.handleResponse(response);
                });
            },
            // Big handler of the response. Knows about all event types and data that can be sent.
            handleResponse: function (response) {
                var i, j, events, event, data, index, player;
                if (response.length === 0) {
                    return;
                }
                events = response;
                for (i in events) {
                    event = events[i];
                    self.EventsPoller.lastId = event.id;
                    data = event.data;
                    switch (event.type) {
                        case 'playerDrafted':
                            index = self.findPlayer(data.id);
                            if (index === -1) {
                                return;
                            }

                            player = self.playersList[index];
                            player.draft_position = data.draft_position;
                            player.league_team = data.league_team;
                            self.addToDraftedPlayers(player);
                            self.timer.time = 300;
                            self.currentTeam = draftBoardService.getCurrentTeam(self.playersList, self.draftBoard);
                            break;
                        case 'playerUnassigned':
                            index = self.findPlayer(data.id);
                            if (index === -1) {
                                return;
                            }

                            player = self.playersList[index];
                            player.draft_position = 0;
                            player.league_team = '';

                            for (j in self.draftedPlayers) {
                                if (self.draftedPlayers[j].id == data.id) {
                                    self.draftedPlayers.splice(j, 1);
                                }
                            }
                            self.timer.time = 300;
                            self.currentTeam = draftBoardService.getCurrentTeam(self.playersList, self.draftBoard);
                            break;
                        case 'playerAdded':
                            data.available = true;
                            data.tagged = false;
                            self.playersList.push(data);
                            break;
                        default:
                    }
                }
            },
            startPolling: function () {
                self.EventsPoller.pollInstance = $interval(function () {
                    self.EventsPoller.doPoll();
                }, 10000);
                self.EventsPoller.isPolling = true;
            },
            stopPolling: function () {
                $interval.cancel(self.EventsPoller.pollInstance);
                self.EventsPoller.pollInstance = null;
                self.EventsPoller.isPolling = false;
            }
        };

        self.addToDraftedPlayers = function (player) {
            self.draftedPlayers.push({
                id: player.id,
                name: player.name,
                position: player.position,
                league_team: player.league_team,
                nfl_team: player.nfl_team,
                round: Math.ceil(player.draft_position / 10),
                draft_position: player.draft_position
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

    DraftBoardController.$inject = ['$http', '$interval', 'draftBoardService'];
    module.controller('DraftBoardController', DraftBoardController);
})(angular.module('SpadeApp'));
