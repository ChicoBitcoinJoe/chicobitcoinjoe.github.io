app.service( 'SimpleITO',['$q','Web3Service', function ($q,Web3Service) {
    console.log('Loading SimpleITO');
    
    var SimpleITO = {
        address: '0x7aceE208b28A590Be47A3EFCB5c4c8e90C508795',
        abi: [{"constant":true,"inputs":[],"name":"ITO","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Vault","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"deposit","type":"uint256"},{"name":"totalDeposits","type":"uint256"}],"name":"claimCalculator","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"vault","type":"address"},{"name":"token","type":"address"},{"name":"_MAX_TOKEN_SUPPLY","type":"uint256"},{"name":"_DELAY_START_IN_DAYS","type":"uint256"},{"name":"_OFFER_DURATION_IN_DAYS","type":"uint256"},{"name":"_WITHDRAW_PERIOD_IN_DAYS","type":"uint256"}],"name":"setup","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Token","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"deposit","type":"uint256"},{"name":"totalDeposits","type":"uint256"}],"name":"distributeTokens","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"claimed_tokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onApprove","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"MAX_TOKEN_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"proxyPayment","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"collectEther","outputs":[],"payable":false,"type":"function"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Claim_event","type":"event"}]
    };
    
    var ITO = {
        abi: [{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"depositAndCommit","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"uncommitted","type":"uint256"},{"name":"committed","type":"uint256"},{"name":"claimed","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"WITHDRAW_PERIOD_EXPIRES","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"OFFER_EXPIRES","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"OFFER_STARTS","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalEther","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"converted_ether","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"committed_ether","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"claimTokens","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"uncommitted_ether","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"Vault","type":"address"}],"name":"collectEther","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"deposit","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"commit","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_OFFER_STARTS","type":"uint256"},{"name":"_OFFER_EXPIRES","type":"uint256"},{"name":"_WITHDRAW_PERIOD_EXPIRES","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Deposit_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Commit_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdraw_event","type":"event"}]
    }
    
    var SimpleITOInstance = web3.eth.contract(SimpleITO.abi).at(SimpleITO.address);
    
    var service = {
        getState: function(){
            var deferred = $q.defer();
            
            $q.all([
                service.getOfferStart(),
                service.getOfferExpires(),
                service.getWithdrawPeriodExpires(),
                service.getMaxTokenSupply(),
                service.getToken(),
                service.getVault(),
                service.getUncommittedEther(),
                service.getCommittedEther(),
                service.getConvertedEther(),
                service.getClaimedTokens(),
                service.totalEther()
            ]).then(function(promises){
                var state = {};
                state['OFFER_STARTS'] = promises[0];
                state['OFFER_EXPIRES'] = promises[1];
                state['WITHDRAW_PERIOD_EXPIRES'] = promises[2];
                state['MAX_TOKEN_SUPPLY'] = promises[3];
                state['Token'] = promises[4];
                state['Vault'] = promises[5];
                state['uncommitted_ether'] = promises[6];
                state['committed_ether'] = promises[7];
                state['converted_ether'] = promises[8];
                state['claimed_tokens'] = promises[9];
                state['totalEther'] = promises[10];
                
                deferred.resolve(state);
            }).catch(function(err){
                console.error(err);
            });
            
            return deferred.promise;
        },
        //ITO Controller
        getITO: function(){
            var deferred = $q.defer();
            
            SimpleITOInstance.ITO(function(err,itoAddress){
                if(!err) {
                    deferred.resolve(itoAddress);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getToken: function(){
            var deferred = $q.defer();
            
            SimpleITOInstance.Token(function(err,tokenAddress){
                if(!err) {
                    deferred.resolve(tokenAddress);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getVault: function(){
            var deferred = $q.defer();
            
            SimpleITOInstance.Vault(function(err,vaultAddress){
                if(!err) {
                    deferred.resolve(vaultAddress);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getMaxTokenSupply: function(){
            var deferred = $q.defer();
            
            SimpleITOInstance.MAX_TOKEN_SUPPLY(function(err,maxTokenSupply){
                if(!err) {
                    deferred.resolve(maxTokenSupply);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getClaimedTokens: function(){
            var deferred = $q.defer();
            
            SimpleITOInstance.claimed_tokens(function(err,claimedTokens){
                if(!err) {
                    deferred.resolve(claimedTokens);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        claimCalculator: function(deposit,totalSupply){
            var deferred = $q.defer();
            
            SimpleITOInstance.claimCalculator(deposit, totalSupply, function(err,claimAmountInWei){
                if(!err) {
                    deferred.resolve(claimAmountInWei);
                } else {
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        //ITO
        getOfferStart: function(){
            var deferred = $q.defer();
            
            service.getITO().then(function(itoAddress){
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                
                itoInstance.OFFER_STARTS(function(err,offerStartTimestamp){
                    if(!err) {
                        deferred.resolve(offerStartTimestamp);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            
            return deferred.promise;
        },
        getOfferExpires: function(){
            var deferred = $q.defer();
            
            service.getITO().then(function(itoAddress){
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                
                itoInstance.OFFER_EXPIRES(function(err,offerExpiresTimestamp){
                    if(!err) {
                        deferred.resolve(offerExpiresTimestamp);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        getWithdrawPeriodExpires: function(){
            var deferred = $q.defer();
            
            service.getITO().then(function(itoAddress){
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                
                itoInstance.WITHDRAW_PERIOD_EXPIRES(function(err,endWithdrawPeriodTimestamp){
                    if(!err) {
                        deferred.resolve(endWithdrawPeriodTimestamp);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        getUncommittedEther: function(){
            var deferred = $q.defer();
            
            service.getITO().then(function(itoAddress){
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                
                itoInstance.uncommitted_ether(function(err,uncommittedEther){
                    if(!err) {
                        deferred.resolve(uncommittedEther);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        getCommittedEther: function(){
            var deferred = $q.defer();
            
            service.getITO().then(function(itoAddress){
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                
                itoInstance.committed_ether(function(err,committedEther){
                    if(!err) {
                        deferred.resolve(committedEther);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        getConvertedEther: function(){
            var deferred = $q.defer();
            
            service.getITO().then(function(itoAddress){
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                
                itoInstance.converted_ether(function(err,convertedEther){
                    if(!err) {
                        deferred.resolve(convertedEther);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        totalEther: function(){
            var deferred = $q.defer();
            
            service.getITO().then(function(itoAddress){
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                
                itoInstance.totalEther(function(err,totalEtherInWei){
                    if(!err) {
                        deferred.resolve(totalEtherInWei);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        getBalances: function(account){
            var deferred = $q.defer();
            
            service.getITO().then(function(itoAddress){
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                
                itoInstance.balances(account, function(err,balanceArray){
                    if(!err) {
                        deferred.resolve(balanceArray);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        balanceOf: function(account){
            var deferred = $q.defer();
            
            service.getITO().then(function(itoAddress){
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                
                itoInstance.balanceOf(account, function(err,balanceInWei){
                    if(!err) {
                        deferred.resolve(balanceInWei);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        deposit: function(amountInWei){
            var deferred = $q.defer();
            
            $q.all([
                service.getITO(),
                Web3Service.getCurrentAccount()
            ]).then(function(promises){
                var itoAddress = promises[0];
                var currentAccount = promises[1];
                
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                console.log(currentAccount,amountInWei);
                itoInstance.deposit(currentAccount, {from:currentAccount,value:amountInWei}, function(err,txHash){
                    if(!err) {
                        deferred.resolve(txHash);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        commit: function(amountInWei){
            var deferred = $q.defer();
            
            $q.all([
                service.getITO(),
                Web3Service.getCurrentAccount()
            ]).then(function(promises){
                var itoAddress = promises[0];
                var currentAccount = promises[1];
                
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                
                itoInstance.commit(amountInWei, {from:currentAccount}, function(err,txHash){
                    if(!err) {
                        deferred.resolve(txHash);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        depositAndCommit: function(amountInWei){
            var deferred = $q.defer();
            console.log(amountInWei);
            $q.all([
                service.getITO(),
                Web3Service.getCurrentAccount()
            ]).then(function(promises){
                var itoAddress = promises[0];
                var currentAccount = promises[1];
                
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                console.log(currentAccount,amountInWei);
                itoInstance.depositAndCommit(currentAccount, {from:currentAccount,value:amountInWei}, function(err,txHash){
                    if(!err) {
                        deferred.resolve(txHash);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        withdraw: function(amountInWei){
            var deferred = $q.defer();
            
            $q.all([
                service.getITO(),
                Web3Service.getCurrentAccount()
            ]).then(function(promises){
                var itoAddress = promises[0];
                var currentAccount = promises[1];
                
                var itoInstance = web3.eth.contract(ITO.abi).at(itoAddress);
                console.log(currentAccount,amountInWei);
                itoInstance.withdraw(amountInWei, {from:currentAccount}, function(err,txHash){
                    if(!err) {
                        deferred.resolve(txHash);
                    } else {
                        deferred.reject(err);
                    }
                });    
            });
            
            return deferred.promise;
        },
        claimTokens: function(){
            
        }
	};

	return service;
}]);