app.controller('splash', function($timeout,$state,$rootScope){
    $rootScope.play_sound("splash.wav");
     $timeout(function(){
        if(!$rootScope.notify){
            if(!$rootScope.t_id){
                $rootScope.start_box.show();
                $state.go("front.find");
        }else{
            $state.go("front.talk");
        }
    }
    },2000);


});