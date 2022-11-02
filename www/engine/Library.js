app.run(function($ionicPlatform,Aud,socket,Upload,$cordovaSocialSharing,$cordovaDeeplinks,$ionicActionSheet,$http,Chat,$ionicModal,$ionicLoading,Config,$localStorage,$timeout,$location,$rootScope,$ionicHistory,$state,$ionicScrollDelegate,account,cast,$sce,$sessionStorage,$ionicPopup){
  $rootScope.media=Config.media;
  
  $rootScope.pages=1;

  $rootScope.change_bar=function(){
      if(!$rootScope.settings.dark_mode){
          StatusBar.styleDefault();
      }else{
        StatusBar.styleLightContent();
      }
  };

 

  $rootScope.settings={
    dark_mode:false
  };
  if($localStorage.dark_mode){
    $rootScope.settings.dark_mode=$localStorage.dark_mode;
  }else{
    $localStorage.dark_mode=false;
  }

  let biquadFilter,gainNodeR,gainNodeL,compressor;
  $rootScope.source={};
  if (window.indexedDB) {
    console.log('-----(WKWebView)');
} else {
   console.log('-----(UIWebView)');
}


$rootScope.det={user_name:""};
  $rootScope.voice_filters=voice_filters;
  $rootScope.notify=false;
  $rootScope.home_loader=false;
  $rootScope.msg_loading=false;   
  $rootScope.casts_loading=false;
  $rootScope.timer=180;
  $rootScope.mentions=[];
      $sessionStorage.user=null;
      $localStorage.user=null;
      $rootScope.t_id=null;
      $rootScope.cast={};
      $rootScope.search_results=[];
      $rootScope.blocked=[];
      $rootScope.chat={};
      $rootScope.profile={};
      $rootScope.recording=false;
      $rootScope.messaging=false; 
       $rootScope.device={
        model:null,
        uuid:null,
        platform:null,
        serial:null
    };
    $rootScope.cast_replies=[];

    $rootScope.mediaStream = null;
    $rootScope.mediaRec = null;

  $rootScope.fetching_cast=true;

  $rootScope.playlist=[];
  $rootScope.top_boys=[];
  $rootScope.track=0;






//   function mix_audio(buffer1,buffer2) {
//     var maxChannels =  buffer1.numberOfChannels;
//     var maxDuration = buffer1.duration;
//     var mixed = AudioMan.createBuffer(maxChannels,maxDuration,AudioMan.sampleRate);
//     var _out;
//     for (var srcChannel = 0; srcChannel < buffer1.numberOfChannels; srcChannel++) {
//        _out = mixed.getChannelData(srcChannel);
//       var channel1 = buffer1.getChannelData(srcChannel);
//       for (var i = 0; i < channel1.length; i++) {
//           _out[i] += channel1[i];
//       }
//     }
//     for (var srcChannel = 0; srcChannel < buffer2.numberOfChannels; srcChannel++) {
//           var channel2 = buffer2.getChannelData(srcChannel);
//           for (var i = 0; i < channel2.length; i++) {
//               _out[i] += channel2[i];
//           }
//       }
// console.log("mixed audio:");
// console.log(mixed);
//     return mixed;
// }


$ionicModal.fromTemplateUrl('pop-ups/record.html', {
  scope: $rootScope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $rootScope.record_box = modal;
});





  $rootScope.play_audio=function (audio) {
    var main_cast;
    if($rootScope.playing_message){
      if($rootScope.playing_message.casting){
            main_cast=$rootScope.playing_message;
          }
    }else if($rootScope.post){
                main_cast=$rootScope.post;
              }else{
            main_cast=$rootScope.current_cast;
          }
    if(!main_cast.timeLeft){
      main_cast.timeLeft=main_cast.duration;
    }
    if(!main_cast.filter){
      main_cast.filter=voice_filters[0];
    }
    $http.get(audio, {responseType: "arraybuffer"}).success(function(arrayBuffer) {
      console.log("arraybuffering.......");
      let AudioMan= new Aud();
      let source = AudioMan.createBufferSource();
      let music_source = AudioMan.createBufferSource();
    AudioMan.decodeAudioData(arrayBuffer).then(function(buffer) {
      console.log("Decoded arraybuffer:..........");
      console.log(buffer);
    biquadFilter = AudioMan.createBiquadFilter();  
    gainNodeR = AudioMan.createGain();
    gainNodeL = AudioMan.createGain();
    if(buffer){
      source.audio = audio;
      source.buffer = buffer;
      source.crossOrigin = "anonymous";   
      source.muted = false;
      source.loop=false;
      source.autoplay=true;
      source.playbackRate.value =main_cast.filter.pitch;
      gainNodeR.gain.value = 1;
      source.connect(gainNodeR);
      gainNodeR.connect(biquadFilter);
      biquadFilter.type = main_cast.filter.type;
      biquadFilter.frequency.value = main_cast.filter.frequency;
      biquadFilter.gain.value = main_cast.filter.gain;
      biquadFilter.Q.value = 100;
      biquadFilter.connect(AudioMan.destination);
      var ct=parseInt(main_cast.duration)-parseInt(main_cast.timeLeft);
      source.onended=function(){   
                          if($rootScope.Music){
                            $rootScope.Music.stop();
                          }  
                          if(main_cast.timeLeft < 1.5){
                            main_cast.timeLeft=main_cast.duration; 
                            if($rootScope.playing_message){
                              console.log("ending message!");
                              $rootScope.pause_message();
                              if($rootScope.playlist.length > 1){
                                  $rootScope.next_message();
                                  } 
                              }else{
                                console.log("ending cast or post!");
                                $rootScope.pause_cast();
                                if(!main_cast.file){
                                  // if($rootScope.playlist.length > 1){
                                      $rootScope.next_cast();
                                    // } 
                                  } 
                              }
                          }
                          };
        if(main_cast.music){
          console.log("music playable.......");
          $rootScope.connect_music(main_cast.music).success(function(bf) {
            console.log("music buffer:");
            console.log(bf);
            AudioMan.decodeAudioData(bf).then(function(musicbuffer) {
              if(musicbuffer){
                music_source.buffer=musicbuffer;
                music_source.crossOrigin = "anonymous";   
                music_source.muted = false;
                music_source.loop=true;
                music_source.autoplay=true;
                music_source.connect(gainNodeL);
                gainNodeL.gain.value = 0.2;
                gainNodeL.connect(AudioMan.destination);
                if (source.start) {
                  source.start(0,ct);
                  music_source.start(0,ct);
                  } else if (source.play) {
                    source.play(0,ct);
                    music_source.play(0,ct);
                  } else if (source.noteOn) {
                      source.noteOn(0,ct);
                      music_source.play(0,ct);
                  }
                  console.log("start.............");
                  $rootScope.source=source;
                  $rootScope.source.started=true;
                  $rootScope.Music=music_source;
                  $rootScope.currentTime(main_cast);
            }
            });  
            });
        }else{
          if (source.start) {
            source.start(0,ct);
            } else if (source.play) {
              source.play(0,ct);
            } else if (source.noteOn) {
                source.noteOn(0,ct);
            }
            console.log("start.............");
            $rootScope.source=source;
            $rootScope.source.started=true;
            $rootScope.currentTime(main_cast);
        }
}else{
  console.log("can not decode buffer............................");
}
  }).catch(function(e){  
    console.log("can not decode buffer:"+e.err);
    console.log("error msg buffer :"+e.message);
    $rootScope.pause_message();
  });  
}).error(function() {
  if($rootScope.playing_message){
    console.log("ending because there was a fetch error...................!");
    $rootScope.pause_message();
  }else{
    console.log("ending cast or post!........................");
    $rootScope.pause_cast();
  }
});
};







$rootScope.connect_music=function (audio) { 
  var link;
  if($rootScope.file){
    link=audio;
  }else{
    link=$rootScope.media+audio;
  }

  console.log("music link:");
  console.log(link);
  return $http.get(link, {responseType: "arraybuffer"});
};





$rootScope.pause_audio=function(){
  console.log('Pausing....');
  if ($rootScope.source.started) {
    $rootScope.source.started=false;
    $rootScope.source.stop();
    if($rootScope.Music){
      $rootScope.Music.stop();
    }
    console.log($rootScope.source);
    }
}

$rootScope.unlock_media=function() {
 var AudioMan= new Aud();
  var source = AudioMan.createBufferSource();
  console.log("unlocking");
  // create empty buffer and play it
  var buffer = AudioMan.createBuffer(1, 1, 22050);
  source.buffer = buffer;
  source.connect(AudioMan.destination);
  if (source.start) {
      source.start(0);
      } else if (source.play) {
          source.play(0);
      } else if (source.noteOn) {
          source.noteOn(0);
      }
      $rootScope.source=source;
      $rootScope.source.started=true;
      document.body.removeEventListener('click', $rootScope.unlock_media);
      document.body.removeEventListener('touchstart',$rootScope.unlock_media);
      $rootScope.pause_audio();

}




  // var wavesurfer = WaveSurfer.create();


  $rootScope.file=null;

  $rootScope.file_added=false;



  $rootScope.edit_cast = function(cast) {
    $rootScope.selected_cast=cast;
    $rootScope.mentions=cast.mentions;
    $state.go("edit_cast");
  }


$rootScope.change_mode=function(){
    $rootScope.change_bar();
    $localStorage.dark_mode=!$localStorage.dark_mode;
    $rootScope.settings.dark_mode=$localStorage.dark_mode;
}


  $rootScope.cast_more = function(cast) {
    var buttons=[
      { text: ' Share' },
      { text: ' Report' },
      { text: ' Remove from timeline' }
   ];
   var menu={
    buttons: buttons,
    titleText: 'Cast Options',
    cancelText: ' Cancel',
    cancel: function() {
      return true;
    },
    buttonClicked: function(index) {
       if(index === 0) {
        $rootScope.share_cast(cast);
       }
       if(index === 1) {
        $rootScope.report_cast(cast);
       }
       if(index === 2) {
        $rootScope.remove_cast(cast);
       }
       if(index === 3) {
        $rootScope.edit_cast(cast);
       }
       return true;
    }
 }
 if(cast.caster.t_id==$rootScope.t_id){
  buttons.push({ text: ' Edit' });
  menu.destructiveText=' Delete';
  menu.destructiveButtonClicked=function(){
      $rootScope.delete_cast(cast);
      return true;
  }
}
    $ionicActionSheet.show(menu);
 };







$rootScope.use_voice=function(voice){
  $rootScope.pause_cast();
  $rootScope.post.filter=voice;
  $rootScope.voice_box.hide();
}




  $rootScope.cast_status= function (c) {
    if (c) {
      if (!c.expired) {
      if ($rootScope.user) {
        var user_id=$rootScope.t_id;
        var caster=null;
       if (c.caster) {
         caster=c.caster;
       }else{
        caster=c.user;
       }
       if (caster) {
        if (caster.t_id==user_id) {
      return 'played_cast';
     }else{
      if (c.listens)  {
      var y=c.listens.findIndex(function(l){
        return l.t_id==user_id || l==$rootScope.user._id;
      });
      if(y > -1){
        return 'played_cast';
      }else{
        return 'unplayed_cast';
      } 
    }else{
        return 'unplayed_cast';
      }
    }
  }else{
      return 'button-oran';
    }
  }else{
    return 'played_cast';
  } 
  }else{
    return 'expired_cast';
  }
}
};




$rootScope.randy=function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
};
 


$rootScope.play_status= function (c) {
  if (c) {
      if ($rootScope.user) {
      var user_id=$rootScope.t_id;
      var caster=null;
     if (c.caster) {
       caster=c.caster;
     }else{
      caster=c.user;
     }
     if (caster) {
      if (caster.t_id==user_id) {
      return 'button-played';
     }else{
     if (c.listens) {
            var y=c.listens.findIndex(function(l){
              return l.t_id==user_id || l==$rootScope.user._id;
            });
            if(y > -1){
              return 'button-played';
            }else{
              return 'button-oran';
            }
        }else{
          return 'button-oran';
        }
      }
    }else{
      return 'button-oran';
    }
    }else{
      return 'button-played';
    }
    }else{
      return 'button-oran';
    }
};





$rootScope.has_played= function (c) {
  if (c) {
    if ($rootScope.user) {
      var user_id=$rootScope.user._id || 0;
      if (c.caster) {
        if (c.caster._id==user_id) {
      if (c.played) {
        return false;
      }else{
        return false;
      }
  } else if (c.listens) {
    var y=c.listens.findIndex(function(l){
      return l==user_id;
    });
    if(c.listens[y]){
      return false;
    }else{
      return true;
    }
  } else{
      return true;
  }
}else{
  return false;
} 
}else{
  return false;
} 
}else{
  return false;
}
};


$ionicModal.fromTemplateUrl('pop-ups/voices.html', {
  scope: $rootScope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $rootScope.voice_box = modal;
});



$ionicModal.fromTemplateUrl('pop-ups/mention.html', {
  scope: $rootScope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $rootScope.mention_box = modal;
});



  $rootScope.broadcasting = function() {
    $ionicLoading.show({
      templateUrl: 'components/broadcasting.html'
    });
  };
   
  $rootScope.show=function() {
    $ionicLoading.show({
      templateUrl: 'components/loading.html'
    });
  };
   
   $rootScope.hide=function(){
    $rootScope.$broadcast('scroll.refreshComplete');
     $ionicLoading.hide();
   };
   
  
   
   
  $ionicModal.fromTemplateUrl('pop-ups/air_cast.html', {
    scope: $rootScope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $rootScope.aircast_box = modal;
  });
  

  $ionicModal.fromTemplateUrl('pop-ups/auth.html', {
    scope: $rootScope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $rootScope.auth_box = modal;
  });
  

          

  $ionicModal.fromTemplateUrl('pop-ups/listeners.html', {
    scope: $rootScope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $rootScope.listen_box = modal;
  });
  

          

  $ionicModal.fromTemplateUrl('pop-ups/search.html', {
    scope: $rootScope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $rootScope.search_box = modal;
  });
      

          
   
  $ionicModal.fromTemplateUrl('pop-ups/reply.html', {
    scope: $rootScope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $rootScope.reply_box = modal;
  });
  

   
$ionicModal.fromTemplateUrl('pop-ups/start.html', {
  scope: $rootScope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $rootScope.start_box = modal;
});


$ionicModal.fromTemplateUrl('pop-ups/recast.html', {
    scope: $rootScope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $rootScope.recast_box = modal;
  });


$rootScope.remove_account=function(){  
      $timeout(function(){
        $rootScope.user=null;
        $localStorage.t_id=null;
        $rootScope.t_id=null;
        $localStorage.chats=null;
        $localStorage.user=null;
        $rootScope.chats=null;
        $rootScope.user=null;
        $state.go("front.talk"); 
      },1000);
  };
  
  









  $rootScope.get_library=function(){
  if($rootScope.user){
  cast.saved($rootScope.user._id).success(function(Data){
    $rootScope.hide();
    console.log(Data);
      if(Data.status==true){
        $localStorage.saved_casts=Data.data;
        $rootScope.saved_casts=$localStorage.saved_casts;
      }
  }).error(function(){
    console.log("could not fetch saved casts");
    $rootScope.hide();
  });
  account.library($rootScope.user._id).success(function(Data){
    $rootScope.hide();
      if(Data.status==true){
            $localStorage.library=Data.data;
            $rootScope.library=$localStorage.library;
      }
  }).error(function(){
    console.log("could not fetch library");
    $rootScope.hide();
  });
}
};





  if($localStorage.library){
    $rootScope.library=$localStorage.library;
  }else{
    $rootScope.library=[];
  }

  $rootScope.filterReplies=function(item) { 
    if (item.reply!=null){
        return item;
      }
  };


  $rootScope.filterRecasts=function(item) { 
    if (item.recast){
        return item;
      }
  };



  $rootScope.search_mention=function(key){
    account.search_mention(key).success(function(Data){
        if(Data.status==true){
            $rootScope.user_results=Data.data;    
        }
    });
}

  

$rootScope.refresh_profile=function(){
  if($localStorage.t_id){
  var id=$localStorage.t_id;
  $rootScope.t_id=id;
  $rootScope.fetching_casts=true;
  $timeout(function(){
  account.info(id).success(function(Data){
    $rootScope.hide();
      if(Data.status==true){
        $rootScope.user=Data.data;
        $rootScope.blocked=$rootScope.user.block_list;
        console.log("Profile:");
        console.log(Data.data);
        account.casts(id).success(function(Data){
          $rootScope.fetching_casts=false;
          if(Data.status==true){
            $rootScope.my_casts=Data.data;
            $localStorage.my_casts=Data.data.splice(5,20);
          }
        }); 
      }else{
        console.log("could not conenct");
      }
  }).error(function(){
    $rootScope.fetching_casts=false;
    console.log("could not conenct");
    $rootScope.hide();
  });
},2000);
}
};






$rootScope.account_update=function(profile){
  if(profile){
    if($localStorage.pushtoken){
    profile.pushtoken=$localStorage.pushtoken;
  }
  profile.t_id=$localStorage.t_id;
   account.update(profile).success(function(Data){
       if(Data.status==true){
         $rootScope.refresh_profile();
       }else{
        $rootScope.hide();
       }
   }).error(function(){
        $rootScope.hide();
   });
  }
};


  $rootScope.refresh_profile();
    



  $rootScope.select_user=function(user){
    $state.go("confirm_request");
  $timeout(function(){
    $rootScope.selected_user=user;
    if($rootScope.chat){
      console.log("in chat");
      $rootScope.selected_user.title=$rootScope.chat.title;
    }else{
    console.log("out chat");
      }
  },1000);
  }




  $rootScope.censor=function(str) {
    var bad_words=["kill","die","murder","death"];
    for (var i = 0; i != bad_words.length; i++) {
       var word = bad_words[i];
       if (str.indexOf(word) != - 1) {
         return false;
       }
    }
    return true; 
}
    



$rootScope.search=function(key){
  $rootScope.search_loading=true;
  account.search(key).success(function(Data){
      $rootScope.search_loading=false;
      if(Data.status==true){
          $rootScope.user_results=Data.users;   
          $rootScope.cast_results=Data.casts;   
          $rootScope.search_results=$rootScope.cast_results.length + $rootScope.user_results.length;   
      }
  });
}




$rootScope.dropall=function(){
  $rootScope.chat_detail_box.hide();
}


  $rootScope.update_chat=function(chat){
        if(chat){
            Chat.update(chat).success(function(){
            $rootScope.chat_detail_box.hide();
            });
          }
        }    
  
$rootScope.get_chat=function(id){
  $rootScope.msg_loading=true;
  Chat.info(id).success(function(Data){
    if(Data.status==true){
      $rootScope.chat=Data.data; 
      console.log($rootScope.chat);
      $rootScope.messaging=false;
      $rootScope.msg_loading=false;
      $rootScope.get_messages();
      $rootScope.pause_cast();
      $rootScope.sink();
      $rootScope.clear();
      $rootScope.clear();
    }
});
}




$rootScope.open_listens=function(listeners){
  $rootScope.listeners=listeners;
  $rootScope.listen_box.show();
}



$rootScope.open_cast=function(cast){
  $rootScope.cast_replies=[];
  $rootScope.cast=cast;
  $rootScope.search_box.hide();
  $state.go("cast");
  $timeout(function(){
    $rootScope.cast.casting=true;
    $rootScope.refresh_cast(cast._id);
  },100);
}



$rootScope.sink=function(){
  $timeout(function(){
    $ionicScrollDelegate.scrollBottom();
  },500);
}
    
  $rootScope.open_chat=function(chat){
    if(chat){
      $state.go("chat");
      $rootScope.sink();
      $rootScope.pause_cast();
    $rootScope.chat=chat;
    $timeout(function(){
    $rootScope.get_chat(chat._id);
    },100);
  }
  }

    
  $rootScope.message_user=function(user){
    if($rootScope.chats){
      $rootScope.chat=null;
      for(var i=0;i < $rootScope.chats.length;i++){
        var chat=$rootScope.chats[i];
        if(chat.members){
        var index=chat.members.findIndex(function(m){
            return m.user._id==user._id;
        });
        if(index >= 0){
          $rootScope.chat=chat;
        }
      }
      }
      if($rootScope.chat){
        $timeout(function(){
        $rootScope.open_chat($rootScope.chat);
        },1000);
      }else{
        $timeout(function(){
        $rootScope.select_user(user);
        },1000);
      }
    }
  }

    
        
  $rootScope.block_user=function(user){
    $rootScope.blocked=[];
    $rootScope.blocked.push(user.t_id);
    if($rootScope.t_id){
      var data={
        t_id:user.t_id,
        blocker:$rootScope.t_id
      }
      account.block(data).success(function(Data){
        if(Data.status==true){
          $rootScope.refresh_profile();
        }else{
         $rootScope.hide();
        }
    }).error(function(){
         $rootScope.hide();
    });
  }
  }



        
  $rootScope.unblock_user=function(user){
    $rootScope.blocked.splice($rootScope.blocked.indexOf(user.t_id),1);
    if($rootScope.t_id){
      var data={
        t_id:user.t_id,
        blocker:$rootScope.t_id
      }
      account.unblock(data).success(function(Data){
        if(Data.status==true){
          $rootScope.refresh_profile();
        }else{
         $rootScope.hide();
        }
    }).error(function(){
         $rootScope.hide();
    });
  }
  }










$rootScope.like_cast=function(c){
  if($rootScope.user){ 
    if(this.current_cast){
  if(this.current_cast.recast){
    c=this.current_cast.recast;
  }else{
    c=this.current_cast;
  }
  }else
    if(this.cast.recast){
      c=this.cast.recast;
    }else
    if(this.cast){
      c=this.cast;
    }
    if($rootScope.user){
                  if(c.likes){
                    if($rootScope.liked(c)){
                      c.likes.splice(c.likes.indexOf($rootScope.user._id),1);
                      cast.unlike({
                        cast_id:c._id,
                        t_id:$localStorage.t_id,
                        _id:$rootScope.user._id
                      });
                    }else{
                      c.likes.push($rootScope.user._id);
                      cast.like({cast_id:c._id,
                        _id:$rootScope.user._id,
                        t_id:$localStorage.t_id
                      });
                    }
                  }
    }
  }else{
    $rootScope.auth_box.show();
  }
  };
  








    
    
  
  $rootScope.liked=function(c){
    var value=false;
    if($rootScope.user){
      if(c){
        if(c.likes){
          var x=c.likes.findIndex(function(l){
            return l==$rootScope.user._id;
          });
    if(x >= 0){
      value=true;
    }
  }
}
  }
  return value;
  };
  


  $rootScope.is_blocked=function(user){
    var value=false;
    if($rootScope.blocked){
      var m=$rootScope.blocked.findIndex(function(sub){
        return sub==user.t_id;
      });
      if(m >= 0){
        value=true;
        }
    }
  return value;
  };


  $rootScope.subscribed=function(user){
    var value=false;
    if($rootScope.user){
      var m=$rootScope.user.subscriptions.findIndex(function(sub){
        return sub==user._id || sub._id==user._id;
      });
      if(m >= 0){
        value=true;
        }
    }
  return value;
  };

  $rootScope.in_sub=function(user){
    var value=false;
    if($rootScope.user){
      var m=user.subscriptions.findIndex(function(sub){
        return sub==$rootScope.user._id;
      });
      if(m >= 0){
        value=true;
        }
    }
  return value;
  };




  $rootScope.mentioned=function(user){
    var value=false;
      var m=$rootScope.mentions.findIndex(function(sub){
        return sub._id==user._id;
      });
      if(m >= 0){
        value=true;
        }
  return value;
  };



  $rootScope.start_talk=function(){
    $rootScope.clear();
    $rootScope.pause_cast();
    $rootScope.post={};
    $rootScope.record_box.show();
  }

  
  $rootScope.add_mention=function(user){
    if(!$rootScope.mentioned(user)){
      $rootScope.mentions.push(user);
      $rootScope.mention_box.hide();
    }
  };
  
  
  $rootScope.remove_mention=function(user){
    if($rootScope.mentioned(user)){
      var x=$rootScope.mentions.findIndex(function(m){
        return m==user._id;
      });
      $rootScope.mentions.splice(x,1);
    }
  };
  


  $rootScope.recasted=function(c){
    var value=false;
    if($localStorage.t_id){
      if(c){
                if($rootScope.my_casts){
                  var x=$rootScope.my_casts.findIndex(function(cast){
                    if(cast.recast){
                    return cast.recast._id==c._id;
                    }
                  });
                  if(x >= 0){
                    value=true;
                    }
                  }
             }
          }
  return value;
  };
  





  $rootScope.replied=function(c){
    var value=false;
    if($localStorage.t_id){
                    if(c){
                      if(c.replies){
                        if($rootScope.my_casts){
                        if($rootScope.my_casts.length > 0){
                          var x=$rootScope.my_casts.findIndex(function(cast){
                            if(cast.reply){
                              return cast.reply._id==c._id;
                            }
                          });
                          if(x >= 0){
                            value=true;
                            }
                          }
                      }
                        }
                    }
                }
  return value;
  };
  


  
  
  
  $rootScope.subscribe=function(id){
    if($localStorage.t_id){
            if($rootScope.user.subscriptions.indexOf(id)>=0){
               $rootScope.user.subscriptions.splice($rootScope.user.subscriptions.indexOf(id),1);
               account.unsubscribe({
                user_id:id,
                t_id:$rootScope.user.t_id
              });
            }else{  
              $rootScope.user.subscriptions.push(id);
              account.subscribe({
                user_id:id,
                t_id:$rootScope.user.t_id
              });
            }
          }
  };
  
  




$rootScope.save_cast=function(cast){
  $rootScope.show();
  var uploadUrl = Config.API + "cast/save";
  cast.t_id=$rootScope.t_id;
  cast.caster=$rootScope.user._id;
  cast.file=$rootScope.file;
  cast.date_created=new Date();
  if($rootScope.post.music_file){
    cast.music_file=$rootScope.post.music_file;
  }
    cast.mentions=$rootScope.mentions;
    cast.mentions=[];
    if($rootScope.mentions.length > 0){
        for(var i=0; i < $rootScope.mentions.length;i++){
          cast.mentions.push($rootScope.mentions[i]._id);
        }
    }
    cast.mentions=JSON.stringify(cast.mentions);
    cast.filter=JSON.stringify(cast.filter);
    Upload.upload({
      url: uploadUrl,
      data: cast
    }).then(function(resp) {
      $rootScope.hide(); 
        var msg=resp.data.message;
        $ionicPopup.alert({template: msg});
        if(!$localStorage.saved_casts){
          $localStorage.saved_casts=[];
        }
        if(resp.data.status==true){
          $localStorage.saved_casts.push(cast);
          $timeout(function(){
            $rootScope.record_box.hide();
            $rootScope.recast_box.hide();
            $rootScope.reply_box.hide();
            $state.go("front.library");
            $rootScope.pause_cast();
            $rootScope.clear();
            $rootScope.get_library();
          },3000);
        };
    });
    
};










$rootScope.upload_cast=function(c){
  $rootScope.pause_cast();
  $ionicPopup.show({
    template: 'Do you want to upload '+(c.title ? '`'+c.title+'` cast?':'cast?'),
    title: 'Upload Cast',
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
                  $rootScope.broadcasting(); 
                  cast.upload(c._id).success(function(Data){
                    $rootScope.hide();
                    console.log("upload saved callback:");
                    console.log(Data);
                    $ionicPopup.alert({template:Data.message});
                    if(Data.status==true){
                        $timeout(function(){
                          $rootScope.clear();
                          $rootScope.record_box.hide();
                          $rootScope.recast_box.hide();
                          $rootScope.reply_box.hide();
                          $rootScope.get_talk();
                          $rootScope.refresh_profile();
                          $rootScope.trash_cast($localStorage.saved_casts.indexOf(c));
                        },2000);
                      }
                    }).error(function(){
                        $rootScope.hide();
                        $ionicPopup.alert({
                          template: "network error."
                        });
                      });   
            }
          }]
        });
};















$rootScope.trash_cast=function(index){
  $rootScope.show();
  if(index >= 0){
      URL.revokeObjectURL($localStorage.saved_casts[index].cast);
      URL.revokeObjectURL($localStorage.saved_casts[index].music);
      $timeout(function(){
      $rootScope.hide();
      $localStorage.saved_casts.splice(index,1);
      $rootScope.get_library();
      },2000);   
    }
}











    
  $rootScope.open_aircast=function(){
    $rootScope.aircast_box.show();
    if(!$rootScope.settings.dark_mode){
      if($rootScope.text_color=='light'){
        StatusBar.styleLightContent();
      }else {
        StatusBar.styleDefault();
      }
    }else{
      StatusBar.styleLightContent();
    }
    }

    



    
  $rootScope.drop_aircast=function(){
    $rootScope.pause_cast();
    $rootScope.aircast_box.hide();
    $rootScope.current_cast=null; 
    $rootScope.playlist=null;
    }



    

 
    $rootScope.close_aircast=function(){
      $rootScope.aircast_box.hide();
      $rootScope.change_bar();
      }



      $rootScope.pause_cast=function(){
        var casts=$rootScope.timeline || $rootScope.suggested_casts  || $rootScope.profile.casts || $rootScope.cast.replies || $rootScope.my_casts  || $rootScope.saved_casts;
        if(casts){
        for(var i=0;i < casts.length;i++){
          if(casts[i].casting){
            casts[i].casting=false;
            break;
          }
        }
      }
      if($rootScope.cast){
            $rootScope.cast.casting=false;
      }
      if($rootScope.post){
        $rootScope.post.casting=false;
        if($rootScope.post.cast){
            $rootScope.post.cast.casting=false;
        }
      }
      if($rootScope.current_cast){
            $rootScope.current_cast.casting=false;
      }
        if(this.cast){
          this.cast.casting=false;
        }else
        if(this.cast.recast){
        this.cast.recast.casting=false;
      }
        if(this.post){
          if(this.post.cast){
          this.post.cast.casting=false;
        }
      }
      if ($rootScope.TopMusic) {
      $rootScope.TopMusic.updateIsPlaying(false);
      }
      $rootScope.pause_audio();
      $rootScope.pause_audio();
    }



    
    $rootScope.clear=function(){
          console.log("clearing...");
          $rootScope.pause_audio();
          $timeout(function(){
            $rootScope.file=null;
            $rootScope.file=null;
            $rootScope.messaging=false;
            $rootScope.post.file=null;
            $rootScope.post.music_file=null;
          },1000);
          $rootScope.messaging=false;
          $rootScope.file=null;
          $rootScope.file_added=false;
          $rootScope.mentions=[];
    }
         
            
    


$rootScope.count_down=function(){
  if($rootScope.recording){
  $rootScope.timer=$rootScope.timer-1;
    $timeout(function(){
      $rootScope.count_down();
    },1000);
}
}



$rootScope.share_cast = function (c) {
  var m=c.title ? c.title:"JustTalk:";
  var s="Listen to cast by "+c.caster.user_name+" on JustTalk";
  var l="https://justtalkapp.com/cast/"+c._id;
  $cordovaSocialSharing.share(m,s,null,l);
};



$rootScope.share_profile = function (user) {
  var n=user.user_name;
  var s="subscribe to this channel to join the conversation";
  var l="https://justtalkapp.com/profile/"+user.t_id;
  $cordovaSocialSharing.share(n,s,Config.media+user.photo,l);
};






$rootScope.remove_cast=function(c){
  $ionicPopup.show({
    template: 'Are you sure you want to remove this cast from your timeline completely?',
    title: 'Remove Cast',
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
    _id:c._id,
    t_id:$rootScope.user.t_id
  }
    $rootScope.show();
  cast.remove(data).success(function(Data){
    $rootScope.hide();
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
}] 
});
};









$rootScope.report_cast=function(c){
  $ionicPopup.show({
    template: 'Are you sure you want to report this cast?',
    title: 'Report Cast',
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
    _id:c._id,
    t_id:$rootScope.user.t_id
  }
    $rootScope.show();
  cast.report(data).success(function(Data){
    $rootScope.hide();
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
}] 
});
};




  $rootScope.next_cast=function(){
    console.log("next cast....");
    $rootScope.pause_cast();
    $timeout(function(){
    $rootScope.track=$rootScope.track+1; 
    $rootScope.current_cast={};
    if($rootScope.playlist[$rootScope.track]){
    if($rootScope.track <= ($rootScope.playlist.length-1)){
        $rootScope.play_cast($rootScope.playlist[$rootScope.track]);
          }
}
},2000);
      }






 $rootScope.profile_more = function(profile) {
   var block_button={ text: 'Block @'+profile.user_name };
    if($rootScope.is_blocked(profile)){
      block_button={ text: 'Unblock @'+profile.user_name };
    }
  var buttons=[{ text: ' Share Profile' },block_button];
 var menu={
  buttons: buttons,
  titleText: 'Profile options',
  cancelText: 'Cancel',
  cancel: function() {
  },
  buttonClicked: function(index) {

    if(index === 0) {
      $rootScope.share_profile(profile);
     }

     if(index === 1) {
      if($rootScope.is_blocked(profile)){
        $rootScope.unblock_user(profile);
      }else{
        $rootScope.block_user(profile);
      }
     }
     if(index === 2) {
      $rootScope.message_user(profile);
     }
     return true;
  }
}
if($rootScope.subscribed(profile)){
  var blocks=[];
  if(profile.block_list){
    blocks=profile.block_list;
  }
if((!$rootScope.is_blocked(profile) && blocks.indexOf($rootScope.t_id)==-1)){
  buttons.push({ text: 'Send a message' });
}
}
  $ionicActionSheet.show(menu);
};






  
  
  
      $rootScope.previous_cast=function(){
        console.log("previous cast....");
        var color_pick=Math.floor(Math.random()*(8-1)+1)+1;
        $rootScope.color_pick=color_pick.toString();
        $rootScope.pause_cast();
        $timeout(function(){
        $rootScope.current_cast={};
        $rootScope.track=$rootScope.track-1;
        if($rootScope.playlist[$rootScope.track]){
        if($rootScope.track >= 0){
          $rootScope.play_cast($rootScope.playlist[$rootScope.track]);
          }
  }
  },1000);
          }
  
  
  



$rootScope.player_countdown=function(c){
  c.duration=c.duration-1;
    $timeout(function(){
          if(c.duration > 0){
            $rootScope.player_countdown(c);
          }
    },1000);
}





$rootScope.track_position=function(position) {
  if($rootScope.current_cast.casting){
        $rootScope.pause_cast();
      } 
    if(position){
      $rootScope.current_cast.timeLeft=$rootScope.current_cast.duration - parseInt(position);  
        }
  }



  $rootScope.track_position2=function(position) {
    if($rootScope.playing_message){
          $rootScope.pause_message();
      if(position){
        $rootScope.playing_message.timeLeft=$rootScope.playing_message.duration - parseInt(position);  
          }
        }else{
          $rootScope.pause_cast();
      if(position){
        $rootScope.post.timeLeft=$rootScope.post.duration - parseInt(position);  
          }
        } 
    }
  
    



  $rootScope.get_replies=function(id){
    $rootScope.fetching_replies=true;
    $timeout(function(){
    cast.replies(id).success(function(Data){
      $rootScope.fetching_replies=false;
        if(Data.status==true){
          $rootScope.cast_replies=Data.data; 
          if($rootScope.cast_replies.length > 0){ 
              $rootScope.playlist=$rootScope.cast_replies;
            }
          $rootScope.fetching_replies=false;
        }
      });
    },2000);
  }
  
  

$rootScope.currentTime=function(cast) {
    var pitch=1;
    cast.duration=parseInt(cast.duration);
    cast.timeLeft=parseInt(cast.timeLeft);
    if(cast.filter){
      if(cast.filter.pitch){
          pitch=cast.filter.pitch;
      }
    }
    $timeout(function(){
      if($rootScope.source){  
                var timeLeft=cast.duration - cast.timeLeft;
                if(timeLeft < cast.duration){  
                  cast.timeLeft=cast.timeLeft - 1;
                  cast.bar = timeLeft;
                  console.log("bar:");
                  console.log(cast.bar); 
                if(cast.casting && $rootScope.source.started){
                      $rootScope.currentTime(cast);
                    }
                  }
              }else{
                console.log("no source!");
              }
      },1000/pitch);
}







$rootScope.cast_listen=function(c){
  var data={
    t_id:$rootScope.t_id,
    cast_id:c._id
  }
  if(c.listens){
    if($rootScope.user){
    var inx=c.listens.findIndex(function(cl){
        return cl.t_id==$rootScope.user.t_id;
     })
     if(inx < 0){
       c.listens.push($rootScope.user);
       cast.listen(data).success(function(){});
     }
    }
  }
}











$rootScope.unheard_messages=function(c){
  var total=0;
  if(c){
    if($rootScope.user){
      if(c.conversations){
      for(var i=0;i < c.conversations.length;i++){
        var convo=c.conversations[i];
        if(!convo.expired){
          if(convo.user._id!=$rootScope.user._id){
        var m=-1;
        if(convo.listens){
          m=convo.listens.findIndex(function(l){
            return l==$rootScope.user._id;
          });
        }
            if(m <=-1){
              total=total+1;
            }
          }
        }
      }
    }
  }
  }
  return total;
}





$rootScope.unheard=function(){
  var total=0;
  if($rootScope.user){
    if($rootScope.chats){
        for(var j=0;j < $rootScope.chats.length;j++){
          var c=$rootScope.chats[j];
          if($rootScope.unheard_messages(c) > 0){
            total=total+1;
          }
    }
  }
}
  return total;
}



$rootScope.build_playlist=function(cast){
            if(!$rootScope.playlist || $rootScope.playlist.length < 1){
                $rootScope.playlist=$rootScope.timeline;
                $rootScope.track=0;
            }else{
                $rootScope.track=$rootScope.playlist.findIndex(function(c){
                  return c._id==cast._id;
                })
                if($rootScope.track >= -1){
                  if($rootScope.playlist[$rootScope.track]){
                    $rootScope.playlist[$rootScope.track].casting=true;
                    $rootScope.up_next=$rootScope.playlist[$rootScope.track + 1];
                  }
                }else{
                  $rootScope.track=0;
                }
            }
}















$rootScope.top_player=function(cast) {
  $rootScope.TopMusic=window.MusicControls || MusicControls;
  if ($rootScope.TopMusic) {
  $rootScope.TopMusic.create({
    track : cast.title,
    artist : cast.caster.user_name,
    cover : $rootScope.media+cast.caster.photo,
    album: 'JustTalk',
    isPlaying : true,
    dismissable : false,
    duration : cast.duration,
    hasSkipForward : true, 
    hasSkipBackward : true,
    ticker	  : cast.caster.user_name,
    playIcon: 'media_play',
    pauseIcon: 'media_pause',
    prevIcon: 'media_prev',
    nextIcon: 'media_next',
    closeIcon: 'media_close',
    notificationIcon: 'icon',
	  elapsed : 0, // optional, default: 0
  	skipForwardInterval : 0, //optional. default: 0.
    skipBackwardInterval : 0, //optional. default: 0.
    hasScrubbing : false //optional. default to false. Enable scrubbing from control center progress bar 
  });
  $rootScope.TopMusic.subscribe(function(action) {
    const message = JSON.parse(action).message;
    switch(message) {
      case 'music-controls-next':
        $rootScope.next_cast();
        break;
      case 'music-controls-previous':
        $rootScope.previous_cast();
        break;
      case 'music-controls-pause':
        $rootScope.pause_cast();
        break;
      case 'music-controls-play':
        $rootScope.play_cast($rootScope.current_cast);
        break;
      case 'music-controls-destroy':
        $rootScope.pause_cast();
        break;
      case 'music-controls-seek-to':
        const seekToInSeconds = JSON.parse(action).position;
        $rootScope.TopMusic.updateElapsed({
          elapsed: seekToInSeconds,
          isPlaying: true
        });
        $rootScope.track_position(seekToInSeconds);
        break;
      default:
        break;
    }
  });
  $rootScope.TopMusic.listen();
  $rootScope.TopMusic.updateIsPlaying(true); 
  $rootScope.TopMusic.updateElapsed({
    elapsed:$rootScope.current_cast.duration - $rootScope.current_cast.currentTime,
    isPlaying: true
  });
}
}
 








$rootScope.audio_frequency=function(audio){
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var source = audioCtx.createMediaElementSource(audio);
  $rootScope.analyser = audioCtx.createAnalyser();
  source.connect($rootScope.analyser);
  $rootScope.analyser.connect(audioCtx.destination);
  $rootScope.Audiofrq = new Uint8Array($rootScope.analyser.frequencyBinCount);
  $rootScope.analyser.getByteFrequencyData($rootScope.Audiofrq);
  console.log("Audio frq:");
  console.log($rootScope.Audiofrq);
}



$rootScope.random_color=function(){
  $rootScope.color="#"+Math.floor((Math.random() * 16777215) + 1).toString(16);
  return $rootScope.color;
}



function get_color(image,callback){
  if(image){
const img = new Image();
img.crossOrigin = '*';
img.src = image;
img.onload = function() {
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  var data = ctx.getImageData(0, 0, img.width, img.height);
  var pixels = data.data;
  var r = 0, g = 0, b = 0, a = 0;
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    r += pixels[i];
    g += pixels[i + 1];
    b += pixels[i + 2];
    a += pixels[i + 3];
  }
  r = Math.floor(r / (img.width * img.height));
  g = Math.floor(g / (img.width * img.height));
  b = Math.floor(b / (img.width * img.height));
  a = Math.floor(a / (img.width * img.height));
  var hsp = Math.sqrt(0.299 * (r * r) +0.587 * (g * g) +0.114 * (b * b));
    if (hsp>127.5) {
      $rootScope.text_color='dark';
    } 
    else {
      $rootScope.text_color='light';
    }
  callback('#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
}
  }else{
    callback(null);
  }
}

      $rootScope.play_casts=function(cs){
        $rootScope.playlist=cs.sort(function(a,b){ 
          if (a.date_created < b.date_created) {
            return 1;
        }
        if (a.date_created > b.date_created) {
            return -1;
        }
        return 0;
         });
        $rootScope.play_cast($rootScope.playlist[0]);
      }

  
      $rootScope.play_cast=function(c){
        if(!c.casting && c){
          console.log("play!");
          if($rootScope.current_cast){
            if($rootScope.current_cast.casting){
              $rootScope.pause_cast();
            }
          }
        get_color($rootScope.media+c.caster.photo,function(color){
          $rootScope.color=color;
          $rootScope.current_cast=null;
        $timeout(function(){
        var r=this;
        if(r.cast){
        r.cast.casting=true;
        r.cast.played=true;
          if(r.cast.recast){
            r.cast.recast.casting=true;
            r.cast.recast.played=true; 
          }
      }else
        if(r.post){
          r.post.cast.casting=true;
          r.post.cast.played=true;
        }
        c.casting=true;
        if(c.recast){
          $rootScope.current_cast=c.recast;
        }else{
          $rootScope.current_cast=c;
        }
        $rootScope.current_cast.casting=true;
        if(!$rootScope.current_cast.timeLeft){
          $rootScope.current_cast.timeLeft=$rootScope.current_cast.duration;
        }
        if($rootScope.current_cast.cast){
            var src=Config.media+$rootScope.current_cast.cast;
            $rootScope.cast_listen($rootScope.current_cast);
            $rootScope.build_playlist($rootScope.current_cast);
            $rootScope.play_audio(src);
            $rootScope.top_player($rootScope.current_cast);
        }
            });
          });
        }else{
          console.log("paused!");
        $rootScope.pause_cast();
        }
          };

        
  
          $rootScope.test_cast=function(post){
            $rootScope.post=post;
            if(!post.casting){
              $rootScope.post.casting=true;
              var file=URL.createObjectURL($rootScope.post.file);
              $rootScope.play_audio(file);
            }else{
              $rootScope.pause_cast();  
            }
              }


              $rootScope.replay_cast=function(post){
                console.log(post);
                if(!post.casting){
                  $rootScope.post=post;
                  $rootScope.post.casting=true;
                  if(!$rootScope.post.timeLeft){
                    $rootScope.post.timeLeft=$rootScope.post.duration;
                  }
                  $rootScope.play_audio(Config.media+$rootScope.post.cast);
                }else{
                  $rootScope.pause_cast();  
                }
                  }
    

              $rootScope.select_music=function(file){
                      $rootScope.pause_cast();  
                      if($rootScope.post){
                        $rootScope.post.music=URL.createObjectURL(file);
                      }
                  }
    




              $rootScope.clear_music=function(){
                    $rootScope.pause_cast();  
                      $rootScope.post.music=null;
                      $rootScope.post.music_file=null;
              }
        







      $rootScope.play_directcast=function(c){
        $rootScope.play_cast(c);
        $rootScope.aircast_box.show();
          };

        
  
    
$rootScope.fetch_profile=function(id) {
  $rootScope.fetching_casts=true;
  $rootScope.profile_casts=null;
  $timeout(function(){
  account.info(id).success(function(Data){
    if(Data.status==true){
     $rootScope.profile=Data.data; 
     get_color($rootScope.media+$rootScope.profile.photo_header,function(color){
      $rootScope.profile_color=color;
      });
  $timeout(function(){
      account.casts(id).success(function(Data){
        $rootScope.fetching_casts=false;
        if(Data.status==true){
          if($rootScope.profile){
          $rootScope.profile_casts=Data.data;
          }
        }
        if(!$rootScope.settings.dark_mode){
          if($rootScope.text_color=='light'){
            StatusBar.styleLightContent();
          }else {
            StatusBar.styleDefault();
          }
        }else{
          StatusBar.styleLightContent();
        }
      }); 
    },1000); 
          
        }  
});
},1000); 
          
}













$rootScope.refresh_cast=function(id){
  $rootScope.casts_loader=true;
  $timeout(function(){
  cast.info(id).success(function(Data){
    $rootScope.casts_loader=false;
    $rootScope.hide();
      if(Data.status==true){
        $rootScope.cast=Data.data; 
        $rootScope.get_replies($rootScope.cast._id);
      }
  }).error(function(){
    $rootScope.hide();
    $rootScope.casts_loader=false;
  });
},1000);
};









  

  $rootScope.trustlink=function (link) {
    return $sce.trustAsResourceUrl(link);
  };










$rootScope.timediff = function(start){
  var u=start;
  return moment(u).fromNow();
};




  
  



  if($localStorage.t_id){
    $rootScope.t_id=$localStorage.t_id;
  account.info($localStorage.t_id).success(function(Data){
    $rootScope.hide();
      if(Data.status==true){
        $rootScope.user=Data.data; 
      }else{
        console.log("could not conenct");
      }
  }).error(function(){
    console.log("could not conenct");
    $rootScope.hide();
  });
    }

  

$rootScope.get_notifications=function(){
  if($rootScope.t_id){
    $timeout(function(){
  account.notifications($rootScope.t_id).success(function(Data){
    $rootScope.hide();
      if(Data.status==true){
        $rootScope.notifications=Data.data;
      }
    });
  },1000);
  }
}



$rootScope.listen_to=function(casts){
  var boys=[];
  if(casts){
    casts.map(function(cast){
        if(boys.indexOf(cast.caster) <=-1){
          boys.push(cast.caster);
        }
    });
  }
  console.log("listen to:");
  console.log(boys);
  return boys;
}


$rootScope.discovery=function(){
  $rootScope.casts_loading=true;
  cast.trending().success(function(Data){
    if(Data.status==true){
        $rootScope.trending_topics=Data.data;
        $rootScope.top_boys=$rootScope.listen_to($rootScope.trending_topics);
    }
});
account.suggestion().success(function(Data){
    if(Data.status==true){
        $rootScope.suggested_users=Data.data;    
    }
});
cast.suggestion().success(function(Data){
    if(Data.status==true){
        $rootScope.suggested_casts=Data.data;    
        $rootScope.casts_loading=false;
    }
    $rootScope.hide();
});
}


if($localStorage.chats){
  $rootScope.chats=$localStorage.chats; 
}


$rootScope.get_messages=function(){
  if($rootScope.t_id){
    $rootScope.fetching_msg=true;
  Chat.all($rootScope.t_id).success(function(Data){
    $rootScope.fetching_msg=false;
    $rootScope.hide();
    if(Data.status==true){
      $rootScope.chats=Data.data; 
      $localStorage.chats=Data.data; 
      $rootScope.fetching_msg=false;
    }
});

Chat.requests($rootScope.t_id).success(function(Data){
  if(Data.status==true){
      $rootScope.requests=Data.data;    
  }
});
}
  }



  $rootScope.chatter=function(chat){
    var p={};
    if(chat){
      if(chat.members){
    var m=chat.members.findIndex(function(member){
        if(member.user){
          return member.user.t_id!=$rootScope.t_id;
        }
    });
    if(m >= 0){
      p=chat.members[m].user;
    }
  }
  }
  return p;
    }
      





$rootScope.delete_cast=function(c){
  $ionicPopup.show({
    template: 'Are you sure you want to delete cast?',
    title: 'Delete Cast',
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
          cast.delete(c._id).success(function(Data){
            $rootScope.hide();
              $ionicPopup.alert({template:Data.message});
              if(Data.status==true){
                $rootScope.get_talk();
                $rootScope.refresh_profile();
               
              }
          }).error(function(){
              $rootScope.hide();
          });  
          if ($location.path() === "/edit_cast") {
            window.history.back();
             }
            $rootScope.trash_cast($localStorage.saved_casts.indexOf(c));  
      }
    }
    ]
    });
  };





  $rootScope.get_contacts=function(){
    $rootScope.contact_loader=true;
    account.contacts($rootScope.t_id).success(function(Data){
      $rootScope.contact_loader=false;
        if(Data.status==true){
            $rootScope.contact_list=Data.data;    
        }
    });
    }
      


    $rootScope.get_talk=function() {
      $timeout(function(){
        $rootScope.home_loader=true;
      if($rootScope.user){
    cast.timeline($rootScope.user.t_id).success(function(Data){
      $rootScope.home_loader=false;
      if(Data.status==true){
        $rootScope.timeline=Data.data;  
        $rootScope.home_loader=false;
        $rootScope.hide();
      }
    }).error(function(){
      $rootScope.home_loader=false;
      $rootScope.hide();
    });  
    }else{
    cast.suggestion().success(function(Data){
      $rootScope.home_loader=false;
      if(Data.status==true){
        $rootScope.timeline=Data.data;
        $rootScope.home_loader=false;
        $rootScope.hide();
      }
    }).error(function(){
      $rootScope.home_loader=false;
      $rootScope.hide();
    });  
    }
    },1000);
    }

 
 var date=new Date();
$rootScope.today=date;







$rootScope.load_more=function(pages) {
  var data={
    page:pages
  }
  $timeout(function(){
      if($rootScope.user){
            data.id=$rootScope.user.t_id;
            cast.more_timeline(data).success(function(Data){
              if(Data.status==true){
                $rootScope.timeline=Data.data;  
              }
            }); 
        }else{
            cast.more_suggestion(data).success(function(Data){
              if(Data.status==true){
                $rootScope.timeline=Data.data;
              }
            }); 
        }
        $rootScope.pages=$rootScope.pages + 1;
  },1000);
}

 

$rootScope.more_suggestions=function(pages) {
    $timeout(function(){
              cast.more_suggestion({
                page:pages
              }).success(function(Data){
                if(Data.status==true){
                  $rootScope.suggested_casts=Data.data;
                }
              }); 
          $rootScope.pages=$rootScope.pages + 1;
    },1000);  
}
 
   $ionicPlatform.registerBackButtonAction(function() {
     if ($location.path() === "/front/talk" || $location.path() === "/front/talk" ) {
       navigator.app.exitApp();
     }
     else {
       $ionicHistory.goBack();
     }
   }, 100);
 




   $ionicPlatform.ready(function() {
    console.log("Platform Ready!");
  

    $rootScope.get_library();

    socket.on('connect', function() {

      socket.on('message',function(data){
        $rootScope.get_messages();
        if($rootScope.chat){
          $rootScope.get_chat($rootScope.chat._id);
        }
      }); 
      
      socket.on('talk',function(data){
        $rootScope.get_talk();
        $rootScope.refresh_profile();
      });
      
      });
      
      
    $cordovaDeeplinks.route({
      '/cast/:id': {
        target: 'single_cast',
        parent: 'front.talk'
      },
      '/profile/:id': {
        target: 'profile',
        parent: 'front.talk'
      }
    }).subscribe(function(match) {
      $timeout(function() {
        $state.go(match.$route.parent);
        $timeout(function() {  
            $state.go(match.$route.target, {id: match.$args.id});
        }, 2000);
      }, 2000);
    }, function(nomatch) {
      console.warn('No match', nomatch);
    });



  document.body.addEventListener('click', $rootScope.unlock_media);
  document.body.addEventListener('touchstart',$rootScope.unlock_media);


    if(window.device){
     $rootScope.device=window.device || device;
    console.log($rootScope.device);
    } 


$rootScope.get_talk();
$rootScope.discovery();
$rootScope.get_messages();
$rootScope.get_notifications();


const FirebasePlugin = window.FirebasePlugin || this.firebasePlugin;
      
      FirebasePlugin.getToken(function(token) {
        console.log("...............justTalk signed fcm generated token:");
        console.log(token);
        $rootScope.pushtoken=token;
        $localStorage.pushtoken=token;
       if($rootScope.user){
        $rootScope.user.pushtoken=token;
        $rootScope.account_update($rootScope.user);
       }
      FirebasePlugin.setBadgeNumber(0);
      FirebasePlugin.grantPermission();
   });


   FirebasePlugin.requestPushPermission();
   FirebasePlugin.grantPermission(function(hasPermission){
    console.log("Permission was " + (hasPermission ? "granted" : "denied"));
    });

   FirebasePlugin.onTokenRefresh(function(token) {
    console.log("...............justtalk signed fcm generated token:");
    if(token){
      if($rootScope.user){
        $rootScope.pushtoken=token;
        $localStorage.pushtoken=$rootScope.pushtoken;
        $rootScope.user.pushtoken=$rootScope.pushtoken;
        $rootScope.account_update($rootScope.user);
          }
        }
    FirebasePlugin.setBadgeNumber(0);
});











      FirebasePlugin.onMessageReceived(function(data) {
        $rootScope.notify=true;
        $rootScope.get_notifications();
        $rootScope.get_talk();
        $rootScope.get_messages(); 
        if (data.tap || data.tapped || data.Tapped || data.Tap) {
            $timeout(function() {
                if(data.notifications){
                  $state.go("front.notification");
                }else
                if(data.cast){
                  $state.go("front.talk");
                }else
                if(data.chat || data.message){
                  $state.go("front.messages");
                }
            },4000);
        }

        FirebasePlugin.getBadgeNumber(function(n) {
          var badgeNumber=0;
          if(n){
          badgeNumber=n+1;
          }else{
          badgeNumber=1;
          }
          FirebasePlugin.setBadgeNumber(badgeNumber);
        }); 

      });




 
       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
       cordova.plugins.Keyboard.disableScroll(false);
//      window.WkWebView.allowsBackForwardNavigationGestures(true);
// window.WkWebView.allowsBackForwardNavigationGestures(false);

  if(Splashscreen){
        Splashscreen.hide();
  }


$rootScope.settings.dark_mode=cordova.plugins.ThemeDetection.isDarkModeEnabled().value;

       
  $rootScope.change_bar();


cordova.plugins.diagnostic.requestRemoteNotificationsAuthorization({
  successCallback: function(){
      console.log("Successfully requested remote notifications authorization");
  },
  errorCallback: function(err){
     console.error("Error requesting remote notifications authorization: " + err);
  },
  types: [
      cordova.plugins.diagnostic.remoteNotificationType.ALERT,
      cordova.plugins.diagnostic.remoteNotificationType.SOUND,
      cordova.plugins.diagnostic.remoteNotificationType.BADGE
  ],
  omitRegistration: false
});


cordova.plugins.diagnostic.isRemoteNotificationsEnabled(function(isEnabled){
    console.log("Push notifications are " + (isEnabled ? "enabled" : "disabled"));
}, function(error){
    console.error("An error occurred: "+error);
});

  cordova.plugins.diagnostic.requestMicrophoneAuthorization(function(status){
    if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
        console.log("Microphone use is authorized");
    }
 }, function(error){
     console.error(error);
 });
cordova.plugins.diagnostic.requestRuntimePermissions(function(statuses){
  for (var permission in statuses){
      switch(statuses[permission]){
          case cordova.plugins.diagnostic.permissionStatus.GRANTED:
              console.log("Permission granted to use "+permission);
              break;
          case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
              console.log("Permission to use "+permission+" has not been requested yet");
              break;
          case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
              console.log("Permission denied to use "+permission+" - ask again?");
              break;
          case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
              console.log("Permission permanently denied to use "+permission+" - guess we won't be using it then!");
              break;
      }
  }
}, function(error){
  console.error("The following error occurred: "+error);
},[cordova.plugins.diagnostic.permission.RECORD_AUDIO,
cordova.plugins.diagnostic.permission.NOTIFICATIONS,
 cordova.plugins.diagnostic.permission.READ_EXTERNAL_STORAGE,
 cordova.plugins.diagnostic.permission.WRITE_EXTERNAL_STORAGE]);
 cordova.plugins.diagnostic.requestRemoteNotificationsAuthorization({
  successCallback: function(){
      console.log("Successfully requested remote notifications authorization");
  },
  errorCallback: function(err){
    console.error("Error requesting remote notifications authorization: " + err);
  },
  types: [
      cordova.plugins.diagnostic.remoteNotificationType.ALERT,
      cordova.plugins.diagnostic.remoteNotificationType.SOUND,
      cordova.plugins.diagnostic.remoteNotificationType.BADGE
  ],
  omitRegistration: false
});



   });
 });
 