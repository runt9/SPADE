'use strict';

(function (module) {
    function appConstants() {
        return {
            positions: ['QB', 'RB', 'WR', 'TE', 'D/ST', 'K'],
            possibleLeaguePositions: ['QB', 'RB', 'RB/WR', 'WR', 'WR/TE', 'TE', 'D/ST', 'K', 'BN'],
            nflTeams: {
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
            }
        }
    }

    module.constant('appConstants', appConstants);
})(angular.module('SpadeApp'));
