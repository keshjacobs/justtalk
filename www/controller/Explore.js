app.controller('Explore', function($scope,$rootScope,account,cast) {
    $rootScope.query=null;






    $rootScope.explore=function(){
    cast.trending().success(function(Data){
                if(Data.status==true){
                    $scope.trending_topics=Data.data;    
                }
            account.suggestion().success(function(Data){
                if(Data.status==true){
                    $scope.suggested_users=Data.data;    
                }
                cast.suggestion().success(function(Data){
                    if(Data.status==true){
                        $scope.suggested_casts=Data.data;    
                    }
                });
            });
        });
    }




    });
    