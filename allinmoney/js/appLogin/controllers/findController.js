/**
 * Created by chenwei on 2015/11/23.
 */
 
define(['controllers', 'config'], function (controllers, config) {
    controllers.controller('findController', [
        '$scope',
		'$timeout',
        'loginService',
        '$location',
        '$cookies',
        '$window',
		'$http',
        function ($scope,$timeout, loginService, $location, $cookies, $window,$http) {
            var timeOutSms;
            var timeOutT=0;
            var tElement;
            $scope.register={
                "username": "",
                "password":"",
                "cellphone": '',
                "smsCode": '',
                "captcha": "",
                "email": "n1@sohu.com",
                "confirmPassword":"",
                "acceptTos":true,
                "errormessage":'',
                "phonemessage":'',
                "usernamemessage":'',
                "token":'',
                "url":''
            }
            $scope.fd={
                "username": "",
                "password":"",
                "cellphone": '',
                "smsCode": '',
                "captcha": "",
                "maskcellphone": '',
                "confirmPassword":"",
                "errormessage":'',
                "step":0,
                "temptoken":'',
                "token":'',
                "url":'',	
				"usercard":'',
				"opass":"",
				"confirmPword":"",
				"trues":false,
				"isoldpassword":false
            }
            $scope.registercheck={
                "usernamecheck": false,
                "cellphonecheck": false,
				"otpcheck":false
            }	
			$scope.identif=function(a){
				var retest=/^(^[1]{15}$)|(^[1]{18}$)$/
				if(retest.test(a)){
					return true
				}else{
					return false	
				}
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
			$scope.smstimerout = function(name){
				$scope.fd.trues=true;
				$timeout(function(){	
					$scope.fd.trues=false;
					$scope.fd.errormessage="";
				},61000)
				
				loginService.restPasswordOtp("passwordReset").then(function(response){
					if(response.data['error']==2019){
						$scope.fd.errormessage="发送失败";
					}else{
						$scope.fd.errormessage="";
						$scope.registercheck.otpcheck=true;	
					}
				},function(){
					$scope.fd.errormessage="未登录或发送频率超过限制";
				});
				
                if(tElement){
                    return;
                }
                if(name=='backpass'){ 
                    tElement  =document.getElementById('ptimeout_f');
                    timeOutSms = setInterval(smsInterval, 1000);					
                }
            }
			$scope.confirmPass=function(){
				if($scope.fd.confirmPword==$scope.fd.confirmPassword2){
					return true
					}else{	
					return false			
					}
			}
			$scope.resetPass=function(){
				if($scope.fd.resetPword==$scope.fd.resetPword2){
					return true
					}else{					
					return false				
					}
			}				
			$scope.fdrequestuser=function(){
		 		loginService.findpword($scope.fd.opass).then(function(response){				
				if(response.data['error'] == 0){
					$scope.fd.step=1;
					$scope.show_p=1;
					$scope.fd.errormessage="";
					$scope.showPage(1,'f');	
				}else if(response.data['error'] == 2014){
					$scope.fd.errormessage="密码错误";
				}else if(response.data['error'] == 2015){
					$scope.fd.errormessage="密码错误多次，账号锁定";
				}		
			},function(response){	
					$scope.fd.errormessage="重新登录";
			})	
		}	
		
		$scope.isOldPd=function(bl,val){
			
			 if(bl||val==''||!val)
			 {
				  return;
			 }
			loginService.findpword(val).then(function(response){
				if(response.data['error'] == 0){
					$scope.fd.isoldpassword=true;
				}else {
					$scope.fd.isoldpassword=false;
				}
			},function(){})
		}
		
		$scope.fiNewWord=function(){		
			loginService.setnewpword($scope.fd.confirmPword,$scope.fd.confirmPassword2)
				.then(function(response){
					if(response.data['error'] == 0){
						$scope.fd.step=2;
						$scope.show_p=2;
						$scope.showPage($scope.fd.step,'f');
					}else if(response.data['error'] == 2018){
						$scope.fd.errormessage="重置密码超时";	
						$window.location.href='findPassWord.html';	
					}	
				},function(response){
					$scope.fd.errormessage="验证失败";
	 			});				
			}
			$scope.bkNewWord=function(){			
				loginService.resetpword($scope.fd.resetPword,$scope.fd.resetPword2).then(function(response){
					if(response.data['error']==0){
						$scope.fd.step=2;
						$scope.show_p=2;
						$scope.showPage($scope.fd.step,'f');
					}else if(response.data['error'] == 2018){
						$scope.fd.errormessage="重置密码超时";	
						$window.location.href='backPassWord.html';	
					}
				},function(response){						
				});
			}
			
			
     		loginService.verification().then(function(response){	
				$scope.fd.cellphone=response.data.data['cellphone'];
				$scope.fd.usercard=response.data.data['bankName']+'尾号'+response.data['data']['last4'];
			},function(response){
				$scope.fd.cellphone='未登录';
				$scope.fd.usercard='未登录';
			})
			$scope.backpwordnext=function(){
				loginService.postvcation($scope.fd.bkcard,$scope.fd.identif,$scope.fd.smsCode).then(function(response){	
					if(response.data['error']==0){
						$scope.fd.step=1;
						$scope.show_p=1;
						$scope.fd.errormessage="";
						$scope.showPage(1,'f');	
					}else if(response.data['error']==2017){
						$scope.fd.errormessage="身份验证错误，请重新输入";	
					}else if(response.data['error']==2007){
						$scope.fd.errormessage="手机验证码失效或错误，请重新输入";	
					}else if(response.data['error']==2016){
						$scope.fd.errormessage="银行卡校验失败，请重新输入";	
					}	
				},function(response){	
				})		
			}
            $scope.showPage = function(index,pagename ) {
                 if(index==$scope.show_p)
                 {
                        var pname=pagename+'_page'+index;
                        var iname=pagename+'_indexPage'+index;
                        var  p  =document.getElementById(pname);
                        var  i  =document.getElementById(iname);
                        p.style.backgroundColor="#fa9600";
                        i.style.color="#fa9600";
                     if(index>0)
                     {
                        pname=pagename+'_page'+(index-1);
                        iname=pagename+'_indexPage'+(index-1);
                        p  =document.getElementById(pname);
                        i  =document.getElementById(iname);
                        p.style.backgroundColor="#CCCCCC";
                        i.style.color="#CCCCCC";
                     }
                     return true;
                 }
                else
                 {
                     return false;
                 }
            }
            $scope.loginpage = function( ) {	
                $window.location.href='index.html';
            }   
        }]);

})
