define(['controllers'], function(controllers){
	'use strict';
	controllers.controller('homePageController',['$rootScope','$scope', 'commonService', function($rootScope, $scope, commonService){
		commonService.slideChangeListen($scope);
		$rootScope.rootIndex = 0;
		var slides = [
			{imgUrl:'img/advertisement_pic_001.png'},
			{imgUrl:'img/advertisement_pic_002.png'},
		];
		var slide_config = {
				slide_container:{
					className:'slide-container',
				},
				btn_container:{
					className:'slide-btn-container',
				},
				btn_notactive:{
					className:'notactive-btn',
					text:'■',
				},
				float_btn_left: {
					className:'float-btn float-left-btn hidden'
				},
				float_btn_right: {
					className:'float-btn float-right-btn hidden'
				},
				slide_width: 1200,
				slide_height: 300,
			};
		commonService.slideChangeTrigger($scope, slides, slide_config);
		commonService.categoryShowTrigger($scope, {isHomePage: true});
	}]);
})