(function () {
    'use strict';

    var controllerId = 'AppCtrl';

    angular.module('App').controller(controllerId,
        ['$scope', "globalConfig", AppCtrl]);

    function AppCtrl($scope, globalConfig) {
        $scope.build = globalConfig.build;
    }
})();