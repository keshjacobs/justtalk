app.controller('splash', function($timeout,$state,$rootScope){
     $timeout(function(){  
        $rootScope.play_sound("splash.wav");
        if(!$rootScope.notify){
            if(!$rootScope.t_id){
                $rootScope.start_box.show();
                $state.go("front.find");
        }else{
            $state.go("front.talk");
        }
    }
    },4000);


});