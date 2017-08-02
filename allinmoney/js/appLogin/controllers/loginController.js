define(['controllers', 'config'], function (controllers, config) {
	// body...
	controllers.controller('loginController', [
		'$scope', 
		'$timeout',
		'loginService',
		'$location',
		'$cookies',
		'$window', 
		function ($scope,$timeout, loginService, $location, $cookies, $window) {
			// body...
            var tElement;
            var timeOutT=0;
			$scope.loginname_info = {
				errorinfo:{
					required: "用户名不能空",
					minlength: "用户名不能小于4字符",
					maxlength:  "用户名不能大于30字符"
				}
			};
			$scope.password_info = {
				errorinfo:{
					required: "密码不能空",
					minlength: "密码不能小于4字符",
					maxlength:  "密码不能大于16字符"

				}
			};
            $scope.captcha_info = {
                errorinfo:{
                    required: "验证码不能空",
                    minlength: "验证码必须4字符",
                    maxlength:  "验证码必须4字符"

                }
            };
			//check user & auto login
			var remembered_user = $cookies.getObject('user');
			var remembered_login = $cookies.getObject('login');

			$scope.login = {
				loginname:'',
				password:'',
                passwordf:'',
                captcha:'',
                "cellphone": '',
                "smsCode": '',
                errormessage:'',
                acceptTos:'',
                token:'',
                url:'',
				smsdisable:false
			};
			$scope.remember = {
				user: false,
				login: false
			}
            var checkphoneOKCallback= function(){
                tElement  =document.getElementById('send_code');
                timeOutSms = setInterval(smsInterval, 1000);
            }
            $scope.getOtp = function(checkphoneOKCallback ) {
                if($scope.login.errormessage=='此号码已存在，请重新输入' || $scope.login.errormessage=='请填写正确的手机号')
                {
                    $scope.login.errormessage='';
                }
                if($scope.login.cellphone&&$scope.login.cellphone.length==11)
                {
                    loginService.checkFeild("cellphone",$scope.login.cellphone).then(function(response) {
                        if (response.data['data'] == 1) {
                            checkphoneOKCallback();
                            loginService.getQuickSignUpOtp($scope.login.cellphone).then(function (response) {
                            if (response.data['error'] == 0) {

                            }
                            }, function (resp) {
                                //带有错误信息的resp
                                $scope.login.errormessage = "当前网络不稳定，系统正在努力加载中。 ";
                            })
                        }
                        else {
                            $scope.login.errormessage = "此号码已存在，请重新输入";
                        }

                    });
                    return false;
                }
                else
                {
                    $scope.login.errormessage="请填写正确的手机号";
                    return false;
                }

            }
            var smsInterval=function(){

                //      $scope.registercheck.smsTimeOut="发送动态码（"+ (60-timeOutT)+")";
                tElement.innerHTML = "发送动态码("+ (60-timeOutT)+")";
                if(timeOutT==60)
                {
                    clearTimeout(timeOutSms);
                    timeOutT=0;
                    tElement.innerHTML = "发送动态码("+ (60-timeOutT)+")";
                    tElement=null;
                }
                timeOutT++;
            }
            $scope.smstimerout = function()
            {
				$scope.login.smsdisable=true;
				$timeout(function(){	
						$scope.login.smsdisable=false;
						$scope.login.errormessage="";
				},61000)
					
                if(tElement)
                {
                    return;
                }
                $scope.getOtp(checkphoneOKCallback);

            }
			if(remembered_login && remembered_user){
				$scope.login.loginname = remembered_login.loginname;
				$scope.login.password = remembered_login.password;
				$scope.remember.user = true;
				$scope.remember.login = true;
			}
            $scope.quickloginToServer = function(code ,pass ,phone){
                        if(code)
                        {
                           $scope.login.errormessage='动态码6位';
                            return;
                        }
                        if(pass)
                        {
                          $scope.login.errormessage='密码格式错误，格式为字符，数字，符号组合不小于8位';
                            return;
                        }
                        if(phone)
                        {
                           $scope.login.errormessage='手机号11位数字';
                            return;
                        }

                    if($scope.login.passwordf&&$scope.login.cellphone&&$scope.login.smsCode&&$scope.login.acceptTos){

                        loginService.quicklogin($scope.login.cellphone,$scope.login.passwordf,$scope.login.smsCode,1).then(function(response){
                                if(response.loginStatus == 'success'){
                                    $window.location.href = response.redrict_to;
                                }
                                else if(response.loginStatus != 'success'){
                                    $scope.login.errormessage=response.errorMsg;
                                    $scope.getcaptchatoken();
                                }
                            });
                    }else{
                        $scope.login.errormessage="所有空行需要填写";
                        $scope.getcaptchatoken();
                    }


            }
            var loginSuccessCallback= function(redrict_to){
                $window.location.href = redrict_to;
            }
            var loginErrorCallback=function(errorMsg){
                $scope.login.errormessage=errorMsg;
                $scope.login.captcha='';
                $scope.getcaptchatoken();
            }
			$scope.loginToServer = function(nameformate,passformate,captchaformate){
                if(nameformate||passformate)
                {
                    $scope.login.errormessage="用户名须为字母，数字，4到30位，密码须为8到16位，包含数字和字母";
                    return;
                }
                if(captchaformate)
                {
                    $scope.login.errormessage="图形验证码4位";
                    return;
                }
				
                loginService.checkCaptcha($scope.login.captcha,$scope.login.token).then(function(response){
                    if(response.data['error'] == 0){
                        loginService.login($scope.login.loginname, $scope.login.password,$scope.remember.user,$scope.remember.login,$scope.login.captcha,$scope.login.token, loginSuccessCallback, loginErrorCallback);
                    }else{
                        $scope.login.errormessage="图片验证码错误，请重新输入";
                        $scope.login.captcha='';
                        $scope.getcaptchatoken();
                    }
                },function(resp){
                    //带有错误信息的resp
                    $scope.login.errormessage="当前网络不稳定，系统正在努力加载中。 ";
                    $scope.login.captcha='';
                    $scope.getcaptchatoken();
                });

			}
            $scope.CheckCaptcha = function(){
                loginService.checkCaptcha($scope.login.aptcha,$scope.login.token).then(function(response){
                        if(response.success == 'true'){

                        }else{

                        }
                    });
            }
            $scope.getcaptchatoken=function(){
                loginService.getcaptchaRequest().then(function(response){
                 if( response.status=='200')
                 {
                     $scope.login.token=response.data.data['token'];
                     $scope.login.url=response.data.data['url'];
                     $scope.getCaptcha();
                 }
               else
                 {
                     $scope.login.errormessage="当前网络不稳定，系统正在努力加载中。 ";
                  }
                });
            }

            $scope.firstgetCaptcha=function()
            {
                $scope. clickimg=true;

                $scope.getcaptchatoken();
            }
            $scope.getCaptcha = function(){
                var verify=document.getElementById('img_check');
                verify.setAttribute('src',config.user_service.host+':'+config.user_service.port+$scope.login.url);


            }
            $scope.clicklogin = function(){
                $scope.show_login=true;
                var login=document.getElementById('login');
                login.style.borderBottomColor="#fa9600";
                login.style.color="#666666";

                var flogin=document.getElementById('fast_login');


                flogin.style.borderBottomColor="#f0f0b5";
                flogin.style.color="#999999";
                $scope.login.errormessage="";
            }
            $scope.clickfastlogin = function(){
                $scope.show_login=false;
                var login=document.getElementById('login');
                login.style.borderBottomColor="#f0f0b5";
                login.style.color="#999999";

                var flogin=document.getElementById('fast_login');
                flogin.style.borderBottomColor="#fa9600";
                flogin.style.color="#666666";
                $scope.login.errormessage="";
            }



        }]);
})