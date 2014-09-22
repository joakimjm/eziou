(function () {
    'use strict';

    angular
        .module('Notifier')
        .factory('$notifier', ['$modality', "notify", function ($modality, notify) {
            return {
                notify: notify,
                alert: $modality.alert,
                confirm: $modality.confirm
            }
        }]);
})();