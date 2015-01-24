(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = "EventCtrl";

    angular.module("Events").controller(controllerId,
        ["$scope", "$log", "$filter", "$location", "event",
            function ($scope, $log, $filter, $location, event) {
                $scope.newParticipant = {};
                $scope.currencySymbol = "kr";

                $scope.event = event;
                $scope.participants = event.participants;

                $scope.items = event.getItems();

                $scope.calcUsage = event.calcUsage;
                $scope.calcShare = event.calcShare;
                $scope.calcBalance = event.calcBalance;

                $scope.$watch('newParticipant.name', function (value) {
                    if (value) {
                        event.addParticipant({ name: value });
                        $scope.newParticipant.name = '';
                    }
                });
            }]);
})();