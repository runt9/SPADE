'use strict';

(function (module) {
    function EventsPoller($http, $interval) {
        return function (draftId, initialEventId, handleResponseCallback) {
            var self = this;

            self.draftId = draftId;
            self.isPolling = false;
            self.lastId = initialEventId === null ? 0 : initialEventId; // Tracks the last id we got
            self.pollInstance = null;

            self.doPoll = function () {
                // Send along our last poll time to the events endpoint to let the server know
                // how far back to check for new events to give us
                $http.get('/api/draft/' + self.draftId + '/event/new?id=' + self.lastId).success(function (response) {
                    self.handleResponse(response);
                }).error(function (err) {
                    // TODO: Error handling
                    console.error(err);
                });
            };

            // Big handler of the response. Knows about all event types and data that can be sent.
            self.handleResponse = handleResponseCallback;

            self.startPolling = function () {
                self.pollInstance = $interval(function () {
                    self.doPoll();
                }, 5000);
                self.isPolling = true;
            };

            self.stopPolling = function () {
                $interval.cancel(self.pollInstance);
                self.pollInstance = null;
                self.isPolling = false;
            };

            return self;
        };
    }

    EventsPoller.$inject = ['$http', '$interval'];
    module.factory('EventsPoller', EventsPoller);
})(angular.module('SpadeApp'));
