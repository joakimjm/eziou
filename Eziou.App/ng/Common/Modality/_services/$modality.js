/*
 * What about preserving state through the url, you might ask? Look at this example for a solution: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-open-a-dialogmodal-at-a-certain-state
 */

(function () {
    'use strict';

    var serviceId = '$modality', logLevel = "info";
    /*
     * Some of the inner workings are taken from https://github.com/angular-ui/bootstrap/blob/master/src/modal/modal.js,
     * since the basic functionality is more or less the same (opening modals and closing them again in the right order).
     */
    angular.module('Modality')
        /**
        * A helper, internal data structure that acts as a map but also allows getting / removing
        * elements in the LIFO order
        */
        .factory('$$stackedMap', function () {
            return {
                createNew: function () {
                    var stack = [];

                    return {
                        add: function (key, value) {
                            stack.push({
                                key: key,
                                value: value
                            });
                        },
                        get: function (key) {
                            for (var i = 0; i < stack.length; i++) {
                                if (key == stack[i].key) {
                                    return stack[i];
                                }
                            }
                        },
                        keys: function () {
                            var keys = [];
                            for (var i = 0; i < stack.length; i++) {
                                keys.push(stack[i].key);
                            }
                            return keys;
                        },
                        top: function () {
                            return stack[stack.length - 1];
                        },
                        remove: function (key) {
                            var idx = -1;
                            for (var i = 0; i < stack.length; i++) {
                                if (key == stack[i].key) {
                                    idx = i;
                                    break;
                                }
                            }
                            return stack.splice(idx, 1)[0];
                        },
                        removeTop: function () {
                            return stack.splice(stack.length - 1, 1)[0];
                        },
                        length: function () {
                            return stack.length;
                        }
                    };
                }
            };
        })
        .directive('modalWindow', ["$window", "$document", "$animate", '$modalStack', '$timeout',
            function ($window, $document, $animate, $modalStack, $timeout) {
                return {
                    restrict: 'EA',
                    scope: {
                        index: '@',
                        //animate: '='
                    },
                    replace: true,
                    transclude: true,
                    templateUrl: function (tElement, tAttrs) {
                        return tAttrs.templateUrl || 'ng/common/modality/_views/window.html';
                    },
                    link: function (scope, element, attrs) {
                        var options = {
                        },

                        wrapper = $document.find(".Modality");

                        //Insert into DOM
                        $animate.enter(element, wrapper, null, function () {
                            /*
                             * Auto-focusing of a freshly-opened modal element causes any child elements
                             * with the autofocus attribute to loose focus. This is an issue on touch
                             * based devices which will show and then hide the onscreen keyboard.
                             * Attempts to refocus the autofocus element via JavaScript will not reopen
                             * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                             * the modal element if the modal does not contain an autofocus element.
                             */

                            var focus = element.find('[autofocus]').first();
                            if (focus.length) {
                                focus[0].focus();
                            }
                        });

                        /*
                         * From https://code.angularjs.org/1.2.23/docs/api/ngAnimate/service/$animate
                         * 6. $animate waits for 10ms (this performs a reflow)
                         */
                        $timeout(center, 20);

                        element.addClass(attrs.windowClass || '');
                        //scope.size = attrs.size;

                        scope.close = function (evt) {
                            var modal = $modalStack.getTop();
                            if (modal) { //&& (evt.target === evt.currentTarget)
                                evt.preventDefault();
                                evt.stopPropagation();
                                $modalStack.dismiss(modal.key, 'backdrop click');
                            }
                        };

                        $window.addEventListener("resize", function () {
                            center();
                        });

                        (function disableViewportScroll() {
                            var initialWindowSize,
                                newWindowSize,
                                sizeDelta;

                            // Disable page scroll
                            if (options.disablePageScroll === true) {
                                initialWindowSize = document.documentElement.scrollWidth;

                                //Remove the scrollbars on supported browsers (i.e. not Internet Explorer 6)
                                document.getElementsByTagName("body")[0].style.overflow = "hidden";

                                //Calculate the difference between the window-size before and after "overflow: hidden"
                                newWindowSize = document.documentElement.scrollWidth;
                                sizeDelta = initialWindowSize - newWindowSize;

                                //Move the entire page left to compensate for missing scroll-bars to make sure that the content stays in the same place
                                sizeDelta = (sizeDelta === 0 ? sizeDelta : sizeDelta + "px");
                                document.getElementsByTagName("body")[0].style.marginLeft = sizeDelta;
                            }
                        })();

                        function center() {
                            element.css('margin-left', '-' + (element[0].offsetWidth / 2) + 'px');
                        }

                        //#region positioning
                        function resize() {
                            var viewportWidth,
                                viewportHeight,
                                maxWidth,
                                maxHeight,
                                popupWidth,
                                popupHeight;

                            //Set proportions of the wrapper to cover the entire page using position:absolute instead of position:fixed (for IE6 and iOS-compatability)
                            if (document.documentElement.clientWidth > document.documentElement.scrollWidth) {
                                viewportWidth = document.documentElement.clientWidth;
                            } else {
                                viewportWidth = document.documentElement.scrollWidth;
                            }
                            wrapper.style.width = viewportWidth + "px";

                            if (document.documentElement.clientHeight > document.documentElement.scrollHeight) {
                                viewportHeight = document.documentElement.clientHeight;
                            } else {
                                viewportHeight = document.documentElement.scrollHeight;
                            }
                            wrapper.style.height = viewportHeight + "px";

                            //Calculate the available viewport size
                            maxWidth = document.documentElement.clientWidth;
                            maxHeight = document.documentElement.clientHeight;

                            //Reset popup size to CSS specifications
                            element[0].style.width = "";
                            element[0].style.height = "";

                            //Current popup size
                            popupWidth = element[0].offsetWidth;
                            popupHeight = element[0].offsetHeight;

                            if (popupHeight > maxHeight) {
                                element[0].style.height = Math.round(maxHeight) + "px";
                            }

                            if (popupWidth > maxWidth) {
                                element[0].style.width = Math.round(maxWidth) + "px";
                            }

                            position();
                        };

                        function position() {
                            var viewportWidth = document.documentElement.clientWidth,
                                viewportHeight = document.documentElement.clientHeight,
                                scrollTop = document.body.scrollTop,
                                topPlacement;

                            element[0].style.left = Math.round((viewportWidth / 2) - Math.round((element[0].offsetWidth / 2))) + "px";

                            /* Position the popup-window vertically */
                            if (scrollTop === 0) {
                                if (window.pageYOffset) {
                                    scrollTop = window.pageYOffset;
                                } else {
                                    scrollTop = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
                                }
                            }

                            // If specified, center the popup-window vertically
                            if (options.verticalCenter) {
                                topPlacement = scrollTop + (Math.round((viewportHeight / 2) - (element[0].offsetHeight / 2)));
                            } else {
                                //or else, place the popup-window towards the top of the screen
                                topPlacement = scrollTop + (Math.round((viewportHeight / 4) - (element[0].offsetHeight / 4)));
                            }

                            if ((topPlacement - scrollTop) > 0) {
                                element[0].style.top = topPlacement + "px";
                            } else {
                                element[0].style.top = scrollTop + "px";
                            }
                        };
                        //#endregion
                    }
                };
            }])
        .directive('modalTransclude', function () {
            return {
                link: function ($scope, $element, $attrs, controller, $transclude) {
                    $transclude($scope.$parent, function (clone) {
                        $element.empty();
                        $element.append(clone);
                    });
                }
            };
        })
            .factory('$modalStack', ['$timeout', "$animate", '$document', '$compile', '$rootScope', '$$stackedMap',
                function ($timeout, $animate, $document, $compile, $rootScope, $$stackedMap) {
                    var OPENED_MODAL_CLASS = 'modal-open';

                    var openedWindows = $$stackedMap.createNew();
                    var $modalStack = {};

                    function removeModalWindow(modalInstance) {
                        var modalWindow = openedWindows.get(modalInstance).value;
                        openedWindows.remove(modalInstance);
                        modalWindow.modalScope.$destroy();

                        //Remove DOM element
                        $animate.leave(modalWindow.modalDomEl, function () {
                            modalWindow.modalDomEl.remove();
                        });
                    }

                    $modalStack.open = function (modalInstance, modal) {
                        openedWindows.add(modalInstance, {
                            deferred: modal.deferred,
                            modalScope: modal.scope
                        });

                        var angularDomEl = angular.element('<div modal-window></div>');
                        angularDomEl.attr({
                            'template-url': modal.windowTemplateUrl,
                            'window-class': modal.windowClass,
                            'size': modal.size,
                            'index': openedWindows.length() - 1
                        }).html(modal.content);

                        var modalDomEl = $compile(angularDomEl)(modal.scope);

                        openedWindows.top().value.modalDomEl = modalDomEl;
                    };

                    $modalStack.close = function (modalInstance, result) {
                        var modalWindow = openedWindows.get(modalInstance);
                        if (modalWindow) {
                            modalWindow.value.deferred.resolve(result);
                            removeModalWindow(modalInstance);
                        }
                    };

                    $modalStack.dismiss = function (modalInstance, reason) {
                        var modalWindow = openedWindows.get(modalInstance);
                        if (modalWindow) {
                            modalWindow.value.deferred.reject(reason);
                            removeModalWindow(modalInstance);
                        }
                    };

                    $modalStack.dismissAll = function (reason) {
                        var topModal = this.getTop();
                        while (topModal) {
                            this.dismiss(topModal.key, reason);
                            topModal = this.getTop();
                        }
                    };

                    $modalStack.getTop = function () {
                        return openedWindows.top();
                    };

                    $modalStack.length = function () {
                        return openedWindows.length();
                    }

                    return $modalStack;
                }])
            .provider('$modality', function () {
                var $modalProvider = {
                    options: {
                    },
                    $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
                        function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {
                            var $modal = {};

                            function getTemplatePromise(options) {
                                return options.template ? $q.when(options.template) :
                                $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                                    { cache: $templateCache }).then(function (result) {
                                        return result.data;
                                    });
                            }

                            function getResolvePromises(resolves) {
                                var promisesArr = [];
                                angular.forEach(resolves, function (value) {
                                    if (angular.isFunction(value) || angular.isArray(value)) {
                                        promisesArr.push($q.when($injector.invoke(value)));
                                    }
                                });
                                return promisesArr;
                            }

                            $modal.open = function (modalOptions) {
                                var modalResultDeferred = $q.defer();
                                var modalOpenedDeferred = $q.defer();

                                //prepare an instance of a modal to be injected into controllers and returned to a caller
                                var modalInstance = {
                                    result: modalResultDeferred.promise,
                                    opened: modalOpenedDeferred.promise,
                                    close: function (result) {
                                        $modalStack.close(modalInstance, result);
                                    },
                                    dismiss: function (reason) {
                                        $modalStack.dismiss(modalInstance, reason);
                                    }
                                };

                                //merge and clean up options
                                modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
                                modalOptions.resolve = modalOptions.resolve || {};

                                //verify options
                                if (!modalOptions.template && !modalOptions.templateUrl) {
                                    throw new Error('One of template or templateUrl options is required.');
                                }

                                var templateAndResolvePromise =
                                $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));

                                templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
                                    var modalScope = (modalOptions.scope || $rootScope).$new();
                                    modalScope.$close = modalInstance.close;
                                    modalScope.$dismiss = modalInstance.dismiss;

                                    var ctrlInstance, ctrlLocals = {};
                                    var resolveIter = 1;

                                    //controllers
                                    if (modalOptions.controller) {
                                        ctrlLocals.$scope = modalScope;
                                        ctrlLocals.$modalInstance = modalInstance;
                                        angular.forEach(modalOptions.resolve, function (value, key) {
                                            ctrlLocals[key] = tplAndVars[resolveIter++];
                                        });

                                        ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                                        if (modalOptions.controllerAs) {
                                            modalScope[modalOptions.controllerAs] = ctrlInstance;
                                        }
                                    }

                                    $modalStack.open(modalInstance, {
                                        scope: modalScope,
                                        deferred: modalResultDeferred,
                                        content: tplAndVars[0],
                                        windowClass: modalOptions.windowClass,
                                        windowTemplateUrl: modalOptions.windowTemplateUrl,
                                        size: modalOptions.size
                                    });
                                }, function resolveError(reason) {
                                    modalResultDeferred.reject(reason);
                                });

                                templateAndResolvePromise.then(function () {
                                    modalOpenedDeferred.resolve(true);
                                }, function () {
                                    modalOpenedDeferred.reject(false);
                                });

                                return modalInstance;
                            };

                            $modal.alert = function () {
                                var heading = "Alert!",
                                    message = "";

                                if (arguments.length == 1 && angular.isString(arguments[0])) {
                                    message = arguments[0];
                                }

                                if (arguments.length == 2 && angular.isString(arguments[0]) && angular.isString(arguments[1])) {
                                    heading = arguments[0];
                                    message = arguments[1];
                                }

                                var me = $modal.open({
                                    templateUrl: "ng/common/modality/_views/alert.html",
                                    controller: ["$scope", function ($scope) {
                                        $scope.heading = heading;
                                        $scope.message = message;
                                        $scope.close = me.close;
                                    }]
                                });

                                return me;
                            }

                            $modal.confirm = function () {
                                var heading = "Please confirm",
                                    message = "";

                                if (arguments.length == 1 && angular.isString(arguments[0])) {
                                    message = arguments[0];
                                }

                                if (arguments.length == 2 && angular.isString(arguments[0]) && angular.isString(arguments[1])) {
                                    heading = arguments[0];
                                    message = arguments[1];
                                }

                                var me = $modal.open({
                                    templateUrl: "ng/common/modality/_views/confirm.html",
                                    controller: ["$scope", "hotkeys", function ($scope, hotkeys) {
                                        $scope.heading = heading;
                                        $scope.message = message;
                                        $scope.close = me.close;
                                        $scope.dismiss = me.dismiss;

                                        hotkeys
                                            .bindTo($scope)
                                            .add({
                                                combo: 'n',
                                                callback: $scope.dismiss
                                            })
                                            .add({
                                                combo: 'y',
                                                callback: $scope.close
                                            });
                                    }]
                                });

                                return me;
                            }

                            return $modal;
                        }]
                };

                return $modalProvider;
            });
})();