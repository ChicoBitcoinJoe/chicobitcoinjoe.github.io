var app = angular.module('app',['ngMaterial','ngAria','ngAnimate']);

app.controller('AppController', ['$scope',
function($scope) {
    console.log('Loading AppController');

    $scope.app = {
        view: 'quote',
        header: {
            preText: '',
            postText: '',
        },
        portfolio: [
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
        ],
        contacts: [
            {
                name: 'Email',
                preText: '',
                postText: '@gmail.com',
                link: 'mailto:chicobitcoinjoe@gmail.com',
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
        ],
    };
    
}]);