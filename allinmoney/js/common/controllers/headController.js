define(['controllers', 'user', 'encrypt','notifyWindow'], function(controllers, User, encrypt, notifyWindow){
	'use strict';
	controllers.controller('headController',['$rootScope', '$scope', '$window', '$cookies','userService', function($rootScope, $scope, $window, $cookies, userService){
		var userInfo = User.getUserInfo();
		$scope.isActive = userInfo.has_login? true:false;
		$scope.tool = {
			part1:{title:'我的资产'},
			part2:{title:'理财师入口'},
			part3:{title:'服务中心'},
			part4:{title:'热线'},
			part5:{title:'400 800 800'}
		}
		$scope.partHover = false;
		$scope.assetHover = function(){
			$scope.partHover = true;
		};
		$scope.assetOut = function(){
			$scope.partHover = false;
		};
		$scope.user = {
				part1: {
					title: "您好！请登录",
					click: function(){
						//go to login page.
						$window.location.href='login.html';
					}
				},
				part2: {
					title: "免费注册",
					click: function(){
						//TODO
						$window.location.href='regieter.html';
					}
				}
			}
		if(userInfo.has_login){
			$scope.user = {
				part1: {
					title: "欢迎 " + userInfo.user_name,
					click: function(){
						//TODO.
						
					}
				},
				part2: {
					title: "退出",
					click: function(){
						userService.signout().then(function(){
							//
							console.log('logout success')
						},function(){
							//
							console.log('logout error')
						});
						//clear user
						User.logout();
						$window.location.href='login.html';
					}
				}
			}
		};

		//navigate
		$scope.navList=[
			{name: "首页", href:"./index.html#/"},
			{name: "银行理财", href:"./index.html#/finacial/bank", hot:"true"},
			{name: "信托产品", href:"./index.html#/finacial/trust"},
			{name: "资管计划", href:"./index.html#/finacial/assets"},
			{name: "理财师", href:"./index.html#/"},
			{name: "活动专区", href:"./index.html#/"},
			{name: "理财学堂", href:"./index.html#/"}
		];
		$scope.isHot = function(item){
			if(item.hot){
				return true;
			}else{
				return false;
			}
		}
		
		$rootScope.rootIndex = -1;
		
		$scope.navhover=function(index){
			$rootScope.rootIndex=index;
		}
	   	
		$scope.myAssets = [{index:0, label:"我的资产"}, {index:1, label:"我的消息"}, {index:2, label:"我的收益"}, {index:3, label:"我的交易"}];
		$scope.searchOption = "0"; // index of datalist
		$scope.showOptions = false;

		$scope.gotoAccount=function(accountTab){
			if(userInfo.has_login){
				$rootScope.accountTab = accountTab;
				$window.location.href = "#/account";
			}else{
				var notify = new notifyWindow({
                    title:'提示',
                    message:["请先登录账号"],
                    buttonList:[
                        {
                            labelText:"确认",
                            btnClass:"btn confirm-btn",
                            clickFn: function(){
                                $window.location.href='/login.html';
                            }
                        },
                        {
                        	labelText:"取消",
                        	btnClass:"btn cancel-btn",
                        }
                    ]
                });
			}
			
		};
	}]);
	
})