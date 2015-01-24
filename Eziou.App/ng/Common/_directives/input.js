(function () {
    angular.module('App')

    .directive('input', [function () {
        return {
            restrict: 'E',
            link: function (scope, el) {
                el.on("keydown", function (e) {
                    if (e.keyCode === 13 /*ENTER*/ || e.keyCode === 27/*ESC*/) {
                        el.blur();
                    }
                });
            }
        }
    }]);
})();