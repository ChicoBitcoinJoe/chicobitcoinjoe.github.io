app.directive('sidenav', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'directives/sidenav/sidenav.directive.html',
		controller: function($scope){
			$scope.updateHeader = function(item){
				if(item){
					$scope.app.header.preText = item.preText;
					$scope.app.header.postText = item.postText;
				} else {
					$scope.app.header.preText = '';
					$scope.app.header.postText = '';
				}
			}
		}
	}
}]);