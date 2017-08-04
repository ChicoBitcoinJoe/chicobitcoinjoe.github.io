app.directive('sidenav', ['$mdSidenav','$location',
function($mdSidenav, $location) {
	return {
		restrict: 'E',
		scope: {
            
		},
		replace: true,
		templateUrl: 'directives/sidenav/sidenavDirective.html',
		controller: function($scope, $mdSidenav){
            $scope.active = {
                about: true,
                portfolio: false,
                services: false,
                invest: false,
                blog: false
            };
		},
		link : function($scope, $element, $attrs) {
            
            $scope.scrollTo = function(id) {
                $location.hash(id);
            };
            
            $scope.$on('scrollChanges', function(event, active) {
                $scope.$apply(function(){
                    $scope.active = active;
                });
            });
		}
	}
}]);