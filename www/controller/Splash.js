app.controller('splash', function($timeout,$state,$rootScope){
   
     $timeout(function(){
        if(!$rootScope.notify){
            $state.go("front.find");
            if(!$rootScope.t_id){
                $rootScope.start_box.show();
        }
    }
    },2000);


});