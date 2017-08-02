define(['angular'], function(angular){
	'use strict';
	return angular.module('webapp.routers',['ngRoute'])
	.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {		
	  $routeProvider
	  .when('/',{
	  	templateUrl: 'pages/home.html',
	  	controller: 'homePageController'
	  })
	  .when('/finacial/:finacial_type',{
	  	templateUrl: 'pages/finacialProduct.html',
	  	controller: "finacialPageController"
	  })
      .when('/binding',{
          templateUrl: 'pages/bindingCard.html',
          controller: "bindingCardController"
      })
      .when('/account',{
          templateUrl: 'pages/userCenter.html',
          controller: "userCenterController"
      })
      .when('/orderdetail/:id',{
              templateUrl: 'pages/orderDetail.html',
              controller: "userCenterController"
      })
	  .when('/withdrawdetail/:tradeSerialNo',{
              templateUrl: 'pages/withdrawDetail.html',
              controller: "userCenterController"
      })
	  .when('/payconfirm/:orderId',{
	  	templateUrl: 'pages/payConfirm.html',
	  	controller: "payConfirmController",
	  })
	  .when('/product/:_id',{
	  	templateUrl: 'pages/productDetail.html',
	  	controller: "productPageController"
	  })
	  .when('/orderComplete',{
	  	templateUrl:'pages/orderComplete.html',
	  	controller:"orderCompleteController"
	  })
	  .when('/withdraw/:step', {
	  	templateUrl:'pages/withdraw.html',
	  	controller:"withdrawController"
	  })
	  .when('/tradepw',{
	  	templateUrl:'pages/tradepw.html',
	  	controller:"tradepwController"
	  })
	  .when('/aboutus',{
	  	templateUrl:'pages/aboutus.html',
	  	controller:"aboutusController"
	  })
	  .when('/novice',{
	  	templateUrl:'pages/novice.html',
	  	controller:"aboutusController"
	  })
	  .otherwise({
	  	redirectTo:'/'
	  });
	}])
});

