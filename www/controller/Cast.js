<<<<<<< HEAD
app.controller('Cast', function(Config,Mic,$ionicScrollDelegate,$rootScope,$timeout,Upload,account,cast,$ionicPopup) {
=======
app.controller('Cast', function($localStorage,Mic,$ionicScrollDelegate,$rootScope,$timeout,Upload,$ionicModal,account,$state,cast,$ionicPopup) {
>>>>>>> aa6679ad5354b5c97b78dff680b6c1392a39540d
  
  $rootScope.fetch_user=function(id){
    var n=this;
    if(id){
    account.info(id).success(function(Data){
        if(Data.status==true){
          if(n.cast){
         n.cast.user=Data.data; 
          } if(n.caster){
            n.caster.data=Data.data;
           }
        }
      });
    }
  }
  
  

  

 $rootScope.recording=false;
    
     $rootScope.post={};







  








  


    





   
            

$rootScope.post_cast=function(cast){
    var go=true;
    if(cast.title){
      go=$rootScope.censor(cast.title);
    }
    if(go){
<<<<<<< HEAD
      var uploadUrl = Config.API + "cast/upload";
=======
      var uploadUrl = API + "cast/upload";
>>>>>>> aa6679ad5354b5c97b78dff680b6c1392a39540d
      console.log("Broadcasting...");
      cast.t_id=$rootScope.t_id;
      cast.file=$rootScope.file;

      if($rootScope.post.music_file){
        cast.music_file=$rootScope.post.music_file;
      }
      console.log(cast);
      cast.mentions=[];
      if($rootScope.mentions.length > 0){
          for(var i=0; i < $rootScope.mentions.length;i++){
            cast.mentions.push($rootScope.mentions[i]._id);
          }
      }
      cast.mentions=JSON.stringify(cast.mentions);
      cast.filter=JSON.stringify(cast.filter);
      $rootScope.broadcasting();
    Upload.upload({
      url: uploadUrl,
      data: cast
    }).then(function(resp) {
      var msg=resp.data.message;
      $rootScope.hide();
      $rootScope.pause_cast();
      $rootScope.clear();
      $ionicPopup.alert({template:msg});
      if(resp.data.status==true){
        $timeout(function(){
        $rootScope.clear();
        },2000);
        if(cast.recast){
            if($rootScope.cast.recasts){
                var recast=resp.data.data;
                $rootScope.cast.recasts.push(recast);
            }
        }
        if(cast.reply){
            if($rootScope.cast.replies){
                var reply=resp.data.data;
                $rootScope.cast.replies.push(reply);
            }
        }
        if($rootScope.cast){
          $rootScope.refresh_cast($rootScope.cast._id);
          $rootScope.get_replies($rootScope.cast._id);
        }
         $rootScope.record_box.hide();
         $rootScope.recast_box.hide();
         $rootScope.reply_box.hide();
         $rootScope.get_talk();
         $ionicScrollDelegate.scrollTop();
         $rootScope.refresh_profile();
      }
    }).catch(function(){
      $rootScope.hide();
      $ionicPopup.alert({
        template: "network error."
      });
    });
  }else{
    $ionicPopup.alert({
      template: "Your cast title contains some negative expression, please change it before you can upload this cast"
    });
  }
};













        












        

$rootScope.update_cast=function(c){
  var go=true;
  var data={
    _id:c._id,
    title:c.title
  }
  if(data.title){
    go=$rootScope.censor(data.title);
  }
  if(go){
    data.mentions=[];
    if($rootScope.mentions.length > 0){
        for(var i=0; i < $rootScope.mentions.length;i++){
          data.mentions.push($rootScope.mentions[i]._id);
        }
    }
    $rootScope.show();
  cast.update(data).success(function(Data){
    $rootScope.hide();
    $ionicPopup.alert({
      template: Data.message
    });
    if(Data.status==true){
      if($rootScope.cast){
        $rootScope.refresh_cast($rootScope.cast._id);
        $rootScope.get_replies($rootScope.cast._id);
      }
       $rootScope.get_talk();
       $ionicScrollDelegate.scrollTop();
       $rootScope.refresh_profile();
       window.history.back();
    }
  }).error(function(){
    $rootScope.hide();
    $ionicPopup.alert({
      template: "network error."
    });
  });
}else{
  $ionicPopup.alert({
    template: "Your cast title contains some negative expression, please change it before you can upload this cast"
  });
}
};







$rootScope.stop_recording=function(){
 Mic.stop();
}







$rootScope.reply_cast=function(cast) { 
  $rootScope.clear();
  if($rootScope.podcast){
    $rootScope.podcast.pause();
    $rootScope.podcast.currentTime=0;
  }
  if($rootScope.user){
     $rootScope.post={};
     $rootScope.post.cast=cast;
     $rootScope.post.reply=cast._id;
    $rootScope.reply_box.show();
  }else{
    $rootScope.auth_box.show();
    }
}









$rootScope.recast=function(cast) {
<<<<<<< HEAD
=======
  $rootScope.clear();
>>>>>>> aa6679ad5354b5c97b78dff680b6c1392a39540d
  if($rootScope.podcast){
    $rootScope.podcast.pause();
    $rootScope.podcast.currentTime=0;
  }
  if($rootScope.user){
     $rootScope.post={};
     $rootScope.post.cast=cast;
     $rootScope.post.recast=cast._id;
    $rootScope.recast_box.show();
  }else{
    $rootScope.auth_box.show();
  }
}











<<<<<<< HEAD
=======
$rootScope.like_cast=function(c){
  if($rootScope.user){ 
    if(this.cast.recast){
      c=this.cast.recast;
    }else
    if(this.cast){
      c=this.cast;
    }
    if($rootScope.user){
    var data={
              cast_id:c._id,
              _id:$rootScope.user._id
            };
            if(c.likes){
              c.likes.push($rootScope.user._id);
            }
        cast.like(data);
    }
  }else{
    $rootScope.auth_box.show();
  }
  };
  








  
  $rootScope.unlike_cast=function(c){
    if($rootScope.user){
       if(this.cast.recast){
        c=this.cast.recast;
      }else
      if(this.cast){
        c=this.cast;
      }
    if($rootScope.user){
    var data={
      cast_id:c._id,
      t_id:$localStorage.t_id,
      _id:$rootScope.user._id
    };
    c.likes.splice(c.likes.indexOf($rootScope.user._id),1);
    cast.unlike(data).success(function(){});
  }}else{
    $rootScope.auth_box.show();
  }
  };

>>>>>>> aa6679ad5354b5c97b78dff680b6c1392a39540d














$rootScope.close_recorder=function(){
  $rootScope.clear();
  $rootScope.record_box.hide();
  $rootScope.record_box.hide();
  $rootScope.recast_box.hide();
  $rootScope.reply_box.hide();
}














$rootScope.start_recording=function() {
  $rootScope.pause_cast();
  $rootScope.clear();
  Mic.rec(180);
}






    });
    