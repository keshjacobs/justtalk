app.controller('Messages', function(Chat,$ionicActionSheet,$localStorage,Mic,$rootScope,$timeout,Upload,$location,$ionicModal,Upload,Config,$state,$ionicPopup,$ionicScrollDelegate) {
     $rootScope.post={};
    $rootScope.file_added=null;

  
  $rootScope.view_request=function(request){
    $rootScope.show();
    $rootScope.request=request;
    $timeout(function(){
    $state.go("request");
    $rootScope.hide();
  },1000);
    }
  
    $rootScope.message_settings = function() {
      // Show the action sheet
       $ionicActionSheet.show({
          titleText: 'Action Sheet',
          cancelText: 'Cancel',	
          cancel: function() {
              // add cancel code...
          },
          buttonClicked: function(index) {
              if(index === 0) {
                // add edit 1 code
              }
          
              if(index === 1) {
                // add edit 2 code
              }
          },
          destructiveButtonClicked: function() {
            // add delete code..
            }
        });
 };


   
    $ionicModal.fromTemplateUrl('pop-ups/chat_details.html', {
      scope: $rootScope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $rootScope.chat_detail_box = modal;
    });
    



    $rootScope.add_member=function(chat){
      if(chat){
       $rootScope.chat_id=chat._id;
       console.log("joining chat......");
      }
      $rootScope.chat_detail_box.hide();
      $state.go("front.make_request");
  }
  
  
  



  $rootScope.request_chat=function(user){
    $rootScope.show();
    var chat_id=null;
    if($rootScope.chat){
      console.log("joining chat......");
     chat_id=$rootScope.chat._id;
    }
    var data={
      t_id:$localStorage.t_id,
      user_id:user._id,
      title:user.title || null,
      chat_id:chat_id,
      last_modified:new Date()
    }
    Chat.request(data).success(function(Data){
      $rootScope.hide();
      $rootScope.get_messages();
        if(Data.status==true){
          $state.go("front.messages");
        } 
           }).error(function(){
            $ionicPopup.alert({
              template: "network error."
            });
           }); 
}



$rootScope.accept_chat=function(chat){
  $rootScope.show();
  var data={
    t_id:$rootScope.user.t_id,
    chat_id:chat._id
  }
  Chat.accept(data).success(function(Data){
    $rootScope.hide();
      if(Data.status==true){
        $rootScope.get_messages();
        $state.go("front.messages");
      } 
      $ionicPopup.alert({
        template: Data.message
      });
         }).error(function(){
          $ionicPopup.alert({
            template: "network error."
          });
         }); 
}










$rootScope.decline_chat=function(chat){
  $rootScope.show();
  var data={
    t_id:$rootScope.user.t_id,
    chat_id:chat._id
  }
  Chat.decline(data).success(function(Data){
      if(Data.status==true){
        $rootScope.get_messages();
       window.history.back();
      } 
      $ionicPopup.alert({
        template: Data.message
      });

  $rootScope.hide();
         }).error(function(){
          $ionicPopup.alert({
            template: "network error."
          });
         }); 
}





$rootScope.leave_chat=function(chat){
  $ionicPopup.show({
    template: 'You would not be able to recieve messages or notifications from this chat',
    title: 'Are you sure you want to leave this chat?',
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
        if($rootScope){
        $rootScope.show(); 
    var data={
      t_id:$rootScope.t_id,
      chat_id:chat._id
    }
  $rootScope.chat_detail_box.hide();
  Chat.leave(data).success(function(Data){
    $rootScope.hide();
      if(Data.status==true){
        $rootScope.exit_chat();
      } 
      $ionicPopup.alert({
        template: Data.message
      });
         }).error(function(){
          $rootScope.hide();
          $ionicPopup.alert({
            template: "network error."
          });
         }); 
        }
        }
      }
    ]});
}




$rootScope.chat_admin=function(c){
  if(c){
    if(c.members){
      if($rootScope.user){
      var x= c.members.findIndex(function(m){ 
        if(m){
          return m.user._id==$rootScope.user._id;
        }
              });
              if(c.members[x]){
                return c.members[x].admin;
              }else{
                return false;
              }
            }else{
              return false;
            }
  }else{
    return false;
  }
}
}


$rootScope.delete_message=function(c){
  $ionicPopup.show({
    template: 'Are you sure you want to delete message?',
    title: 'Delete message',
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
          $rootScope.show();
          var data={
            chat_id:$rootScope.chat._id,
            cast_id:c._id
          }
          Chat.delete(data).success(function(Data){
              $rootScope.hide();
              $ionicPopup.alert({template:Data.message});
          }).error(function(){
              $rootScope.hide();
          });  
      }
    }
    ]
    });
  };




  $rootScope.exit_chat=function(){
    $rootScope.clear();
    $rootScope.pause_cast();
    $rootScope.pause_message();
    if ($location.path() != "/front/messages") {
      window.history.back();
    }
    $timeout(function(){
      $rootScope.chat={};
      $rootScope.playlist=[];
      $rootScope.chat_id=null;
    },1000);
    }
  
   
            

$rootScope.send_message=function(cast){
  $rootScope.messaging=true;
    var uploadUrl = Config.API + "message/send";
    cast.t_id=$rootScope.user.t_id;
    cast.chat_id=$rootScope.chat._id;
    cast.date_created=new Date();
    cast.file=$rootScope.file;
    Upload.upload({
      url: uploadUrl,
      data: cast
    }).then(function(resp) {
      if(resp.data.status==true){
        $rootScope.file_added=false;
        $rootScope.messaging=false;
        $rootScope.get_chat($rootScope.chat._id); 
        $timeout(function(){
          $rootScope.clear();
          },2000);
        $ionicScrollDelegate.scrollBottom();
      }else{
         $ionicPopup.alert({template:resp.data.message});
       }
    });
};



$rootScope.stop_recording=function(){
  Mic.stop();
}







$rootScope.start_recording=function() {
  $rootScope.pause_message();
  $rootScope.clear();
  if($rootScope.user){
       Mic.rec(180);
    }else{  
      $ionicPopup.alert({template:"User profile missing, please login again."});
    }
  }
  












  $rootScope.next_message=function(){
    console.log("next message....");
    // $rootScope.pause_message();
    $rootScope.pause_cast();
    $timeout(function(){
            $rootScope.track=$rootScope.track+1; 
            if($rootScope.playlist[$rootScope.track]){
                $rootScope.play_message($rootScope.playlist[$rootScope.track]);
            }
          },1000);
      }
  







  $rootScope.track_position2=function(position) {
  if($rootScope.playing_message.casting){
        $rootScope.pause_message();
      } 
    if(position){
      $rootScope.playing_message.timeLeft=$rootScope.playing_message.duration - parseInt(position);  
        }
  }

  



$rootScope.message_listen=function(c){
  var data={
    chat_id:$rootScope.chat._id,
    cast_id:c.cast_id,
    t_id:$rootScope.t_id
  }
  if(c.listens){
    var inx=c.listens.findIndex(function(cl){
        return cl.t_id==$rootScope.t_id;
     })
     if(inx < 0){
       c.listens.push($rootScope.user);
      Chat.listen(data).success(function(){});
     }
  }
}







      $rootScope.play_message=function(cast){
        if(!cast.casting){
        console.log("playing...."); 
        cast.casting=true;
        $rootScope.playing_message=cast;
          $timeout(function(){
          if(cast.cast){
          var src=$rootScope.media+cast.cast;
            $rootScope.play_audio(src);
          $rootScope.message_listen(cast);
          if(!$rootScope.playlist || $rootScope.playlist.length < 1){
          $rootScope.playlist=$rootScope.chat.conversations;
          }
          $rootScope.track=$rootScope.chat.conversations.indexOf(cast);
          }else{
            $rootScope.pause_message();
          }
          });
        }else{
          $rootScope.pause_message();
        }
        };
    
    
    


      });
      