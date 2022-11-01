
app.directive('backButton', function(){

  return {

    restrict: 'A',



    link: function(scope, element, attrs) {

      element.bind('click', goBack);



      function goBack() {

        history.back();

        scope.$apply();

      }

    }

  }

});
app.directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
});



app.directive('disabletap', function($timeout) {
  return {
    link: function() {
      $timeout(function() {
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function(){
            document.getElementById('type-selector').blur();
        });

      },500);

    }
  };
});


app.directive('currencyInput',['$locale', '$filter', function($locale, $filter) {

  // For input validation
  var isValid = function(val) {
    return angular.isNumber(val) && !isNaN(val);
  };

  // Helper for creating RegExp's
  var toRegExp = function(val) {
    var escaped = val.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(escaped, 'g');
  };
val = val.replace(decimal, '').replace(group, '').replace(currency, '').trim();
  var toView = function(val) {
    return $filter('currency')(val);
  };
  var link = function($scope, $element, $attrs, $ngModel) {
    $ngModel.$formatters.push(toView);
    $ngModel.$parsers.push(toModel);
    $ngModel.$validators.currency = isValid;
    $element.on('keyup', function() {
      $ngModel.$viewValue = toView($ngModel.$modelValue);
      $ngModel.$render();
    });
  };

  return {
    restrict: 'A',
    require: 'ngModel',
    link: link
  };
}]);


  app.service('sideMenuService', function($ionicSideMenuDelegate) {
    return {
      openSideMenu: function(menuhandle)
      {
        console.log('open menu');
        return $ionicSideMenuDelegate.$getByHandle(menuhandle).toggleRight();
      }
    };
  });

  app.service('fileUploadService', function ($http, $q) {
 
    this.uploadFileToUrl = function (file, uploadUrl) {
        //FormData, object of key/value pair for form fields and values
        var fileFormData = new FormData();
        fileFormData.append('file', file);

        var deffered = $q.defer();
        $http.post(uploadUrl, fileFormData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}

        }).success(function (response) {
            deffered.resolve(response);

        }).error(function (response) {
            deffered.reject(response);
        });

        return deffered.promise;
    };
});


app.factory('Aud', function() {
  return window.webkitAudioContext || window.AudioContext || AudioContext;
  // return new (window.webkitAudioContext || window.AudioContext || AudioContext)();
});

app.factory('TopMusic', function() {
  return window.MusicControls || MusicControls;
});

  app.factory('Mic', function($rootScope,Aud,$ionicPopup,$timeout) {
    let mediaRec = null;
    let folder;
    var timer;
    function count_down(){
      if($rootScope.recording){
      $rootScope.timer=$rootScope.timer-1;
      if($rootScope.timer <=0){
        this.stop();
      }else{
          $timeout(function(){
            count_down();
          },1000);
      }
      }
    }





    function save_record(file){
      console.log("Saving file........");
      $timeout(function(){
        $rootScope.file_added=true;
        $rootScope.file = file;
        $rootScope.file.lastModifiedDate = new Date();
        $rootScope.file.name = "castaway-"+$rootScope.file.lastModifiedDate+".wav";   
        $rootScope.post.file=$rootScope.file;
        var reader = new FileReader();
        reader.onload = function (event) {
         var AudioMan= new Aud();
         AudioMan.decodeAudioData(event.target.result, function(buffer) {
                $rootScope.post.duration = buffer.duration;
                $rootScope.post.timeLeft=buffer.duration;
                console.log("The duration of the song is of: " + $rootScope.post.duration + " seconds");
            },function(e){
              console.error("Could not decode saved file: "+ e);
            });
        };
      reader.onerror = function (event) {
            console.error("An error ocurred reading the file: ", event);
        };

      reader.readAsArrayBuffer($rootScope.file);
          console.log($rootScope.post);  
      },1000);
     }


     
    return  {
    rec:function(secs){
            const chunks = [];
            $rootScope.recording=true;
            $rootScope.file_added=false;
            var stop=this.stop;
            if(secs){
              $rootScope.timer=secs;
            }else{
              $rootScope.timer=180;
            }

            console.log("microphone started with Wk!");
          


            var error=function(err) {
              $rootScope.recording=false;
                  $rootScope.file_added=false;
              $ionicPopup.alert({template:"Microphone failed to  connect"});
              console.log("error in mic connection");
              console.log(err);
              stop();
            };

            var success=function(stream) {
                console.log("Mic connected successfully........");
                  var options = {
                    mimeType : 'audio/wavc'
                  }
                  mediaRec = new MediaRecorder(stream);
                  mediaRec.ondataavailable = function(e){
                    chunks.push(e.data);
                    };
                  mediaRec.onstop = function(){        
                    let file = new Blob(chunks,{ 'type' : 'audio/wav' });
                    save_record(file);
                  }
                  mediaRec.onstart = function(){
                    console.log("microphone started!");
                    var secs=$rootScope.timer*1000;
                    timer=$timeout(function(){
                      stop();
                    },secs);
                  };
                  $rootScope.recording=true;
                  mediaRec.start(secs);
                  count_down();
            }
          
                  
            if(!navigator.mediaDevices){
              console.log("audioinput initialized");
              var captureCfg = {
                sampleRate: 16000,
                bufferSize: 8192,
                channels: 1,
                format: audioinput.FORMAT.PCM_16BIT,
                audioSourceType: audioinput.AUDIOSOURCE_TYPE.DEFAULT,
                fileUrl: cordova.file.dataDirectory
                };
                audioinput.initialize(captureCfg, function() {	
                    if (device.iOS == true) {
                                folder = cordova.file.tempDirectory;
                              }
                      if (device.android == true) {
                        folder = cordova.file.dataDirectory;
                      }
                    console.log("microphone started with audioinput!");
                    var captureCfg = { 
                        fileUrl : folder + "temp.wav"
                    }
                    console.log("cache Directory:");
                    console.log(folder);
                    audioinput.start(captureCfg);
                      var secs=$rootScope.timer*1000;
                      var isrecording=audioinput.isCapturing();
                      console.log("is recording:");
                      console.log(isrecording);
                      count_down();
                      timer=$timeout(function(){
                        stop();
                      },secs);
                    });
              }else{
                  console.log("Webkit initialized");
                  navigator.mediaDevices.getUserMedia({audio:true}).then(success).catch(error);
              }

      },

      stop:function(){
                console.log("stop................................");
                $rootScope.recording=false;
                $rootScope.messaging=false;
                $timeout.cancel(timer);
                if(mediaRec){
                  console.log("WK mediaRec stopping tracks..........");
                  if(mediaRec.state!="inactive"){
                    mediaRec.stop();
                  }
                  }else{ 
                    console.log("activating audioinput stop!");
                    audioinput.stop(function(url){
                      console.log("Rec session :"+url);
                      console.log(folder + "temp.wav");
                      window.resolveLocalFileSystemURL(folder + "temp.wav", function (tempFile) {
                          console.log("temp File:");
                          console.log(tempFile);
                          console.log(tempFile.name);
                          tempFile.file(function (tempWav) {
                          console.log("temp Wav:");
                          console.log(tempWav);
                          save_record(tempWav);	 
                          })
                          tempFile.remove(function (e) { 
                            console.log("temporary WAV deleted"); 
                          },  function (e) {
                            console.log("Couldn't remove temp file: " + e.message)
                          });		
                        }, function(e) {
                            $rootScope.file_added=false;
                            console.log("Could not resolveLocalFileSystemURL: " + e.message);
                          });
                    });
                  }
                  console.log("applying voice default filter......................");
                  $rootScope.post.filter=voice_filters[0];
              }
    }
    })