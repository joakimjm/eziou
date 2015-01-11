(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = "EventCtrl";

    angular.module("Events").controller(controllerId,
        ["$scope", "$log", "$filter", "$location", "event",
            function ($scope, $log, $filter, $location, event) {
                console.log(event);

                $scope.currencySymbol = "kr";

                $scope.event = event;

                var items = [];

                for (var i = 0; i < event.participants.length; i++) {
                    items = items.concat(event.participants[i].purchasedItems);

                    extendParticipant(event.participants[i]);
                }

                $scope.items = items;


                $scope.calcUsage = calcUsage;
                $scope.calcShare = calcShare;
                $scope.calcBalance = calcBalance;

                //#region MathStuff

                /**
                 * Caclulate the overall usage of an item by participants.
                 * 
                 * @param {Object} The item tested for usage.
                 * @returns {Number} Usage in percent.
                 */
                function calcUsage(item) {
                    var usage = 0;

                    for (var i = 0; i < event.participants.length; i++) {
                        if (event.participants[i].usesItem(item)) {
                            usage++;
                        }
                    }

                    return usage;
                }

                function calcShare(item, enabled) {
                    console.warn("wat", item);

                    if (!enabled) {
                        return 0;
                    }

                    var usage = calcUsage(item);

                    var price = parseFloat(item.price) || 0;

                    if (usage === 0) {
                        return 0;
                    }

                    return (price / usage);
                }

                function calcBalance(participant) {
                    var sum = 0.0,
                        price = 0,
                        item;

                    for (var i = 0; i < participant.items.length; i++) {
                        sum += calcShare(participant.items[i], true);
                    }

                    console.log(participant.name + " with Id: " + participant.id, sum);
                    /*
                     * 1. Look through the items purchased by the participant.
                     * 2. Check if anyone uses it.
                     */
                    for (var i = 0; i < participant.purchasedItems.length; i++) {
                        item = participant.purchasedItems[i];
                        if (calcUsage(item) > 0) {
                            /*
                             * Someone uses it, and it should be subtracted from his share sum.
                             */
                            console.log(participant.name + " bought item: ", item.name);
                            price = parseFloat(item.price) || 0;
                            sum -= price;
                        }
                    }

                    console.log(participant.name, sum);
                    return sum;
                }

                //#endregion

                function extendParticipant(p) {
                    p.toggleUse = function (item) {
                        this.items = this.items || [];

                        if (this.usesItem(item)) {
                            this.items.splice(this.items.indexOf(item), 1);
                        } else {
                            this.items.push(item);
                        }
                    };

                    p.usesItem = function (item) {
                        return this.items.indexOf(item) > -1;
                    };

                    p.hasPurchased = function (item) {
                        return this.purchasedItems.indexOf(item) > -1;
                    };
                }
            }]);
})();