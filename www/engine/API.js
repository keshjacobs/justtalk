var live="https://api.justtalkapp.com/";
// var live="http://localhost:7000/";
var endpoint="user/";

var API=live+endpoint;
var media=live;
var latitude = 0; 
var longitude = 0;
var error_connection="Check your internet connection";
var connection_error=error_connection;

var voice_filters=[
{ 
  name:"normal",
  gain:1,
  type: "lowshelf",
  frequency:1500,
  detune:0,
  pitch:1
},{
  name:"chipmunk",
  gain:1,
  type: "lowshelf",
  frequency:1500,
  detune:0,
  pitch:1.3667013225
},{
  name:"Slow-mo",
  gain:1,
  type: "lowshelf",
  frequency:900,
  detune:0,
  pitch:0.7167013225
}
];

function getFormData(object) {
  const formData = new FormData();
  Object.keys(object).forEach(key => formData.append(key, object[key]));
  return formData;
};

function thousands_separators(num)
  {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }


app.factory('account',function($http){
  return  {
    auth: function(data){
        console.log("authentication:");
        console.log(data);
      return  $http.post(API + 'auth',data);
    },
    code: function(v){
      return  $http.post(API + 'verify_code',v);
    },
    search: function(p){
       return $http.get(API + "search/"+p);
     },
     search_mention: function(p){
        return $http.get(API + "mentions/search/"+p);
      },
    login: function(v){
      return  $http.post(API + 'login', v);
    },
    register: function(v){
      return  $http.post(API + 'register', v);
    },
    update: function(v){
      return  $http.post(API + 'update', v);
    },
    casts: function(v){
      return  $http.get(API + 'casts/'+v);
    },
    email_validation: function(v){
      return  $http.post(API + 'auth/email', v);
    },
    phone_validation: function(v){
      return  $http.post(API + 'auth/phone', v);
    },
    info: function(p){
      return $http.get(API + "info/"+p);
    },
    contacts: function(p){
      return $http.get(API + "contacts/"+p);
    },
    notifications: function(p){
      return $http.get(API + "notifications/"+p);
    },
    more_notifications: function(data){
      return $http.post(API + "notifications",data);
    },
    reset: function(data){
      return $http.get(API + "user_reset/"+data);
    },
    tutorials: function(){
      return $http.get(API + "tutorials");
    },
    new_password: function(data){
      return $http.post(API + "new_password",data);
    },
    change_password: function(data){
      return $http.post(API + "change_password",data);
    },
     resend_code:function(data){
      return $http.get(API +  "resend_code/"+data);
    },
    suggestion:function(){
      return $http.get(API +  "suggestion");
    },
    subscribe:function(data){
      return $http.post(API +  "subscribe",data);
    },
    subscribers:function(data){
      return $http.get(API +  "subscribers/"+data);
    },
    subscriptions:function(data){
      return $http.get(API +  "subscriptions/"+data);
    },
    unsubscribe:function(data){
      return $http.post(API +  "unsubscribe",data);
    },
    block:function(data){
      return $http.post(API +  "block",data);
    },
    unblock:function(data){
      return $http.post(API +  "unblock",data);
    },
    delete:function(data){
      return $http.delete(API +  "delete",data);
    }
  };
});





app.factory('Chat',function($http){
  return  {
    all: function(p){
       return $http.get(API + "chats/"+p);
     },
     info: function(p){
        return $http.get(API + "chat/"+p);
      },
      request: function(p){
         return $http.post(API + "chat/request/send",p);
       },
       requests: function(p){
        return $http.get(API + "requests/"+p);
        },
        title: function(p){
           return $http.post(API + "chat/title",p);
         },
         listen:function(data){
           return $http.post(API +  "chat/listen",data);
         },
         update: function(p){
            return $http.post(API + "chat/update",p);
          },
       delete: function(p){
          return $http.post(API + "message/delete",p);
        },
       send: function(p){
          return $http.post(API + "message/send",p);
        },
       accept: function(p){
          return $http.post(API + "chat/request/accept",p);
        },
        decline: function(p){
           return $http.post(API + "chat/request/decline",p);
         },
         leave: function(p){
            return $http.post(API + "chat/leave",p);
          }
    }
  });


app.factory('cast',function($http){
  return  {
    info: function(p){
       return $http.get(API + "cast/info/"+p);
     },
    recast: function(data){
      return $http.get(API + "cast/recast",data);
    },
    post: function(data){
      return $http.post(API + "cast/upload",data);
    },
    report: function(data){
      return $http.post(API + "cast/report",data);
    },
    reply: function(data){
      return $http.post(API + "cast/reply",data);
    },
    replies: function(data){
      return $http.get(API + "cast/replies/"+data);
    },
    delete: function(data){
      return $http.get(API + "cast/delete/"+data);
    },
    update: function(data){
      return $http.post(API + "cast/update",data);
    },
    like:function(data){
      return $http.post(API +  "cast/like",data);
    },
    listen:function(data){
      return $http.post(API +  "cast/listen",data);
    },
    unlike:function(data){
      return $http.post(API +  "cast/unlike",data);
    },
    update:function(data){
      return $http.post(API +  "cast/update",data);
    },
    timeline:function(data){
      return $http.get(API +  "cast/timeline/"+data);
    },
    suggestion:function(){
      return $http.get(API +  "cast/suggestion");
    },
    more_timeline:function(data){
      return $http.post(API +  "cast/timeline",data);
    },
    more_suggestion:function(data){
      return $http.post(API +  "cast/suggestion",data);
    },
    trending:function(){
      return $http.get(API +  "cast/trending");
    }
  };
})

