'use strict';
define(["angular", 
	'mainController',
	'notifyWindow', 
	'routes',
	'angularCookies', 
	'commonService', 
	'productService', 
	'transactionService', 
	'userService',
	'dropDownList',
	'pagination',
	'chartDirective',
    'bootstrap',
	'scrollTopDirect',
	], function(angular, controllers, notifyWindow){
	// also you can define controller1 insteadof mainController
	return angular.module('myApp', 
		[
		'webapp.controllers', 
		'ngCookies', 
		'webapp.routers',
		'webapp.services',
		'webapp.directives',
		'web.interceptor',
         'ui.bootstrap'
		])
	.run(['$rootScope', function($rootScope){
			$rootScope.$on("$routeChangeStart", function(evt, current, previous){
				notifyWindow.closeWindow();
			});
			$rootScope.$on("$routeChangeSuccess", function(evt, current, previous){
				if(allinmoney.slideTimer){
					var len = allinmoney.slideTimer.length;
					for(var i=len-1; i>=0; i--){
						var timer = allinmoney.slideTimer[i];
						clearInterval(timer);
						allinmoney.slideTimer.pop(i);
					}
				};
				var prevLoacation = previous? previous.loadedTemplateUrl:"";
				var prevParams = previous? previous.params:null;
				var currentLocation = current? current.loadedTemplateUrl:"";
				var currentParams=current? current.params:null;
				allinmoney.action.routeChange(prevLoacation,prevParams,currentLocation,currentParams);
			})
		}]) ;
	
});