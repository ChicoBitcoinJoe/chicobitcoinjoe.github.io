app.controller('HomeViewController', ['$q','$scope','$mdSidenav','$rootScope','Web3Service','SimpleITO',
function($q,$scope,$mdSidenav,$rootScope,Web3Service,ITO){
    console.log('Loading Home View');
    
    $scope.state = {
        ito: null,
        secondsUntilOfferStarts: null,
        secondsUntilOfferExpires: null,
        secondsUntilWithdrawExpires: null,
        currentTokenPrice: null,
        minTokenPrice: null,
        user:{
            address: null,
            etherBalanceInWei: null,
            committed: null,
            uncommitted: null,
            balance: null,
            tokenClaim: null
        }
    };
    
    $scope.input = {
        depositInEther: 0,
        commitInEther: 0,
        withdrawInEther: 0,
        depositTos: false,
        commitTos: false,
        depositAndCommitTos: null
    }
    
    $scope.active = {
        about: false,
        portfolio: false,
        services: false,
        invest: false,
        blog: false,
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
            Web3Service.getBlock(blockNumber),
            Web3Service.getCurrentAccount()
        ]).then(function(promises){
            $scope.state.ito = promises[0];
            var blockInfo = promises[1];
            var now = blockInfo.timestamp;
            $scope.state.user.address = promises[2];
            
            $scope.state.secondsUntilOfferStarts = $scope.state.ito.OFFER_STARTS - now;
            $scope.state.secondsUntilOfferExpires = $scope.state.ito.OFFER_EXPIRES - now;
            $scope.state.secondsUntilWithdrawExpires = $scope.state.ito.WITHDRAW_PERIOD_EXPIRES - now;
            
            $scope.offerStarted = false;
            $scope.offerEnded = false;
            $scope.withdrawPeriodEnded = false;
            
            if($scope.state.secondsUntilOfferStarts < 0 && $scope.state.secondsUntilOfferExpires > 0)
                $scope.offerStarted = true;
            else
                $scope.offerEnded = true;
              
            if($scope.state.secondsUntilWithdrawExpires < 0)
                $scope.withdrawPeriodEnded = true;
            
            $scope.state.currentTokenPrice = web3.fromWei($scope.state.ito.MAX_TOKEN_SUPPLY, 'ether') / web3.fromWei($scope.state.ito.totalEther, 'ether');
            $scope.state.minTokenPrice = web3.fromWei($scope.state.ito.MAX_TOKEN_SUPPLY, 'ether') / web3.fromWei($scope.state.ito.committed_ether, 'ether');
            
            Web3Service.getEtherBalance($scope.state.user.address)
            .then(function(balanceInWei){
                $scope.state.user.etherBalanceInWei = balanceInWei;
            });
            
            ITO.getBalances($scope.state.user.address)
            .then(function(balances){
                $scope.state.user.uncommitted = balances[0];
                $scope.state.user.committed = balances[1];
                $scope.state.user.balance = web3.fromWei($scope.state.user.uncommitted,'ether').toNumber() + web3.fromWei($scope.state.user.committed,'ether').toNumber();
                //console.log($scope.state.user.committed,$scope.state.user.uncommitted);
                //console.log($scope.state.user.balance);
                $scope.hasUncommittedBalance = false;
                if(web3.fromWei($scope.state.user.uncommitted,'ether').toNumber() > 0)
                    $scope.hasUncommittedBalance = true;
            });
            
            ITO.balanceOf($scope.state.user.address)
            .then(function(balance){
                return ITO.claimCalculator(balance,$scope.state.ito.totalEther);
            }).then(function(tokenClaim){
                $scope.state.user.tokenClaim = tokenClaim;
            });
        });
    };
    
    $scope.maxEther = function(){
        return web3.fromWei($scope.state.user.etherBalanceInWei,'ether').toNumber();
    }
    
    $scope.maxCommit = function(){
        return web3.fromWei($scope.state.user.uncommitted,'ether').toNumber();
    }
    
    Web3Service.getCurrentBlockNumber()
    .then(function(currentBlock){
       refresh(currentBlock);
    });

    web3.eth.filter('latest', function(err,blockNumber){
        refresh(blockNumber);
    });
    
    $scope.deposit = function(){
        ITO.deposit(web3.toWei($scope.input.depositInEther,'ether'))
        .then(function(txHash){
            //set lock here
            $scope.type = null;
            return Web3Service.getTransactionReceipt();
        }).then(function(receipt){
            console.log(receipt);
            //release lock here
        });
    }
    
    $scope.withdraw = function(){
        ITO.withdraw(web3.toWei($scope.input.withdrawInEther,'ether'))
        .then(function(txHash){
            //set lock here
            $scope.type = null;
            return Web3Service.getTransactionReceipt();
        }).then(function(receipt){
            console.log(receipt);
            //release lock here
        });
    }
    
    $scope.commit = function(){
        ITO.commit(web3.toWei($scope.input.commitInEther,'ether'))
        .then(function(txHash){
            //set lock here
            $scope.type = null;
            return Web3Service.getTransactionReceipt();
        }).then(function(receipt){
            console.log(receipt);
            //release lock here
        });
    }
    
    $scope.depositAndCommit = function(){
        ITO.depositAndCommit(web3.toWei($scope.input.depositInEther,'ether'))
        .then(function(txHash){
            //set lock here
            $scope.type = null;
            return Web3Service.getTransactionReceipt();
        }).then(function(receipt){
            console.log(receipt);
            //release lock here
        });
    }

}]);