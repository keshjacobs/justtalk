app.controller('splash', function($timeout,$state,$rootScope){
   
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