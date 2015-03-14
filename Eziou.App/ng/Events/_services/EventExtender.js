(function () {
    'use strict';
     
    angular
        .module('Events')
        .service('EventExtender', EventExtender);

    EventExtender.$inject = ["EventCalculator", "ParticipantExtender"];

    function EventExtender(EventCalculator, ParticipantExtender) {
        function extender(event) {
            var calc = EventCalculator(event);

            event.calcUsage = calc.usage;
            event.calcShare = calc.share;
            event.calcBalance = calc.balance;
            event.calcCost = calc.cost;
            event.splitTheBill = calc.splitTheBill;
            event.getItems = function () {
                return getItems(event);
            };
            event.removeItem = function (item) {
                removeItem(event, item);
            };

            event.getParticipants = function (item) {
                if (angular.isUndefined(item)) {
                    return event.participants;
                }
                var participants = [];
                angular.forEach(event.participants, function (p) {
                    if (p.usesItem(item)) {
                        participants.push(p);
                    }
                });
                return participants;
            };
            event.addParticipant = function (p) {
                ParticipantExtender(p);
                event.participants.push(p);
            };
            event.removeParticipant = function (p) {
                removeParticipant(this, p);
            };

            for (var i = 0; i < event.participants.length; i++) {
                ParticipantExtender(event.participants[i]);
            }

            mapItems(event);

            return event;
        }

        return extender;

        function getItems(event) {
            var items = [];

            for (var i = 0; i < event.participants.length; i++) {
                items = items.concat(event.participants[i].purchasedItems);
            }

            return items;
        }

        function mapItems(event) {
            var items = event.getItems(),
                participant,
                participantItem;

            for (var i = 0; i < event.participants.length; i++) {

                participant = event.participants[i];

                if (angular.isUndefined(participant.items)) {
                    participant.items = [];
                    continue;
                }

                for (var j = 0; j < participant.items.length; j++) {
                    participantItem = participant.items[j];

                    for (var k = 0; k < items.length; k++) {
                        if (participantItem.id == items[k].id) {
                            participant.items[j] = items[k];
                            console.log(items[k]);
                            break;
                        }
                    }
                }
            }
        }

        function removeItem(event, item) {
            console.log("remove ", item);

            angular.forEach(event.participants, function (p) {
                if (p.usesItem(item)) {
                    p.items.splice(p.items.indexOf(item), 1);
                }

                if (p.hasPurchased(item)) {
                    p.purchasedItems.splice(p.purchasedItems.indexOf(item), 1);
                }
            });
        }

        function removeParticipant(event, participant) {
            console.log("remove ", participant);

            event.participants.splice(event.participants.indexOf(participant), 1);

            angular.forEach(participant.purchasedItems, function (item) {
                angular.forEach(event.participants, function (p) {
                    if (p.usesItem(item)) {
                        p.items.splice(p.items.indexOf(item), 1);
                    }
                });
            });
        }
    }
})();