// Load the PlayersApp module, including controllers and services, then add configuration
// for interpolateProvider because {{ }} conflicts with Django and we don't want that.
var playersApp = angular.module('PlayersApp', [
    'PlayersApp.controllers',
    'PlayersApp.services',
    'ui.bootstrap'
]);

var draftBoardApp = angular.module('DraftBoardApp', [
    'DraftBoardApp.controllers',
    'DraftBoardApp.services'
]);
