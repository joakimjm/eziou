(function () {
    angular.module('App')

    .directive('ezAutosize', ['$timeout', function ($timeout) {
        var precision = .25;
        return {
            restrict: 'A',
            link: function ($scope, el) {
                el.on("keyup", function () {
                    resize(el);
                });

                $timeout(function () {
                    resize(el);
                });
            }
        }
        function resize(el) {
            var width = el.val().length;

            if (!width) {
                width = 1;
            }

            el.css("width", width + "em");

            while (!inputExceeded(el)) {
                if (width <= 1) {
                    break;
                }

                width -= precision;
                el.css("width", width + "em");
            }

            width += precision;
            el.css("width", width + "em");
        }
        function inputExceeded(el) {
            var s = $('<span >' + el.val() + '</span>');
            s.css({
                position: 'absolute',
                left: -9999,
                top: -9999,
                // ensure that the span has same font properties as the element
                'font-family': el.css('font-family'),
                'font-size': el.css('font-size'),
                'font-weight': el.css('font-weight'),
                'font-style': el.css('font-style')
            });
            $('body').append(s);
            var result = s.width() > el.width();
            //remove the newly created span
            s.remove();
            return result;
        }
    }]);
})();