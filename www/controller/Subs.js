app.controller('Subs', function($stateParams,account,$rootScope) {
  

  $rootScope.get_subscribers=function(id){
    account.subscribers(id).success(function(Data){
      if(Data.status==true){
        $rootScope.subscribers=Data.data;    
      }
  });
  }

  if($stateParams.user_id){
    $rootScope.user_id=$stateParams.user_id;
    $rootScope.get_subscriptions($rootScope.user_id);
    $rootScope.get_subscribers($rootScope.user_id);
  }
  
  });
    
    
    
    