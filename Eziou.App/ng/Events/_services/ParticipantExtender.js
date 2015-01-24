(function () {
    'use strict';

    angular
        .module('Events')
        .service('ParticipantExtender', ParticipantExtender);

    ParticipantExtender.$inject = [];

    function ParticipantExtender() {
        function extender(p) {
            if (angular.isUndefined(p.items)) {
                p.items = [];
            }

            if (angular.isUndefined(p.purchasedItems)) {
                p.purchasedItems = [];
            }

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

            return p;
        }

        return extender;

    }
})();