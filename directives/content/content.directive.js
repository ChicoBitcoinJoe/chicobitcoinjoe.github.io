app.directive('content', [function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'directives/content/content.directive.html',
		scope: {
			view: '='
		},
		controller: function($scope){
			
			$scope.quote = {
				body: "Most of the good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program.",
				author: "Linus Torvalds",
			};
			
			$scope.content = {
				body: "My name is Joseph Reed and I discovered the wild world of cryptocurrencies in late 2013 and quickly fell in love with the ethos of permissionless innovation and open source development. After an intense dive down the rabbit hole, I decided to flex my entrepreneurial spirit and join one of worlds fastest growing industries. My goal in financial technology is to create permissionless platforms for people all over the world to better their lives with. I am educated in C++, Java, and Android development as well as self taught in AngularJS and Solidity.",
				abstract: "A global economy warrants a new mode of employment where many individuals pay the wages of a single worker and collectively share the returns. A token provides part of the solution, but the benefits are lost if the token can be arbitrarily inflated by the token owner. Smart contracts on decentralized blockchains provide a solution to the inflation problem by embedding programmable limits into a digital token. As long as the cryptographic properties and incentives of decentralized blockchains hold true the value of each token is safe from theft or tampering by malicious parties. Incentives must be aligned such that the token holders have a vested interest in the success of the token owner and vice versa.",
				community: "Community is a free speech platform for finding the value of your knowledge and opinions using the power of a MeDao. Users buy tokens from people who post valuable insights and sell tokens from people who do not share the same values as the user."
			}		

			var transitioning = false;
			$scope.transitionToView = function(view){
				
				if(interval)
					clearInterval(interval);
				
				if(!transitioning){
					transitioning = true;
					
					console.log('Transitioning to ' + view);
					$scope.view = null;
					
					$scope.secondaryInterval = setInterval(function(){
						$scope.$apply(function(){
							$scope.view = view;
						});
						transitioning = false;
						clearInterval($scope.secondaryInterval);
					}, 2500);
				}
			}
			
			var interval = setInterval(function(){
				$scope.$apply(function(){
					$scope.transitionToView('body');
				});
				clearInterval(interval);
			}, 6000);
		}
	}
}]);