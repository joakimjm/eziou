(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = "EventCtrl";

    angular.module("Events").controller(controllerId,
        ["$scope", "$timeout", "Restangular", "event", "IdProvider",
            function ($scope, $timeout, Restangular, event, IdProvider) {
                $scope.newParticipant = {};
                $scope.currencySymbol = "kr";

                $scope.event = event;
                $scope.participants = event.participants;

                $scope.items = event.getItems();

                $scope.calcUsage = event.calcUsage;
                $scope.calcShare = event.calcShare;
                $scope.calcBalance = event.calcBalance;

                $scope.splitTheBill = event.splitTheBill;

                //event.splitTheBill($scope.event);

                $scope.removeParticipant = function (p) {
                    event.removeParticipant(p);

                    $scope.items = event.getItems();
                };


                $scope.removeItem = function (item) {
                    event.removeItem(item);

                    $scope.items = event.getItems();
                };

                $scope.addItem = function (participant) {
                    IdProvider.generate().then(function (id) {
                        var item = {
                            id: id,
                            name: "New item for " + participant.name,
                            price: 0.0,
                            isNew: true
                        };

                        participant.purchasedItems.push(item);

                        $scope.items = event.getItems();

                        //$timeout(function () {
                        //    delete item.isNew;
                        //}, 1000);
                    });
                };

                //$scope.$watch('newParticipant.name', function (value) {
                //    if (value) {
                //        IdProvider.generate().then(function (id) {
                //            event.addParticipant({
                //                id: id,
                //                name: value
                //            });
                //            $scope.newParticipant.name = '';
                //        });  
                //    }
                //});

                $scope.submitParticipant = function () {
                    console.log("It works");
                    IdProvider.generate().then(function (id) {
                        event.addParticipant({
                            id: id,
                            name: angular.copy($scope.newParticipant.name)
                        });
                        $scope.newParticipant.name = '';
                    });  
                }

                

                $scope.removeNewState = function (item) {
                    item.isNew = false;
                };

                $scope.saveEvent = function (event) {
                    if (!event.fromServer) {
                        var events = Restangular.all("events");
                        events.post(event).then(function () {
                            alert("created!");
                        });
                    } else {
                        event.put().then(function () {
                            alert("updated!");
                        });
                    }
                };
            }]);
})();