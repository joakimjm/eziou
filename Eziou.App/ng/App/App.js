(function () {
    'use strict';

    var id = 'App';

    var App = angular.module('App', [
        "restangular",
        "ngAnimate",
        "ui.router",
        "Config",
        "Notifier",
        "Events"
    ]);
})();