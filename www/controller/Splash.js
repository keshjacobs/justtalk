app.controller('splash', function($timeout,$state,$rootScope){
   
     $timeout(function(){
        if(!$rootScope.notify){
<<<<<<< HEAD
            if(!$rootScope.t_id){
                $rootScope.start_box.show();
                $state.go("front.find");
        }else{
            $state.go("front.talk");
=======
            $state.go("front.find");
            if(!$rootScope.t_id){
                $rootScope.start_box.show();
>>>>>>> aa6679ad5354b5c97b78dff680b6c1392a39540d
        }
    }
    },2000);


});