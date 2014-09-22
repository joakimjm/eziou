(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = "EventCtrl";

    angular.module("Events").controller(controllerId,
        ["$scope", "$log", "$filter", "$location", "$data", "event",
            function ($scope, $log, $filter, $location, $data, event) {
                $scope.currencySymbol = "";
                init();

                $scope.calcUsage = calcUsage;
                $scope.calcShare = calcShare;
                $scope.calcBalance = calcShareSum;

                $scope.createItem = createItem;
                $scope.createParticipant = createParticipant;

                $scope.deleteItem = deleteItem;
                $scope.deleteParticipant = deleteParticipant;


                function testInit() {
                    if (!$scope.event.Id) {
                        $scope.event.Participants.push({ Name: "Joakim", Participant_Item: [], Id: Date.now() - 200 });
                        $scope.event.Participants.push({ Name: "Jonas", Participant_Item: [], Id: Date.now() - 100 });

                        $scope.event.Items.push({ Participant: $scope.event.Participants[0], Name: "Kød", Price: "100", ParticipantId: $scope.event.Participants[0], Id: Date.now() + 2 });
                        $scope.event.Items.push({ Participant: $scope.event.Participants[1], Name: "Drinks", Price: "500", ParticipantId: $scope.event.Participants[1], Id: Date.now() + 3 });

                        $scope.event.Participants[0].Participant_Item.push({ ItemId: $scope.event.Items[0].Id, enabled: true });
                        $scope.event.Participants[0].Participant_Item.push({ ItemId: $scope.event.Items[1].Id, enabled: true });
                        $scope.event.Participants[1].Participant_Item.push({ ItemId: $scope.event.Items[0].Id, enabled: false });
                        $scope.event.Participants[1].Participant_Item.push({ ItemId: $scope.event.Items[1].Id, enabled: true });

                        initNewItem();
                    }
                }

                $scope.saveEvent = saveEvent;
                function saveEvent() {
                    $scope.startWorking("saving");
                    var item = angular.copy($scope.event);

                    for (var i = 0; i < item.Participants.length; i++) {
                        for (var j = 0; j < item.Participants[i].Participant_Item.length; j++) {
                            if (!item.Participants[i].Participant_Item[j].enabled) {
                                item.Participants[i].Participant_Item.splice(j, 1);
                                j--;
                            }
                        }
                    }

                    for (var i = 0; i < item.Items.length; i++) {
                        item.Items[i].ParticipantId = item.Items[i].Participant.Id;
                        delete item.Items[i].Participant;
                        $log.log("Adjusted item:", item.Items[i]);
                    }

                    $data.events.save(item).then(function (response) {
                        $scope.stopWorking("saving");
                        console.log("saveEvent response:", response);
                    });
                }



                //#region Internal Methods        
                function initNewItem() {
                    $scope.newItem = {
                        Id: Date.now(),
                        Name: "",
                        Participant: $scope.event.Participants[0]
                    };
                }
                function createItem() {
                    var item = angular.copy($scope.newItem);

                    $log.log("New item:", item);

                    $scope.event.Items.push(item);

                    for (var i = 0; i < $scope.event.Participants.length; i++) {
                        if ($scope.event.Participants[i].Id == item.Participant.Id) {
                            item.Participant = $scope.event.Participants[i];
                        }

                        $scope.event.Participants[i].Participant_Item.push({
                            ItemId: item.Id,
                            ParticipantId: $scope.event.Participants[i].Id,
                            enabled: true
                        });
                    }

                    initNewItem();
                }
                function deleteItem(i) {

                    for (var i = 0; i < $scope.event.Participants.length; i++) {
                        for (var j = 0; j < $scope.event.Participants[i].Participant_Item.length; j++) {
                            if ($scope.event.Participants[i].Participant_Item[j].ItemId === i.Id) {
                                $scope.event.Participants[i].Participant_Item[j].splice(j, 1);
                                break;
                            }
                        }
                    }

                    for (var i = 0; i < $scope.event.Items.length; i++) {
                        if ($scope.event.Items[i].Id === i.Id) {
                            $scope.event.Items.splice(i, 1);
                        }
                    }
                }

                function initNewParticipant() {
                    $scope.newParticipant = {
                        Id: Date.now(),
                        Name: "",
                        Participant_Item: []
                    };
                }
                function createParticipant() {
                    var item = angular.copy($scope.newParticipant);

                    for (var i = 0; i < $scope.event.Items.length; i++) {
                        item.Participant_Item.push({
                            ItemId: $scope.event.Items[i].Id,
                            ParticipantId: item.Id,
                            enabled: true
                        });
                    }

                    $log.log("New participant:", item);

                    $scope.event.Participants.push(item);

                    //Initialise item creation now that there's a person.
                    if ($scope.event.Participants.length === 1) {
                        initNewItem();
                    }

                    $log.log("Event now:", $scope.event);

                    initNewParticipant();
                }
                function deleteParticipant(p) {
                    for (var i = 0; i < $scope.event.Participants.length; i++) {
                        if ($scope.event.Participants[i].Id === p.Id) {
                            $scope.event.Participants.splice(i, 1);
                            break;
                        }
                    }

                    for (var i = 0; i < $scope.event.Items.length; i++) {
                        if ($scope.event.Items[i].Participant.Id === p.Id) {
                            $scope.event.Items.splice(i, 1);
                        }
                    }
                }

                function init() {
                    if (event) {
                        for (var j = 0; j < event.Participants.length; j++) {
                            for (var i = 0; i < event.Items.length; i++) {
                                var enabled = false;

                                var item = event.Items[i];

                                for (var k = 0; k < event.Participants[j].Participant_Item.length; k++) {
                                    if (event.Participants[j].Participant_Item.ItemId == item.Id) {
                                        event.Participants[j].Participant_Item[k].enabled = enabled = true;
                                        break;
                                    }
                                }
                            }
                        }

                        $scope.event = event;
                    } else {
                        $scope.event = {
                            Name: "New event",
                            Participants: [],
                            Items: []
                        };

                        testInit();
                    }
                }

                initNewParticipant();
                //#endregion


                //#region MathStuff
                function calcUsage(item) {
                    var usage = 0;

                    for (var i = 0; i < $scope.event.Participants.length; i++) {
                        for (var j = 0; j < $scope.event.Participants[i].Participant_Item.length; j++) {
                            if ($scope.event.Participants[i].Participant_Item[j].ItemId === item.Id) {
                                if ($scope.event.Participants[i].Participant_Item[j].enabled) {
                                    usage++;
                                }
                                break;
                            }
                        }
                    }

                    return usage;
                }

                function calcShare(item, enabled) {
                    if (!enabled) {
                        return 0;
                    }


                    var usage = calcUsage(item);

                    var price = parseFloat(item.Price) || 0;

                    if (usage === 0) {
                        return 0;
                    }

                    return (price / usage);
                }

                function calcShareSum(participant) {
                    var sum = 0.0;
                    for (var j = 0; j < participant.Participant_Item.length; j++) {
                        if (participant.Participant_Item[j].enabled) {
                            for (var i = 0; i < $scope.event.Items.length; i++) {
                                if ($scope.event.Items[i].Id == participant.Participant_Item[j].ItemId) {
                                    sum += calcShare($scope.event.Items[i], true);
                                }
                            }
                        }
                    }

                    $log.log(participant.Name + " with Id: " + participant.Id, sum);

                    for (var i = 0; i < $scope.event.Items.length; i++) {
                        if ($scope.event.Items[i].Participant.Id === participant.Id) {
                            if (calcUsage($scope.event.Items[i], true) > 0) {
                                $log.log(participant.Name + " bought item: ", $scope.event.Items[i]);
                                var price = parseFloat($scope.event.Items[i].Price) || 0;
                                sum -= price;
                            }
                        }
                    }
                    $log.log(participant.Name, sum);
                    return sum;
                }


                //#endregion
            }]);


})();
