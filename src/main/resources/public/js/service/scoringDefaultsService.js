'use strict';

// This could probably serve to be somewhere else, maybe in the database alongside each stat?
(function (module) {
    function scoringDefaultsService() {
        var self = this;

        self.statDefaults = {
            espn: {
                'pass yds': 25,
                'pass td': 4,
                'pass int': -2,
                'rush yds': 10,
                'rush td': 6,
                'rec yds': 10,
                'rec td': 6,
                'ret td': 6,
                'fum td': 6,
                'fum lost': -2,
                '2pt': 2,
                'pat made': 1,
                'pat miss': -1,
                'fg 0-19': 3,
                'fg 20-29': 3,
                'fg 30-39': 3,
                'fg 40-49': 4,
                'fg 50+': 5,
                'fg miss 0-19': -1,
                'fg miss 20-29': -1,
                'fg miss 30-39': -1,
                'fg miss 40-49': -1,
                'fg miss 50+': -1,
                'sack': 1,
                'int': 2,
                'fum rec': 2,
                'saf': 2,
                'td': 6,
                'block': 2,
                'return td': 6,
                // NB: ESPN's D/ST breakpoints don't line up 100% with NFL.com, but it's close enough for now...
                'pts allow 0': 5,
                'pts allow 1-6': 4,
                'pts allow 7-13': 3,
                'pts allow 14-20': 1,
                'pts allow 28-34': -1,
                'pts allowed 35+': -3
            },
            yahoo: {
                'pass yds': 25,
                'pass td': 4,
                'pass int': -1,
                'rush yds': 10,
                'rush td': 6,
                'rec yds': 10,
                'rec td': 6,
                'ret td': 6,
                'fum td': 6,
                'fum lost': -2,
                '2pt': 2,
                'pat made': 1,
                'fg 0-19': 3,
                'fg 20-29': 3,
                'fg 30-39': 3,
                'fg 40-49': 4,
                'fg 50+': 5,
                'sack': 1,
                'int': 2,
                'fum rec': 2,
                'saf': 2,
                'td': 6,
                'block': 2,
                'return td': 6,
                'pts allow 0': 10,
                'pts allow 1-6': 7,
                'pts allow 7-13': 4,
                'pts allow 14-20': 1,
                'pts allow 28-34': -1,
                'pts allowed 35+': -4,
                'team def 2pt ret': 2
            }
        };

        return {
            getDefaultForStat: function (stat, leagueType) {
                var retval = self.statDefaults[leagueType.toLowerCase()][stat.shortName.toLowerCase()];
                return retval === undefined ? 0 : retval;
            }
        }
    }

    scoringDefaultsService.$inject = [];
    module.factory('scoringDefaultsService', scoringDefaultsService);
})(angular.module('SpadeApp'));
