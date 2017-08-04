app.controller('HomeViewController', ['$q','$scope','$mdSidenav','$rootScope','Web3Service','SimpleITO',
function($q,$scope,$mdSidenav,$rootScope,Web3Service,ITO){
    console.log('Loading Home View');
    
    $scope.state = {
        ito: null,
        secondsUntilOfferStarts: null,
        secondsUntilOfferExpires: null,
        secondsUntilWithdrawExpires: null,
    };
    
    $scope.active = {
        about: false,
        portfolio: false,
        services: false,
        invest: false,
        blog: null
    };
    
    $scope.toggle = function(componentId) {
        $mdSidenav(componentId).toggle();
    };
    
    $scope.isScrolledIntoView = function (el) {
        var elem = el.getBoundingClientRect();
        var elemTop = elem.top;
        var elemBottom = elem.bottom;
        
        //console.log(elemTop, elemBottom, window.innerHeight);
        var topInView = (elemTop >= 0 && elemTop < window.innerHeight - window.innerHeight/3);
        var middleInView = (elemTop < 0 && elemBottom > window.innerHeight);
        var bottomInView = (elemBottom < window.innerHeight && elemBottom > window.innerHeight/3);
        
        //console.log(topInView,middleInView,bottomInView);
        var isVisible = (topInView || middleInView || bottomInView);
        return isVisible;
    }
    
    $("#currentView").on('scroll', function ( e ) {
        var about = $("#about")[0];
        var portfolio = $("#portfolio")[0];
        var services = $("#services")[0];
        var invest = $("#invest")[0];
        var blog = $("#blog")[0];
        
        $scope.active.about = $scope.isScrolledIntoView(about);
        $scope.active.portfolio = $scope.isScrolledIntoView(portfolio);
        $scope.active.services = $scope.isScrolledIntoView(services);
        $scope.active.invest = $scope.isScrolledIntoView(invest);
        $scope.active.blog = $scope.isScrolledIntoView(blog);
        
        $rootScope.$broadcast('scrollChanges', $scope.active);
    });
    
    var refresh = function(blockNumber){
        $q.all([
            ITO.getState(),
            Web3Service.getBlock(blockNumber)
        ]).then(function(promises){
            $scope.state.ito = promises[0];
            var blockInfo = promises[1];
            var now = blockInfo.timestamp;
            
            $scope.state.secondsUntilOfferStarts = $scope.state.ito.OFFER_STARTS - now;
            $scope.state.secondsUntilOfferExpires = $scope.state.ito.OFFER_EXPIRES - now;
            $scope.state.secondsUntilWithdrawExpires = $scope.state.ito.WITHDRAW_PERIOD_EXPIRES - now;
        });
    };
    
    Web3Service.getCurrentBlockNumber()
    .then(function(currentBlock){
       refresh(currentBlock);
    });

    web3.eth.filter('latest', function(err,newBlockInfo){
        refresh(newBlockInfo);
    });
}]);