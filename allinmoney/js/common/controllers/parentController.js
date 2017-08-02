define(['controllers'], function(controllers){
	'use strict';
	controllers.controller('parentController',['$scope', 'commonService', function($scope, commonService){
		commonService.slideChangeDeliver($scope);
		commonService.categoryShowDeliver($scope);
	}]);
})