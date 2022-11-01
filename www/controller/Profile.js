app.controller('profile', function($cordovaSocialSharing,Config,$stateParams,$timeout,Upload,$scope,$state,account,$ionicPopup,$rootScope) {
  







  $rootScope.$emit('lazyImg:refresh');

  $rootScope.profile={};


if($stateParams.id){
  var id=$stateParams.id;
    $rootScope.fetch_profile(id);
}else{
  if($rootScope.user){
  $rootScope.refresh_profile();
  }
}
  
$scope.file_up=function(f) {
  $rootScope.show();
  $rootScope.file=f;
  $timeout(function(){
      $rootScope.hide();
  },3000);
};

$scope.header_up=function(f) {
  $rootScope.show();
  $rootScope.header_file=f;
  $timeout(function(){
      $rootScope.hide();
  },3000);
};




$rootScope.update_photo=function(){
  if($rootScope.user){
    var uploadUrl = Config.API + "upload_photo";
    var post={
      t_id:$rootScope.user.t_id
    };
    if($rootScope.file){
      post.file=$rootScope.file;
    }
    if($rootScope.header_file){
      post.header_file=$rootScope.header_file;
    }
      $rootScope.show();
      Upload.upload({
        url: uploadUrl,
        data: post
      }).then(function(resp) {
        var msg=resp.data.message;
        $rootScope.hide();
        $ionicPopup.alert({template:msg});
        if(resp.data.status==true){
            $rootScope.refresh_profile();
            $rootScope.file=null;
            window.history.back();
        }
      });
}
};







$rootScope.set_photo=function(){
  if($rootScope.file || $rootScope.header_file){
  if($rootScope.user){
    var uploadUrl = Config.API + "upload_photo";
    var post={
      t_id:$rootScope.user.t_id
    };
    if($rootScope.file){
      post.file=$rootScope.file;
    }
    if($rootScope.header_file){
      post.header_file=$rootScope.header_file;
    }
      $rootScope.show();
      Upload.upload({
        url: uploadUrl,
        data: post
      }).then(function(resp) {
        var msg=resp.data.message;
        $rootScope.hide();
        $ionicPopup.alert({template:msg});
        if(resp.data.status==true){
            $rootScope.refresh_profile();
            $rootScope.file=null;
            $state.go("front.talk");
        }
      });
}
  }else{
    $state.go("front.talk");
  }
};


    


    $scope.open_link=function(link){
      window.open(link, '_system', 'location=yes');
    };
    



    $rootScope.profile_update=function(profile){
      $rootScope.account_update(profile);
      window.history.back();
    }
    
    
    



    $rootScope.update_info=function(profile){
      $rootScope.account_update(profile);
      $state.go("front.talk");
    }
    



$rootScope.change_password=function(data){
  data.t_id=$rootScope.user.t_id;
  account.change_password(data).success(function(Data){
    $rootScope.hide();
    $ionicPopup.alert({
      template: Data.message
    });
    if(Data.status==true){
        $state.go("front.talk");
    }
       }).error(function(){
        $rootScope.hide();
        $ionicPopup.alert({
          template: "network error."
        });
       });    
};




$rootScope.new_password=function(n){
  data={
    t_id:$rootScope.user.t_id,
    new_password:n
  };
  account.new_password(data).success(function(Data){
    $rootScope.hide();
    $ionicPopup.alert({
      template: Data.message
    });
    if(Data.status==true){
        $state.go("front.talk");
    }
       }).error(function(){
        $rootScope.hide();
        $ionicPopup.alert({
          template: "network error."
        });
       });    
};


 





$rootScope.logout=function(){
  $ionicPopup.show({
    template: 'Are you sure you want to logout?',
    title: 'Sign out of account',
    scope: $rootScope,
    buttons: [
      {
      text: 'No' ,
      type:"button-light"
      },
      {
      text: '<b>Yes</b>',
      type: 'button-light',
      onTap: function(e) {    
        $timeout(function(){
        $rootScope.remove_account();
        },1000);
      }
    }
    ]
    });
  };
  
  




$rootScope.delete_account=function(data){
  $ionicPopup.show({
    template: 'Are you sure you want to delete your profile and all your casts from record permanently?',
    title: 'Delete account',
    scope: $rootScope,
    buttons: [
              {
              text: 'No' ,
              type:"button-light"
              },
              {
              text: '<b>Yes</b>',
              type: 'button-light',
              onTap: function(e) {    
                      $timeout(function(){
                        account.delete(data).success(function(Data){
                          $rootScope.hide();
                          if(Data.status==true){
                            $rootScope.remove_account();
                          }
                        }).error(function(){
                          $rootScope.hide();
                          $ionicPopup.alert({ template: "network error." });
                        });
                      },1000);
                  }
              }
          ]
    });
  };
  
  
  

});
  
  
  
  