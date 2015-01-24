(function () {
    'use strict';

    var id = 'Events';

    angular.module(id)
        .config(["$stateProvider", function ($stateProvider) {
            var state = {
                url: "",
                controller: "EventCtrl",
                templateUrl: "ng/events/_views/main-a.html",
                resolve: {
                    event: ["Restangular", "EventExtender", function (Restangular, EventExtender) {
                        return Restangular.one("events", "168A88BE-9628-4C96-8743-C11ACE20936C").get().then(function (result) {
                            return EventExtender(result);
                        });
                    }]
                }
            };
            var stateA = angular.copy(state);
            stateA.url = "/a";
            stateA.templateUrl = "ng/events/_views/main-a.html";
            var stateB = angular.copy(state);
            stateB.url = "/b";
            stateB.templateUrl = "ng/events/_views/main-b.html";

            $stateProvider
                .state("event", state)
                .state("eventA", stateA)
                .state("eventB", stateB);
        }]);
})();