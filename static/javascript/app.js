// Load the PlayersApp module, including controllers and services, then add configuration
// for interpolateProvider because {{ }} conflicts with Django and we don't want that.
var app = angular.module('PlayersApp', [
    'PlayersApp.controllers',
    'PlayersApp.services'
]);

app.config(function($interpolateProvider) {
    "use strict";
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

app.directive('modalDialog', function() {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function(scope) {
            scope.hideModal = function() {
                scope.show = false;
            };
        },
        template:
            "<div class='ng-modal' ng-show='show'>" +
                "<div class='ng-modal-overlay' ng-click='hideModal()'></div>" +
                "<div class='ng-modal-dialog' ng-style='dialogStyle'>" +
                    "<div class='ng-modal-dialog-content' ng-transclude></div>" +
                "</div>" +
            "</div>"

    };
});