(function () {
    'use strict';

    var id = 'App';

    var App = angular.module("App").config(["$provide", "$httpProvider", "RestangularProvider", "globalConfig",
        function ($provide, $httpProvider, RestangularProvider, globalConfig) {
            /*
             * Configure Restangular.
             */
            RestangularProvider.setBaseUrl(globalConfig.apiRoot);

            /*
             * Lists are hyper collections and we need to tell Restangular where
             * the items actually are, so add a response intereceptor
             */
            RestangularProvider
                .addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                    var extractedData;
                    // .. to look for getList operations
                    if (operation === "getList") {
                        // .. and extract the list data
                        extractedData = data.items || [];
                    }

                    return extractedData || data;
                });

            /*
             * Add a interceptor that intercepts errors globally and alerts the user.
             */
            $httpProvider.interceptors.push(["$q", "$log", "$injector", function ($q, $log, $injector) {
                var $notifier;

                return {
                    "responseError": function (rejection) {
                        if (!angular.isObject($notifier)) {
                            $notifier = $injector.get("$notifier");
                        }

                        switch (rejection.status) {
                            case 0:
                                //Ignore
                                break;
                            case 500:
                                var error = rejection.data;
                                $notifier.alert(error.message);
                                $log.group("Server error");
                                $log.error("Error:", error);
                                $log.error("Message:", error.message);
                                $log.error("Developer message:", error.developerMessage);
                                $log.error("Exception:", error.exception);
                                $log.error("Stack trace:", error.stackTrace);
                                $log.groupEnd();
                                break;
                            case 404:
                                $notifier.alert("404: Resource " + rejection.config.url + " not found.");
                                break;
                            case 401:
                                //This is managed from the KUser-module.
                                break;
                            case 403:
                                if (rejection.data.Message) {
                                    if (rejection.data.Message.toLowerCase().indexOf("incorrect password") > -1) {
                                        $notifier.alert("Wrong password.");
                                    } else {
                                        $notifier.alert(rejection.data.Message);
                                    }
                                } else {
                                    $notifier.alert("You don't have permission to do this.");
                                }
                                break;
                            case 410:
                                $injector.get("$store").clear();
                                $notifier.alert("Resource missing!", "The resource you're trying to view no longer exists. The app will reload to ensure your data is up to date.")
                                    .result["finally"](function () {
                                        window.location = "/";
                                    });
                                break;
                            default:
                                $notifier.alert("Request error with status: " + rejection.status);
                                break;
                        }
                        return $q.reject(rejection);
                    }
                };
            }]);

            //#region Stop Angular from removing the $type from json objects during transformations
            //Angular uses properties prefixed with "$" internally and before making sending requests, it transforms the body to remove $-prefixed properties.
            //However the JSON.Net uses the $type property to distinguish polymorphism.
            $httpProvider.defaults.transformRequest = function (data) {
                function isWindow(obj) {
                    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
                }
                function isScope(obj) {
                    return obj && obj.$evalAsync && obj.$watch;
                }
                function isFile(obj) {
                    return toString.apply(obj) === '[object File]';
                }
                function toJsonWithJsonDotNetSupport(obj, pretty) {
                    return JSON.stringify(obj, function (key, value) {
                        var val = value;
                        if (/^\$+/.test(key) && key !== "$type") {
                            val = undefined;
                        } else {
                            if (isWindow(value)) {
                                val = '$WINDOW';
                            } else {
                                if (value && document === value) {
                                    val = '$DOCUMENT';
                                } else {
                                    if (isScope(value)) {
                                        val = '$SCOPE';
                                    }
                                }
                            }
                        }
                        return val;
                    }, pretty ? '  ' : null);
                }
                return angular.isObject(data) && !isFile(data) ? toJsonWithJsonDotNetSupport(data, false) : data;
            };

            //#endregion
        }]);
})();