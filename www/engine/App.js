var app=angular.module('justtalk', ['ionic','ionic.native','lazy-scroll', 'ngCordova', 'ngStorage','ngFileUpload','ionic-segment'])
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }).factory('socket', function($rootScope) {
    var socket = io(live, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity
        }, function() {
            console.log('connected');
        } );
    return {
        on: function(eventName, callback) {
            socket.once(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
})
// .config(['lazyImgConfigProvider', function(lazyImgConfigProvider){
//     var scrollable = document.querySelector('#scrollable');
//     lazyImgConfigProvider.setOptions({
//       offset: 100, // how early you want to load image (default = 100)
//       errorClass: 'error', // in case of loading image failure what class should be added (default = null)
//       successClass: 'success', // in case of loading image success what class should be added (default = null)
//       onError: function(image){}, // function fired on loading error
//       onSuccess: function(image){}, // function fired on loading success
//       container: angular.element(scrollable) // if scrollable container is not $window then provide it here
//     });
//   }]);