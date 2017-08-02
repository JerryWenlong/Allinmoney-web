define(['angular','user','notifyWindow'], function(angular, user, notifyWindow){
	'use strict';
	var webInterceptorModule = angular.module('web.interceptor',[]);
	webInterceptorModule.factory('webInterceptor', ['$q', '$window',function($q, $window){
		return {
			request: function(config){
				//test
				return config || $q.when(config);
			},
			requestError: function(rejection){
				return rejection;
			},
			response:function(response){
				return response || $q.when(response);
			},
			responseError: function(response){
				if(response.status === 401){
					user.logout();//clear user login
					var deferred = $q.defer();
                    var notify = new notifyWindow({
                        title:'超时',
                        message:["用户长时间没操作,请重新登录"],
                        buttonList:[
                            {
                                labelText:"确认",
                                btnClass:"btn confirm-btn",
                                clickFn: function(){
                                    $window.location.href='/login.html';
                                }
                            },
                        ],
                        hideClose:true
                    });
	                return deferred.promise;
				}else{
					return $q.reject(response);
				}
			}
		}
	}]);
	webInterceptorModule.config(['$httpProvider', function($httpProvider){
		 $httpProvider.interceptors.push('webInterceptor');
	}])
	return webInterceptorModule;
});