app.directive('timer', [function() {
	return {
		restrict: 'E',
		scope: {
            seconds: '=',
            alarm: '='
		},
		replace: true,
		templateUrl: 'directives/timer/timerDirective.html',
		controller: function($scope){
            
            $scope.timer = {
                secondsLeft: null,
                value: null,
                unit: null
            };
            
            setInterval(function(){
                //console.log($scope.timer.secondsLeft);
                
                if($scope.seconds == null){
                    //wait
                } else if($scope.timer.secondsLeft == null){
                    $scope.timer.secondsLeft = $scope.seconds;
                } else {
                   
                    $scope.timer.secondsLeft--;

                    if($scope.timer.secondsLeft < 0)
                        $scope.timer.secondsLeft = 0;

                    var timeLeft = $scope.timer.secondsLeft;
                    var days = Math.floor(timeLeft/(24*60*60));
                    //console.log(days);
                    timeLeft -= days*(24*60*60);
                    var hours = Math.floor(timeLeft/(60*60));
                    //console.log(hours);
                    timeLeft -= hours*(60*60);
                    var minutes = Math.floor(timeLeft/60);
                    var seconds = timeLeft - minutes*60;
                    
                    
                    $scope.$apply(function(){
                        if(days > 0){
                            $scope.timer.value = days;
                            if(days == 1)
                                $scope.timer.unit = 'day'
                            else
                                $scope.timer.unit = 'days'
                        } else if(hours > 0){
                            $scope.timer.value = hours;
                            if(days == 1)
                                $scope.timer.unit = 'hour'
                            else
                                $scope.timer.unit = 'hours'
                        } else if(minutes > 0){
                            $scope.timer.value = minutes;
                            if(days == 1)
                                $scope.timer.unit = 'minute'
                            else
                                $scope.timer.unit = 'minutes'
                        } else {
                            $scope.timer.value = seconds;
                            $scope.timer.unit = 'seconds'
                        }
                        
                        if($scope.timer.secondsLeft <= 0){
                            $scope.alarm = true;
                            $scope.timer.secondsLeft = null;
                        }
                    });
                }
            }, 1000);
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);