<<<<<<< HEAD
app.config(function($stateProvider, $urlRouterProvider,Config,$ionicConfigProvider,$httpProvider) {
    $ionicConfigProvider.views.forwardCache(true);

    
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common = 'Content-Type: multipart/form-data';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common['Authorization'] ="Bearer " +Config.google_token;
  
      $ionicConfigProvider.tabs.position('bottom');
      $ionicConfigProvider.navBar.alignTitle('center');

=======
app.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {
    $ionicConfigProvider.views.forwardCache(true);
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
      $ionicConfigProvider.tabs.position('bottom');
      $ionicConfigProvider.navBar.alignTitle('center');
>>>>>>> aa6679ad5354b5c97b78dff680b6c1392a39540d
      $stateProvider
      .state('splash', {
        url: '/splash',
        cache: true,
        templateUrl: 'pages/splash.html',
        controller:"splash"
      })
  
      .state('account', {
        url: '/account',
        templateUrl: 'pages/account.html',
        controller:"Auth"
      })
  
      .state('auth', {
        url: '/auth',
        templateUrl: 'pages/auth.html',
        controller:"Auth"
      })
  
  
      .state('code', {
        url: '/code',
        templateUrl: 'pages/code.html',
        controller:"Auth"
      })
  
  
      .state('register', {
        url: '/register',
        templateUrl: 'pages/register.html',
        controller:"Auth"
      })
  
  
  
      .state('password', {
        url: '/password',
        templateUrl: 'pages/password.html',
        controller:"Auth"
      })
  
      .state('contacts', {
        url: '/contacts',
        templateUrl: 'pages/contacts.html',
        controller:"profile"
      })
  
      .state('add_contact', {
        url: '/add_contact',
        templateUrl: 'pages/add_contact.html',
        controller:"profile"
      })



      .state('welcome', {
        url: '/welcome',
        templateUrl: 'pages/welcome.html',
        controller:"profile"
      })


      .state('subscription', {
        url: '/subscription/:user_id',
        templateUrl: 'pages/subscription.html',
        controller:"Subs"
      })


      .state('subscribers', {
        url: '/subscribers/:user_id',
        templateUrl: 'pages/subscribers.html',
        controller:"Subs"
      })
      

  
      .state('suggestions', {
        url: '/suggestions',
        templateUrl: 'pages/suggestions.html',
        controller:"Explore"
      })
      
  
      .state('set_photo', {
        url: '/set_photo',
        templateUrl: 'pages/set_photo.html',
        controller:"profile"
      })
      
<<<<<<< HEAD
      
  
      .state('search', {
        url: '/search',
        templateUrl: 'pages/search.html',
        controller:"Explore"
      })
      
      
      
=======
>>>>>>> aa6679ad5354b5c97b78dff680b6c1392a39540d
  
      .state('about', {
        url: '/about',
        templateUrl: 'pages/about.html',
        controller:"profile"
      })
      
  
      .state('reset', {
        url: '/reset',
        templateUrl: 'pages/reset.html',
        controller:'Auth'
      })
     
  
      .state('reset_code', {
        url: '/reset_code',
        templateUrl: 'pages/reset_code.html',
        controller:'Auth'
      })
     
       
  
        .state('thankyou', {
          url: '/thankyou',
          templateUrl: 'pages/thankyou.html'
        })
  

        .state('resetdone', {
          url: '/resetdone',
          templateUrl: 'pages/resetdone.html'
        })
  
       




        .state('front', {
          url: '/front',
          abstract:true,
          templateUrl: 'pages/front.html'
        })

        
        .state('front.talk', {
          url: '/talk',
          cache: true,
          views: {
            'front-talk': {
              templateUrl: 'pages/front/talk.html',
              controller:'Cast'
            }
          }
        })



        .state('change_photo', {
          url: '/change_photo',
          templateUrl: 'pages/change_photo.html',
          controller:"profile"
        })
        



        .state('security', {
          url: '/security',
          templateUrl: 'pages/security.html',
          controller:"profile"
        })
    

  


        .state('change_password', {
          url: '/change_password',
          templateUrl: 'pages/change_password.html',
          controller:"profile"
        })




        .state('settings', {
          url: '/settings',
              templateUrl: 'pages/settings.html',
              controller:"profile"
        })
        
        
  
  
        .state('changepassword', {
          url: '/cpassword',
          templateUrl: 'pages/cpassword.html',
          controller:"profile"
        })

  
        .state('edit_profile', {
          url: '/edit_profile',
          templateUrl: 'pages/edit_profile.html',
          controller:"profile"
        })
  
  


        .state('front.find', {
          url: '/find',
          cache: true,
          views: {
            'front-find': {
              templateUrl: 'pages/front/find.html',
              controller:'Explore'
            }
          }
        })
  

  
        .state('front.notification', {
          url: '/notification',
          cache: true,
          views: {
            'front-notification': {
              templateUrl: 'pages/front/notification.html',
              controller:"profile"
            }
          }
        })
        .state('front.library', {
          url: '/library',
          cache: true,
          views: {
            'front-library': {
              templateUrl: 'pages/front/library.html',
              controller:"Cast"
            }
          }
        })
  
  
  
        .state('chat', {
              url: '/chat',
              templateUrl: 'pages/chat.html',
              controller:"Messages"
        })



  
        .state('chat_info', {
          url: '/chat_info',
          templateUrl: 'pages/chat_info.html',
          controller:"Messages"
    })


  
    .state('requests', {
      url: '/requests',
      templateUrl: 'pages/requests.html',
      controller:"Messages"
})


.state('start', {
  url: '/start',
  templateUrl: 'pages/start.html'
})

  
.state('request', {
  url: '/request',
  templateUrl: 'pages/request.html',
  controller:"Messages"
})




.state('confirm_request', {
  url: '/confirm_request',
  templateUrl: 'pages/confirm_request.html',
  controller:"Messages"
})



        .state('front.messages', {
          url: '/messages',
          cache: true,
          views: {
            'front-messages': {
              templateUrl: 'pages/front/messages.html',
              controller:"Messages"
            }
          }
        })
  
  
.state('front.make_request', {
  url: '/make_request',
  views: {
    'front-messages': {
  templateUrl: 'pages/make_request.html',
  controller:"Messages"
    }
  }
})



  
.state('cast', {
  url: '/cast',
  templateUrl: 'pages/cast.html',
  controller:"Cast"
})


  
.state('edit_cast', {
  url: '/edit_cast',
  templateUrl: 'pages/edit_cast.html',
  controller:"Cast"
})




.state('aprofile', {
  url: '/aprofile/:id',
  templateUrl: 'pages/profile.html',
  controller:"profile"
})




.state('my_profile', {
  url: '/my_profile',
      templateUrl: 'pages/front/profile.html',
      controller:"profile"
})




        
        
  
      $urlRouterProvider.otherwise('/splash');
  
    });