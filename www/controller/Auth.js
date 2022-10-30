app.controller('Auth', function($scope,$state,$http,account,$timeout,$ionicPopup,$rootScope,$localStorage) {

var ip=null;
$rootScope.counter=59;
<<<<<<< HEAD
=======
$rootScope.det={};
>>>>>>> aa6679ad5354b5c97b78dff680b6c1392a39540d

  $http.get("https://ipinfo.io/json").then(function (response) 
  {
    ip = response.data.ip;
  });



  $rootScope.countdown=function(){
    $rootScope.counter=$rootScope.counter-1;
      $timeout(function(){
            if($rootScope.counter > 0){
                $rootScope.countdown();
            }
      },1000);
  }

  
    $rootScope.login=function (data) {
      $rootScope.show();
      data.pushtoken=$rootScope.pushtoken;
     if(!data.password){
        $ionicPopup.alert({
       template: "Please provide your password."
     });
    }else{
        data.ip=ip;
        data.device={
          uuid:$rootScope.device.uuid,
          model:$rootScope.device.model,
          platform:$rootScope.device.platform,
          serial:$rootScope.device.serial
        };
        data.user_name=$localStorage.user_name;
      account.login(data).success(function(Data){
        $rootScope.hide();
        if(Data.status==true){
          $localStorage.t_id=Data.data.t_id;
          $rootScope.t_id=Data.data.t_id;
          $rootScope.user=Data.data;
          $state.go("front.talk");
          $rootScope.det={};
$rootScope.get_talk();
$rootScope.discovery();
$rootScope.get_messages();
$rootScope.get_notifications();
        }else{
        $scope.error=Data.message;
        }
      }).error(function(data){
        $rootScope.hide();
        $scope.error="OOPS! , CHECK YOUR INTERNET CONNECTION AND TRY AGAIN.";
      });
    }
     
    };
  
  






    $scope.resend_code = function () {
      $rootScope.show();
      if ($rootScope.t_user) {
        if ($rootScope.t_user.email) {
        $rootScope.hide();
        $ionicPopup.alert({
          template: "Please provide your email address. Empty field detected."
        });
        window.history.back();
      }else {
        account.reset($rootScope.t_user.email).success(function (Data) {
          $rootScope.hide();
          $rootScope.counter=59;
          if (Data.status==true) {
          } else {
            $ionicPopup.alert({
              template: Data.message
            });
          }
        });
      }
    }else{
      $rootScope.hide();
      window.history.back();
    }
    };
  
  



  
  
  
    $scope.reset = function (data) {
      $rootScope.show();
      if (!data.email) {
        $rootScope.hide();
        $ionicPopup.alert({
          template: "Please provide your email address. Empty field detected."
        });
      }else {
        account.reset(data.email).success(function (Data) {
          $rootScope.hide();
          if (Data.status==true) {
            $rootScope.t_user=Data.data;
            console.log($rootScope.t_user);
            $state.go("reset_code");
          } else {
            $ionicPopup.alert({
              template: Data.message
            });
          }
        });
      }
    };
  
  
  
  
  $rootScope.auth=function(user) {
    $rootScope.show();
<<<<<<< HEAD
    console.log(user);
    $rootScope.det=user;
    $localStorage.user_name=user.user_name;
    account.auth(user).success(function(Data){
      $rootScope.hide();
=======
    account.auth(user).success(function(Data){
      $rootScope.hide();
      $rootScope.det.user_name=user.user_name;
        $localStorage.user_name=user.user_name;
>>>>>>> aa6679ad5354b5c97b78dff680b6c1392a39540d
      if(Data.status==true){
        $rootScope.t_user=Data.data;
        console.log($rootScope.t_user);
        $state.go("password");
      }else{ 
        $state.go("register");
      }
    }).error(function(){
      $rootScope.hide();
      $scope.error="OOPS! ,CAN'T VALIDATE ACCOUNT, CHECK YOUR NETWORK CHECK YOUR INTERNET CONNECTION AND TRY AGAIN.";
    });
  };

  

  
  $scope.reset_code=function(code) {
    $rootScope.show();
    $rootScope.t_user.code=code;
    $rootScope.t_user.pushtoken=$rootScope.pushtoken;
    account.code($rootScope.t_user).success(function(Data){
      $rootScope.hide();
      if(Data.status==true){
        $localStorage.t_id=Data.data.t_id;
        $rootScope.t_id=Data.data.t_id;
        $rootScope.t_user=null;
        $rootScope.user=Data.data;
        $state.go("change_password");
      }else{
      $scope.error=Data.message;
      }
    }).error(function(){
      $rootScope.hide();
      $scope.error="OOPS! ,CAN'T VALIDATE ACCOUNT, CHECK YOUR NETWORK CHECK YOUR INTERNET CONNECTION AND TRY AGAIN.";
    });
  };

  




  
      $rootScope.register=function (data) {
        data.user_name=$localStorage.user_name;
        if(!data.full_name){
          $ionicPopup.alert({
            template: "Please provide your name."
          });
        }else if(!data.email){
          $ionicPopup.alert({
         template: "Please provide your email."
       });
      }
       else if(!data.password){
      $ionicPopup.alert({
     template: "Please provide a password for this account."
   });
   }else if(data.password!=data.rpassword){
    $ionicPopup.alert({
   template: "Password doesn't match."
 });
 }
else{
        $rootScope.show();
        data.pushtoken=$rootScope.pushtoken;
        data.ip=ip;
        data.device={
          uuid: $rootScope.device.uuid,
          model:$rootScope.device.model,
          platform:$rootScope.device.platform,
          serial:$rootScope.device.serial
        };
        account.register(data).success(function(Data){
          $rootScope.hide();
          if(Data.status==true){
              $localStorage.t_id=Data.data.t_id;
              $rootScope.user=Data.data;
              $rootScope.det={};

              $rootScope.get_talk();
              $rootScope.discovery();
              $rootScope.get_messages();
              $rootScope.get_notifications();
              $state.go("welcome");
              $localStorage.user_name=null;
          }else{
            $scope.error=Data.message;
          }
        }).error(function(data){
          console.log(data);
          $rootScope.hide();
          $scope.error="OOPS! , CHECK YOUR INTERNET CONNECTION AND TRY AGAIN.";
        });
      }
  
  
    };

    });
  
  
  
  
  
  