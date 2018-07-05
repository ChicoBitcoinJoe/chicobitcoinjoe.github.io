var app = angular.module('app',['ngRoute','ngMaterial','ngAria','ngAnimate']);

app.config(function ($routeProvider) {
	$routeProvider.
    when('/', {
        templateUrl: 'views/home/home.view.html',
        controller: 'HomeViewController'
    }).
	otherwise({
      redirectTo: '/'
    });
});

app.run(['$rootScope', function($rootScope) {
    console.log('App is loading.');
}]);

app.filter('fromWei', [function() {
    return function(value, convertTo) {
        if(value == null)
            return 0;
        
        return web3.utils.fromWei(value,convertTo);
    };
}]);

app.filter('decimals', [function() {
    return function(value, decimals) {
        value = parseFloat(value);
        if(value == null)
            return 0;
        
        return value.toFixed(decimals);
    };
}]);

app.filter('reverse', function() {
    return function(items) {
        if(items == null)
            return [];
        
        return items.slice().reverse();
    };
});