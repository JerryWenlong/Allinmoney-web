define(['controllers'], function(controllers, chart){
	'use strict';
	controllers.controller('tradepwController',[
		'$scope',
		'commonService',
		'$timeout',
		'$window',
		'userService',
		function($scope, commonService,$timeout,$window,userService){
				var timeOutSms;
            	var timeOutT=0;
            	var tElement;
			 $scope.tradepw={
                "step":0,
				"bankCard":"",
				'confirmPword':'',
				'confirmPword2':'',
				'errormessage':'',
				'ched':false,
			}
			
			var smsInterval=function(){
                tElement.innerHTML = "重新发送("+ (60-timeOutT)+")";
                if(timeOutT==60)
                {
                    clearTimeout(timeOutSms);
                    timeOutT=0;
                    tElement.innerHTML = "发送动态码("+ (60-timeOutT)+")";
				    tElement=null;		
                }
                timeOutT++;
            }

			$scope.smstimerout = function(name)
            {
					$scope.tradepw.ched=true;
				    $timeout(function(){	
						$scope.tradepw.ched=false;
						$scope.tradepw.errormessage="";
					},61000)
				
				userService.accotp("passwordInit").then(function(response){
					if(response.data['error']==2019){
						 $scope.tradepw.errormessage="发送失败";
					}else{
						 $scope.tradepw.errormessage="";		
					}
				},function(response){	
					 $scope.tradepw.errormessage="未登录或发送频率超过限制";
				});
				
                if(tElement)
                {
                    return;
                }
                if(name=='backpass')
                {
                    
                    tElement  =document.getElementById('ptimeout_f');
                    timeOutSms = setInterval(smsInterval, 1000)
	
                }
                else
                {
                    if( $scope.getOtp())
                    {
                        timeOutSms = setInterval(smsInterval, 1000);
                    }
                }
            }
			$scope.showPage = function(index,pagename) {
                 if(index==$scope.show_p)
                 {
						var pname=pagename+'_page'+index;
                        var iname=pagename+'_indexPage'+index; 
                     if(index>0)
                     {
                        pname=pagename+'_page'+(index-1);                        
						iname=pagename+'_indexPage'+(index-1);
                     }
                     return true;
                 }
                else
                 {
                     return false;
                 }
            }
			
			userService.userbankno().then(function(response){
				$scope.tradepw.usercard=response.data['bankName']+response.data['last4']
			},function(){			
			})
			
			$scope.tradepWord=function(){
				userService.resetTradepswd($scope.tradepw.confirmPword,$scope.tradepw.confirmPword2,$scope.tradepw.bankCard,$scope.tradepw.smsCode).then(function(response){
					if(response.data['error']==0){
						if (typeof(allinmoney.action.setTradeKeyBack) == 'function'){
				           allinmoney.action.setTradeKeyBack();
				        }else{
				           $window.location.href='index.html';
				        }
					}else if(response.data['error']==2001){
						$scope.tradepw.errormessage="该用户尚未开户";
						$window.location.href='login.html';
					}else if(response.data['error']==2007){
						$scope.tradepw.errormessage="手机动态码不正确，请重新输入";
					}else if(response.data['error']==2009){
						$scope.tradepw.errormessage="银行卡有误，请重新输入";
					}else if(response.data['error']==2008){
						$scope.tradepw.errormessage="该用户已设定支付密码";
					}
				},function(response){
						
				});
			}
				
		}
	])
})