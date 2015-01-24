(function () {
    /**
     * the HTML5 autofocus property can be finicky when it comes to dynamically loaded
     * templates and such with AngularJS. Use this simple directive to
     * tame this beast once and for all.
     *
     * Usage:
     * <input type="text" autofocus>
     * 
     * Borrowed from https://gist.githubusercontent.com/mlynch/dd407b93ed288d499778/raw/0fc3977fed519e51f86fbb93f8a96f34bc9a357a/autofocus.js
     */
    angular.module('App')

    .directive('autofocus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element) {
                $timeout(function () {
                    var el = $element[0];
                    el.focus();
                    el.setSelectionRange(0, el.value.length);
                });
            }
        }
    }]);
})();