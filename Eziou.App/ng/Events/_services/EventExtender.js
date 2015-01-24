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
            event.getItems = function () {
                return getItems(event);
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
    }
})();