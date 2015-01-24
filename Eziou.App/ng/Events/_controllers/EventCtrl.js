(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = "EventCtrl";

    angular.module("Events").controller(controllerId,
        ["$scope", "$timeout", "event",
            function ($scope, $timeout, event) {
                $scope.newParticipant = {};
                $scope.currencySymbol = "kr";

                $scope.event = event;
                $scope.participants = event.participants;

                $scope.items = event.getItems();

                $scope.calcUsage = event.calcUsage;
                $scope.calcShare = event.calcShare;
                $scope.calcBalance = event.calcBalance;

                $scope.removeParticipant = function (p) {
                    event.removeParticipant(p);

                    $scope.items = event.getItems();
                };

                $scope.removeItem = function (item) {
                    event.removeItem(item);

                    $scope.items = event.getItems();
                };

                $scope.addItem = function (participant) {
                    var item = {
                        name: "New item for " + participant.name,
                        price: 0.0,
                        isNew: true
                    };

                    participant.purchasedItems.push(item);

                    $scope.items = event.getItems();

                    //$timeout(function () {
                    //    delete item.isNew;
                    //}, 1000);
                };

                $scope.$watch('newParticipant.name', function (value) {
                    if (value) {
                        event.addParticipant({ name: value });
                        $scope.newParticipant.name = '';
                    }
                });

                $scope.removeNewState = function (item) {
                    item.isNew = false;
                };
            }]);
})();