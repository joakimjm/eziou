(function () {
    'use strict';

    var id = 'App';

    angular.module(id)
        .config(["$routeProvider", function ($routeProvider) {
            /*
             * Redirect: Set the default app url
             */
            $routeProvider.otherwise('/');
        }]);
})();