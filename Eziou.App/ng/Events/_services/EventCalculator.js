(function () {
    'use strict';

    angular
        .module('Events')
        .service('EventCalculator', Calculator);

    Calculator.$inject = [];

    function Calculator() {
        var event;

        function service(obj) {
            console.log("event calculator for", obj);
            event = obj;
            return service;
        }

        service.usage = calcUsage;
        service.share = calcShare;
        service.balance = calcBalance;
        return service;

        //#region private methods
        /**
         * Sum usage of an item by participants.
         *
         * @param {Object} The item tested for usage.
         * @param {Array} An array of participants.
         * @returns {Number} Integer of participants using the item.
         */
        function calcUsage(item) {
            if (!angular.isArray(event.participants)) {
                throw TypeError("Argument 'participants' must be an array.")
            }

            var usage = 0;

            for (var i = 0; i < event.participants.length; i++) {
                if (event.participants[i].usesItem(item)) {
                    usage++;
                }
            }

            return usage;
        }

        function calcShare(item) {
            var usage = calcUsage(item, event.participants);

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
                sum += calcShare(participant.items[i], event.participants);
            }

            //console.log(participant.name + " with Id: " + participant.id, sum);
            /*
             * 1. Look through the items purchased by the participant.
             * 2. Check if anyone uses it.
             */
            for (var i = 0; i < participant.purchasedItems.length; i++) {
                item = participant.purchasedItems[i];
                if (calcUsage(item, event.participants) > 0) {
                    /*
                     * Someone uses it, and it should be subtracted from his share sum.
                     */
                    //console.log(participant.name + " bought item: ", item.name);
                    price = parseFloat(item.price) || 0;
                    sum -= price;
                }
            }

            //console.log(participant.name, sum);
            return sum;
        }
        //#endregion
    }
})();