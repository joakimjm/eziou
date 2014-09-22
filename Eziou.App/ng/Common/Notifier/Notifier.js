/*
 * Documentation is here: https://github.com/cgross/angular-notify
 */

(function () {
    'use strict';

    var moduleId = 'Notifier';

    var module = angular.module(moduleId, ["Modality", "cgNotify"])
        .run(["notify", function (notify) {
            notify.config({
                template: "ng/common/notifier/_views/notifier.html",
                position: "right"
            });
        }]);
})();