(function () {
    'use strict';

    var id = 'Events';

    angular.module(id)
        .config(["$stateProvider", function ($stateProvider) {
            var state = {
                url: "/:eventId",
                controller: "EventCtrl",
                templateUrl: "ng/events/_views/main-a.html",
                resolve: {
                    event: ["Restangular", "EventExtender", "$stateParams", function (Restangular, EventExtender, $stateParams) {
                        return Restangular.one("events", $stateParams.eventId).get()
                            .then(function (result) {
                                return EventExtender(result);
                            })["catch"](function myfunction() {
                                var event = {
                                    id: $stateParams.eventId,
                                    name: "New event",
                                    participants: []
                                };

                                Restangular.restangularizeElement(null, event, "events");
                                return EventExtender(event);
                            });
                    }]
                }
            };

            $stateProvider
                .state("newEvent", { url: "" })
                .state("event", state);
        }])
        .run(["$rootScope", "$state", "IdProvider", function ($rootScope, $state, IdProvider) {
            //Redirects (e.g. from abstract states)
            var redirects = {
                "newEvent": "event"
            };

            $rootScope.$on('$stateChangeStart', function (event, toState, stateParams) {
                if (redirects.hasOwnProperty(toState.name)) {
                    event.preventDefault();
                    IdProvider.generate().then(function (id) {
                        $state.go(redirects[toState.name], { eventId: id });
                    });
                }
            });
        }]);
})();