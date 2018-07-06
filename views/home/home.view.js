app.controller('HomeViewController', ['$scope',
function($scope){
    console.log("Loading Home View Controller");
    
    $scope.preText = '';
    $scope.postText = '';

    $scope.portfolio =  [
        {
            name: 'Github',
            preText: 'github.com/',
            postText: '',
            link: 'https://github.com/ChicoBitcoinJoe/',
        },{
            name: 'MeDao',
            preText: '',
            postText: '.github.io/MeDao',
            link: 'https://chicobitcoinjoe.github.io/MeDao',
        },{
            name: 'Community',
            preText: '',
            postText: '.github.io/community',
            link: 'https://chicobitcoinjoe.github.io/community',
        }
    ];

    $scope.contacts =  [
        {
            name: 'Email',
            preText: '',
            postText: '@gmail.com',
            link: 'chicobitcoinjoe@gmail.com',
        },{
            name: 'LinkedIn',
            preText: 'linkedin.com/in/',
            postText: '',
            link: 'https://www.linkedin.com/in/chicobitcoinjoe/',
        },{
            name: 'Reddit',
            preText: 'reddit.com/user/',
            postText: '',
            link: 'https://www.reddit.com/user/ChicoBitcoinJoe/',
        }
    ];

    $scope.updateHeader = function(item){
        if(item){
            $scope.preText = item.preText;
            $scope.postText = item.postText;
        } else {
            $scope.preText = '';
            $scope.postText = '';
        }
    }

    var first = true;
    var transitioning = false;
    $scope.transitionToView = function(view){
        if(!transitioning){
            transitioning = true;
            seconds = 1500;
            if(first) {
                seconds = 4000;
                first = false;
            }

            $scope.initialInterval = setInterval(function(){
                $scope.$apply(function(){
                    $scope.view = null;
                });
                clearInterval($scope.initialInterval);
            }, seconds);
            
            $scope.secondaryInterval = setInterval(function(){
                $scope.$apply(function(){
                    $scope.view = view;
                    $scope.showBackButton = true;
                });
                transitioning = false;
                clearInterval($scope.secondaryInterval);
            }, seconds + 2000);
        }
    }

    $scope.showQuote = function(){
        $scope.transitionToView('quote');
        $scope.showBackButton = true;
    }

    $scope.quote = {
        body: "Most of the good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program.",
        author: "Linus Torvalds",
    };
    
    $scope.body = "My name is Joseph Reed and I discovered the wild world of cryptocurrencies in late 2013 and quickly fell in love with the ethos of permissionless innovation and open source development. After an intense dive down the rabbit hole, I decided to flex my entrepreneurial spirit and join one of worlds fastest growing industries. My goal in financial technology is to create permissionless platforms for people all over the world to better their lives with. I am educated in C++, Java, and Android development as well as self taught in AngularJS and Solidity.";

    $scope.abstract = "A global economy warrants a new mode of employment where many individuals pay the wages of a single worker and collectively share the returns. A token provides part of the solution, but the benefits are lost if the token can be arbitrarily inflated by the token owner. Smart contracts on decentralized blockchains provide a solution to the inflation problem by embedding programmable limits into a digital token. As long as the cryptographic properties and incentives of decentralized blockchains hold true the value of each token is safe from theft or tampering by malicious parties. Incentives must be aligned such that the token holders have a vested interest in the success of the token owner and vice versa.";
    
    $scope.view = 'quote';
    $scope.transitionToView('body');

}]);