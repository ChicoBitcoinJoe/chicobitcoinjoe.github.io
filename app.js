var app = angular.module('app',['ngRoute','ngMaterial','ngMessages','material.svgAssetsCache','ngSanitize']);

app.config(function ($routeProvider) {
	$routeProvider.
    when('/', {
        templateUrl: 'views/home/homeView.html',
        controller: 'HomeViewController'
    }).
	otherwise({
      redirectTo: '/'
    });
});

app.run(function() {
    console.log('Loading Chico Bitcoin Joe Webpage!'); 
});

app.filter('fromWei', [function() {
    return function(value, convertTo) {
        if(value == null)
            return 0;
        
        return web3.fromWei(value,convertTo).toNumber();
    };
}]);

app.filter('decimals', [function() {
    return function(value,decimals) {
        if(value == null)
            return 0;
        
        return value.toFixed(decimals);
    };
}]);

app.filter('toHours', [function() {
    return function(value) {
        if(value == null)
            return 0;
        
        return parseFloat(value / 3600);
    };
}]);

app.filter('reverse', function() {
    return function(items) {
        if(items == null)
            return [];
        
        return items.slice().reverse();
    };
});

app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
