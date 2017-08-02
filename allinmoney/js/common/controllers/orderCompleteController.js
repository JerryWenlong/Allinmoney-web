define(['controllers','allbase'], function(controllers, allinmoney){
	'use strict';
	controllers.controller('orderCompleteController',[
		'$scope',
		'commonService',
		'userService',
		function($scope, commonService, userService){
			// commonService.categoryShowTrigger($scope, {isHomePage: false});
			$scope.orderProductName = allinmoney.action.orderProductName;
		}
	])
})