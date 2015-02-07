(function () {
    'use strict';

    angular
        .module('App')
        .service('IdProvider', IdProvider);

    IdProvider.$inject = ['Restangular'];

    function IdProvider(Restangular) {
        this.generate = Restangular.one("id").get;
    }
})();