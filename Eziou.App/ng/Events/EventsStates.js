(function () {
    'use strict';

    var id = 'Events';

    angular.module(id)
        .config(["$stateProvider", function ($stateProvider) {
            $stateProvider
                .state("event", {
                    url: "",
                    controller: "EventCtrl",
                    templateUrl: "ng/events/_views/main.html",
                    resolve: {
                        event: ["Restangular", function (Restangular) {
                            return Restangular.one("events", "168A88BE-9628-4C96-8743-C11ACE20936C").get();
                        }]
                    }
                });
        }]);
})();