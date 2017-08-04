app.directive('zoom', function($document, $timeout) {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            var body = $document.find('body')[0],
            	overlay = angular.element('<div class="overlay animate"></div>'),
                clone = element.clone(true).attr('src', attrs.large);

            scope.match = function(el, target) {
                var rect = target[0].getBoundingClientRect();
                el.css('height', rect.height + 'px');
                el.css('left', rect.left + 'px');
                el.css('top', rect.top + 'px');
                el.css('width', rect.width + 'px');
            };

            scope.scaleDown = function(el) {
                el.css('transform', 'scale(1) translateX(0px) translateY(0px)');
            };

            scope.scaleUp = function(el) {
                var rect = el[0].getBoundingClientRect(),
                    scaleW = (window.innerWidth / rect.width),
                    scaleH = (window.innerHeight / rect.height),
                    scale = scaleW < scaleH ? scaleW : scaleH,
                    x = (((window.innerWidth / 2) - rect.left) / scale) - ((rect.width / 2)),
                    y = (((window.innerHeight / 2) - rect.top) / scale) - ((rect.height / 2));
                el.css('transform', 'scale(' + scale + ') translateX(' + x + 'px) translateY(' + y + 'px)');
            };

            overlay.append(clone);
            overlay.bind('click', function() {
            	scope.match(clone, element);
                overlay.removeClass('show');
                scope.scaleDown(clone);
                $timeout(function() {
                    body.removeChild(overlay[0]);
                }, 500);
            });
            
            element.bind('click', function() {
                scope.match(clone, element);
                body.appendChild(overlay[0]);
                $timeout(function() {
                	overlay.addClass('show');
                    scope.scaleUp(clone);
                }, 10);
            });
        }
    };
});