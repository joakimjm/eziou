(function () {
    'use strict';

    var controllerId = 'ModalityCtrl';

    angular.module('Modality').controller(controllerId, ['$scope', "$modalStack",
        function ($scope, $modalStack) {
            $scope.visible = false;

            $scope.$watch(function () {
                return $modalStack.length();
            }, function () {
                $scope.visible = !!$modalStack.length();
            });

            $scope.pop = function (reason, $event) {
                if ($event && $event.currentTarget !== $event.target) {
                    /*
                     * This prevents the ng-click event bubbling through from the Modality-window content
                     * to trigger an unexpected modal rejection.
                     */
                    return;
                }

                if (reason instanceof KeyboardEvent) {
                    //The KeyboardEvent comes from esc hotkey
                    reason = "popped by user pressing esc";
                }

                var instance = $modalStack.getTop();

                if (instance) {
                    instance.key.dismiss(reason);
                }
            }
        }]);
})();