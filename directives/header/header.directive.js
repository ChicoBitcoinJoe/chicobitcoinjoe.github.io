app.directive('header', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'directives/header/header.directive.html',
	}
}]);