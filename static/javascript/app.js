// Load the PlayersApp module, including controllers and services, then add configuration
// for interpolateProvider because {{ }} conflicts with Django and we don't want that.
angular.module('PlayersApp', [
    'PlayersApp.controllers',
    'PlayersApp.services'
]).config(function($interpolateProvider) {
    "use strict";
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});