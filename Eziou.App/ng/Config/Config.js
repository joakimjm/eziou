(function () {
    'use strict';

    var id = 'Config';
    var Config = angular.module(id, []);

    Config.config(['$provide', function ($provide) {
        // Copy from the global scope embedded on index.html
        $provide.constant("globalConfig", angular.copy(window.config));
        delete window["config"];
    }]);
})();