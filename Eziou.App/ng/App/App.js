(function () {
    'use strict';

    var id = 'App';

    var App = angular.module('App', [
        "restangular",
        "ngAnimate",
        "ngRoute",
        //"ui.router",
        "Config",
        "Notifier",
        "Events"
    ]);
})();