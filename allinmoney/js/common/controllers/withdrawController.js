define(['controllers','allbase','notifyWindow'],function (controllers, allinmoney, notifyWindow) {
	'use strict';
	controllers.controller('withdrawController', ['$rootScope','$scope', '$window', 'userService', '$routeParams', function($rootScope, $scope, $window, userService, $routeParams){
		$scope.showStep = function(step){
			var stepList = ["stepOne","stepTwo","stepThree","stepFour"];
			var currentStep = $routeParams.step;
			if(stepList[step-1] == currentStep){
				return true;
			}
			return false;
		}
		$scope.disableBtn = false;
		var getWithdrawInfoSuccessFn = function(balance, cardInfo){
			$scope.totalFunds = balance;
			$scope.totalFundsStr = allinmoney.regPayAmount(balance);
			$scope.accountName = cardInfo.accountName;
			$scope.cardTitle = String("{0}(尾号{1})").format(cardInfo.bankName, cardInfo.last4);
			$scope.vaildateTradeKey = vaildateTradeKey;//bind step 1 next
			$scope.gotoConfirm = gotoConfirm;//step 2

			if(allinmoney.action.withdrawAmount <= 0 || balance<=0){
				$scope.disableBtn = true;
				$scope.confirmWithdraw = function(){};
			}else{
				$scope.confirmWithdraw = confirmWithdraw;//step 3 next
				
			}
		};
		var getWithdrawInfoFailedFn = function(error_code){
			if(error_code == 2001 || error_code == 2002){
				var notify = new notifyWindow({
					title:'错误',
					message:["用户尚未绑定银行卡", "请绑定银行卡"],
					hideClose: true,
					buttonList:[
						{
							labelText:"确认",
							btnClass:"btn confirm-btn",
							clickFn: function(){
								$window.location.href='#/binding';
							}
						},
					]
				});
			}else if(error_code == 2010){
				//go to set trade key
				var notify = new notifyWindow({
					title:'交易提示',
					message:"您还没有设置交易密码, 无法购买",
					buttonList:[
						{
							labelText:"去设置",
							btnClass:"btn confirm-btn",
							clickFn:function () {
								$window.location.href="#/tradepw";
							},
						},
						{
							labelText:"取消",
							btnClass:"btn cancel-btn"
						},
					]
				});
			}else{
				var notify = new notifyWindow({
					title:'错误',
					message:["获取用户账号信息失败"],
					hideClose: true,
					buttonList:[
						{
							labelText:"返回",
							btnClass:"btn confirm-btn",
							clickFn: function(){
								$window.location.href='#/account';
							}
						},
					]
				});
			}
		};

		$scope.tradeCode = "";
		
		$scope.balanceStr = allinmoney.action.withdrawStr();

		$scope.checkTradeCode = function(){
			var re = /^[0-9]{6}$/;
			if(!re.test($scope.tradeCode)){
				$scope.tradeCodeInvalid = true;
			}else{
				//pass
				$scope.tradeCodeInvalid = false;
				return true;
			}
			return false;
		}
		var vaildateTradeKeySuccess = function(responseData){
			$scope.vaildateTradeKey = vaildateTradeKey;
			var error_code = responseData['error'];
			var message="";
			if(error_code == 0){
				//go to next step
				$window.location.href="#/withdraw/stepTwo";
			}else if(error_code == 2203){
				$scope.tradeCodeErrorMessage = String("支付密码错误,还有{0}次输入机会").format(3 - responseData['failAttempts']);
				$scope.tradeCodeFailed = true;
			}else if(error_code == 2204){
				$scope.tradeCodeErrorMessage = "密码错误多次,账号锁定";
				$scope.tradeCodeFailed = true;
			}else if(error_code == 2007){
				//pay failed
				var notify = new notifyWindow({
					title:'错误',
					message:["用户尚未绑定银行卡", "请绑定银行卡"],
					buttonList:[
						{
							labelText:"确认",
							btnClass:"btn cancel-btn"
						},
					]
				});
			}
		};
		var vaildateTradeKeyFailed = function(error_status){
			$scope.vaildateTradeKey = vaildateTradeKey;
		};
		var vaildateTradeKey = function(){
			$scope.vaildateTradeKey = "";
			$scope.checkTradeCode();//check code 
			if(!$scope.tradeCodeInvalid){
				userService.withdrawAuthorize($scope.tradeCode, vaildateTradeKeySuccess, vaildateTradeKeyFailed);
			}else{
				$scope.vaildateTradeKey = vaildateTradeKey;
			}
		}
		// $scope.vaildateTradeKey = vaildateTradeKey;

		$scope.checkBalance = function(){
			var re = /^\d+(\.\d{1,2})?$/;
			if(!re.test($scope.balance) || $scope.balance < 0.01){
				$scope.balanceInvalid = true;
				$scope.balanceInvalidMessage = "请正确输入金额,最小取现金额0.01元";
			}else if($scope.balance > $scope.totalFunds){
				$scope.balanceInvalid = true;
				$scope.balanceInvalidMessage = "余额不足";
			}else{
				$scope.balanceInvalid = false;
			}
		}
		var gotoConfirm = function(){
			$scope.checkBalance();
			if(!$scope.balanceInvalid){
				allinmoney.action.withdrawAmount = $scope.balance;
				$window.location.href = "#/withdraw/stepThree";
			}
		};
		$scope.backStepTwo = function(){
			$window.location.href = "#/withdraw/stepTwo";
		};
		var confirmWithdrawSuccessFn = function(responseData){
			notifyWindow.closeWindow();
			var error_code = responseData['error'];
			var message="";
			if(error_code == 0){
				//success
				$rootScope.withdrawDate = responseData.data['withdrawAt'].toString().replace("T", " ");
				$window.location.href = "#/withdraw/stepFour";
			}else if(error_code == 2018){
				//session超时 提示 并返回
				var notify = new notifyWindow({
					title:'错误',
					message:["操作超时", "请重新提现"],
					buttonList:[
						{
							labelText:"确认",
							btnClass:"btn cancel-btn",
							clickFn: function(){$window.location.href="#/account"}
						},
					]
				}); 
			}else if(error_code == 2022){
				//余额不足
				var notify = new notifyWindow({
					title:'错误',
					message:["余额不足", "请重新修改金额"],
					buttonList:[
						{
							labelText:"确认",
							btnClass:"btn cancel-btn"
						},
					]
				});
			}
			$scope.confirmWithdraw = confirmWithdraw;
		}
		var confirmWithdrawSuccessFailed = function(error_status){
			notifyWindow.closeWindow();
			$scope.confirmWithdraw = confirmWithdraw;
		}
		var confirmWithdraw = function(){
			$rootScope.withdrawDate = "";
			$scope.confirmWithdraw = function(){};
			var loading = new notifyWindow({
				loading: true,
			})
			if(allinmoney.action.withdrawAmount > 0){
				//confirm
				userService.withdrawConfirm(allinmoney.action.withdrawAmount, confirmWithdrawSuccessFn, confirmWithdrawSuccessFailed)
			}else{
				$scope.confirmWithdraw = confirmWithdraw;
			}
		}; 
		$scope.gotoAccount = function() {
			$rootScope.investmentPage = 5;
			$rootScope.accountTab = 1;
			$window.location.href="#/account"
		}
		userService.getWithdrawBalance(getWithdrawInfoSuccessFn, getWithdrawInfoFailedFn);
	}])
})