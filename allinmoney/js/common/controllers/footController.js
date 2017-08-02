define(['controllers'], function(controllers){
	'use strict';
	controllers.controller('footController', ['$scope', function($scope){
		$scope.documentList = [
			{title: "关于我们", src:"#/aboutus#top"},
			{title: "银行理财", src:"#/"},
			{title: "信托产品", src:"#/"},
			{title: "资管计划", src:"#/"},
			{title: "联系我们", src:"#/"},
			{title: "免责申明", src:"#/"},
		]
	}])
});