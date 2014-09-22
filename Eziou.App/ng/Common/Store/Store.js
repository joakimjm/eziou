(function () {
    'use strict';

    var moduleId = 'Store';

    var module = angular.module(moduleId, [])
    .provider('$store',
        function () {
            var opts = {
                defaultExpirationTime: 900000, //15 minutes
                slidingExpiration: true
            };

            this.setDefaultExpiration = function (expirationTimeInMs) {
                if (!angular.isNumber(expirationTimeInMs)) {
                    throw Error("Invalid argument: expiration must be a number.");
                }

                opts.defaultExpirationTime = expirationTimeInMs;

                return this;
            };

            this.useSlidingExpiration = function (useSlidingExpiration) {
                opts.slidingExpiration = !!useSlidingExpiration;
            }

            this.$get = ["$window", function ($window) {
                var store = $window.localStorage;

                return {
                    set: function (key, item, msToExpiration) {
                        if (angular.isString(key)) {
                            key = key.toString();
                        }

                        if (!angular.isNumber(msToExpiration)) {
                            msToExpiration = opts.defaultExpirationTime;
                        }

                        store.setItem(key, angular.toJson({ item: item, exp: Date.now() + msToExpiration }));
                    },
                    get: function (key) {
                        var entry = store.getItem(key);

                        if (!entry) {
                            return null;
                        }

                        entry = angular.fromJson(entry);

                        if (!opts.slidingExpiration || !hasExpired(entry.exp)) {
                            return entry.item;
                        }

                        this.remove(key);
                        return null;
                    },
                    remove: function (key) {
                        return store.removeItem(key);
                    },
                    clear: function () {
                        return store.clear();
                    }
                }

                function hasExpired(expiration) {
                    return 0 <= Date.now() - expiration;
                }
            }];
        });
})();