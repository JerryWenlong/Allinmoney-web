define(['services', 'user', 'config', 'encrypt'], function (services, User, config, encrypt) {
	// body...
	services.factory('loginService', ['$http', function($http){
        var getUserSalt = function(username){
			var username = username || User.getUserInfo().user_name;
            var str = "{0}:{1}/{2}/{3}";
            var saltUrl = str.format(config.user_service.host, config.user_service.port, config.user_service.user_salt, username)
            return $http({
                method:'GET',
                url:saltUrl,
                headers:{
                    'Content-Type': 'application/json'
                },
                withCredentials: true

            })
        }
		var getUser = function(username, password, aptcha, token, salt) {
            var str = "{0}:{1}/{2}";
            var login_url = str.format(config.user_service.host, config.user_service.port, config.user_service.user_login);
            var encrypt_password = encrypt.generateMD5Sync(password, salt, aptcha);
            return $http({
                method: 'POST',
                url: login_url,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                data: {"userName": username, "password": encrypt_password, "captcha": aptcha,"captchaToken":token}

            });
        }
        var getUserQuick = function(cellphone, password,smsCode,acceptTos) {
            var str = "{0}:{1}/{2}";
            var login_url = str.format(config.user_service.host, config.user_service.port, config.user_service.user_quick);
            var encrypt_password = encrypt.cryptPasswordSync(password)[0];
            return $http({
                method: 'POST',
                url: login_url,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                data: {"cellphone": cellphone, "password": encrypt_password, "smsCode": smsCode, 'acceptTos': acceptTos}

            });
        }

        var registerUser = function(username,password,cellphone,smsCode,captcha,email,confirmPassword,acceptTos,token){
            var str =  "{0}:{1}/{2}";
            var url = str.format(config.user_service.host, config.user_service.port, config.user_service.user_register);
            // var test_url = "http://192.168.1.22:8080/user/signup";
            var encrypt_result= encrypt.cryptPasswordSync(password);
            var encryptPassword =  encrypt_result[0];
            var salt = encrypt_result[1];
            var encryptConfirmPassword = encrypt.cryptPasswordSync(confirmPassword, salt)[0];
            return $http({
                method: 'POST',
                url: url,
                headers:{
                    'Content-Type': 'application/json'
                },
                withCredentials:true,
                data:{
                    "userName":username,
                    "password":encryptPassword, 
                    "cellphone":cellphone,
                    "smsCode":smsCode,
                    "captcha":captcha,
                    "confirmPassword":encryptConfirmPassword,
                    "acceptTos":acceptTos,
                    'captchaToken':token}

            });
        }
		return {
            getcaptchaRequest:function(){
                var str =  "{0}:{1}/{2}";
                var url = str.format(config.user_service.host, config.user_service.port, config.user_service.user_captcha_get_token);
                return $http({
                    method: 'GET',
                    url: url,
                    headers:{

                        'Content-Type': 'application/json'
                    },
                    withCredentials:true

                });
            },
            getotpforget:function(token){
                var str =  "{0}:{1}/{2}";
                var url = str.format(config.user_service.host, config.user_service.port, config.user_service.user_requestoptforget);
                return $http({
                    method: 'POST',
                    url: url,
                    headers:{

                        'Content-Type': 'application/json'
                    },
                    withCredentials:true,
                    data:{
                        "resetToken":token
                    }
                });
            },
            register:function(username,password,cellphone,smsCode,captcha,email,confirmPassword,acceptTos,token){
                return registerUser(username,password,cellphone,smsCode,captcha,email,confirmPassword,acceptTos,token).then(function(response){
                        var token=response.data.data['accessToken'];
                        var error=response.data['error'];
                        if(token!=null){
                            var current_user = new User({
                                userName:response.data.data['userName'],
                                userRole:response.data.data['roleIds'],
                                phoneNum: response.data.data['cellphone'],
                                token: response.data.data['accessToken']
                            });
                            current_user.storeUserTemp();
                            return   {Status:'success'};
                        }
                        else if(error!=null){
                            switch (error)
                            {
                                case 1:
                                    error='图片验证码失效，请重新输入';
                                    break;
                                case 2:
                                    error='图片验证码错误，请重新输入';
                                    break;
                                case 3:
                                    error='手机验证码错误或者失效，请重新输入';
                                    break;
                                case 4:
                                    error='用户名已存在，请重新输入';
                                    break;
                                case 5:
                                    error=' 手机号已存在，请重新输入';
                                    break;
                                default:
                                    error='信息有误，请重新输入';
                                    break;
                            }
                            return {Status:'failed', errorMsg: error};
                        }
                    },function(resp){
                        //带有错误信息的resp
                        if(resp.status == '400'){
                            return {Status:'failed', errorMsg: '信息有误，请重新输入'};
                        }
                    else
                        {
                            return {Status:'failed', errorMsg: '当前网络不稳定，系统正在努力加载中。 '};
                        }

                    })
            },
            getCaptcha:function(){
                var str =  "{0}:{1}/{2}";
                var url = str.format(config.user_service.host, config.user_service.port, config.user_service.user_captcha_get);
                return $http({
                    method: 'GET',
                    url: url,
                    headers:{

                        'Content-Type': 'application/json'
                    }

                });
            },
            getSignUpOtp:function(phone){
                var str =  "{0}/{1}";
                var url = str.format(config.user_service.host, config.user_service.user_signup_otp);
                url+='?cellphone'+"="+phone;

                return $http({
                    method: 'GET',
                    url: url,

                    headers:{
                        'Content-Type': 'application/json'
                    },
                    withCredentials:true

                });
            },
            getQuickSignUpOtp:function(phone){
                var str =  "{0}/{1}";
                var url = str.format(config.user_service.host, config.user_service.user_quick_signup_otp);
                url+='?cellphone'+'='+phone;

                return $http({
                    method: 'GET',
                    url: url,

                    headers:{
                        'Content-Type': 'application/json'
                    },
                    withCredentials:true

                });
            },
            checkFeild:function(name ,value){
                var str =  "{0}/{1}";
                var url = str.format(config.user_service.host, config.user_service.user_validate);
                url+="?" + name+"="+value;

                return $http({
                    method: 'GET',
                    url: url,

                    headers:{
                        'Content-Type': 'application/json'
                    }
                });

                /*     return  $http.get(url, {withCredentials: true});*/
            },
            checkCaptcha:function(Captcha,token) {
                var str = "{0}:{1}/{2}";
                var url = str.format(config.user_service.host, config.user_service.port, config.user_service.user_captcha);
                url += "?value=" + Captcha+'&'+'token='+token;

                return $http({
                    method: 'GET',
                    url: url,

                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true

                });
            },
            forgetcheckotp:function(phone,code,token){
                var str =  "{0}:{1}/{2}";
                var url = str.format(config.user_service.host, config.user_service.port, config.user_service.user_checkoptforget);


                return $http({
                    method: 'POST',
                    url: url,
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    withCredentials:true,
                    data:{"smsCode":code,"resetToken":token}

                });
                /*     return  $http.get(url, {withCredentials: true});*/
            },
            userpasswordreset:function(password,confirmPassword,token){
                var str =  "{0}:{1}/{2}";
                var url = str.format(config.user_service.host, config.user_service.port, config.user_service.user_password_reset);
                var encrypt_result =encrypt.cryptPasswordSync(password);
                var encryptPassword = encrypt_result[0];
                var salt = encrypt_result[1];
                var encryptConfirmPassword = encrypt.cryptPasswordSync(confirmPassword,salt)[0];

                return $http({
                    method: 'PATCH',
                    url: url,
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    withCredentials:true,
                    data:{"password":encryptPassword,"confirmPassword":encryptConfirmPassword, "resetToken":token}

                });
                /*     return  $http.get(url, {withCredentials: true});*/
            },
            forgetrequestuser:function(name,Captcha,token){
                    var str =  "{0}:{1}/{2}";
                    var url = str.format(config.user_service.host, config.user_service.port, config.user_service.user_request);
                    return $http({
                        method: 'POST',
                        url: url,
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        withCredentials:true,
                        data:{"loginId":name, "captcha":Captcha,"captchaToken":token}

                    });
           /*     return  $http.get(url, {withCredentials: true});*/
            },
            quicklogin: function(cellphone, password, smsCode, acceptTos) {
               return getUserQuick(cellphone, password,smsCode,acceptTos).then(function(response){
                   //success function
                   // init user. -- see module:user
                   var token=response.data.data['accessToken'];

                   if(token!=null)
                   {
                       var current_user = new User({
                           userName:response.data.data['userName'],
                           userRole:response.data.data['roleIds'],
                           phoneNum: response.data.data['cellphone'],
                           token: response.data.data['accessToken']
                       });
                       var redrict_to = current_user.loginSuccess(true, true);
                        return{loginStatus:'success', redrict_to:redrict_to}
                   }
                   else{
                       var error=response.data['error'];
                       switch (error)
                       {
                           case 1:
                               error='验证码失效或错误，请重新输入';
                               break;
                           case 2:
                               error='手机号已存在，请重新输入';
                               break;
                           default :
                               error='信息有误，请重新输入';
                               break;
                       }
                       return {loginStatus:'failed',errorMsg:error};
                   }
               }, function(error){
                   //error function
                   console.log('login fail');
                   var errorMsg = '登陆失败，请检查网络设置';
                   if(error.status == '400'){
                       //user name or password error
                       errorMsg = '信息有误，请重新输入';
                   }else {
                       errorMsg = '当前网络不稳定，系统正在努力加载中。 ';
                   }
                   return {loginStatus:'failed', errorMsg: errorMsg};

               })
            },
			findpword:function(formpword){//校验旧密码
				return getUserSalt().then(function(response){
					var salt = response.data.data['salt'];
					var str =  "{0}:{1}/{2}";
					var url = str.format(config.account_service.host, config.user_service.port, config.account_service.account_tradingpword);
							
					var genMD5frompword=encrypt.cryptPasswordSync(formpword, salt)[0];
					
					return $http({
						 method:'POST',
						 url:url,
						 headers: {
						'Content-Type': 'application/json',							                        'Authorization': User.getAuthorization(),
						},
						 data:{"oldPassword":genMD5frompword},
						 withCredentials:true			
					});
						
							
				},function(response){
					
				})	
				
			},
		
			
			setnewpword:function(newformpword,newformpword2){//支付设置新密码
				return getUserSalt().then(function(response){
				var salt = response.data.data['salt'];
				var str =  "{0}/{1}";
                var url = str.format(config.account_service.host, config.account_service.account_setnewpword);
				var genMD5frompword=encrypt.cryptPasswordSync(newformpword, salt)[0];
					
				var genMD5frompword2=encrypt.cryptPasswordSync(newformpword2, salt)[0];
				
				
				return $http({
				 method:'PATCH',
				 url:url,
				 data:{'password':genMD5frompword,'confirmPassword':genMD5frompword2},
				 headers: {
						'Content-Type': 'application/json',							                        'Authorization': User.getAuthorization(),
									},
				}) 
					
			},function(){})
				
				
			},
			resetpword:function(resetPword,resetPword2){//找回交易设定新密码
			
			 return getUserSalt().then(function(response){
				var salt = response.data['data']['salt'];
				var str =  "{0}:{1}/{2}";
                var url = str.format(config.account_service.host, config.user_service.port, config. account_service.account_resetpword);
				var resetpassd=encrypt.cryptPasswordSync(resetPword, salt)[0];
					
				var resetpassd2=encrypt.cryptPasswordSync(resetPword2, salt)[0];
				
				return $http({
				 method:'PATCH',
				 url:url,
				 data:{'password':resetpassd,'confirmPassword':resetpassd2},
				 headers: {
						'Content-Type': 'application/json',							                        'Authorization': User.getAuthorization(),
					},
				}) 
				
				},function(){})
				
			},
			verification:function(){//验证身份
			
				var str =  "{0}:{1}/{2}";
                var url = str.format(config.account_service.host, config.user_service.port, config.account_service.account_postacco);
				
				return $http({
				 method:'GET',
				 url:url,
				 headers: {
                        
						'Authorization': User.getAuthorization(),
						
                 		},
				 
				}) 
					
				
			},
			
			restPasswordOtp:function(){
				var str = "{0}/{1}";
				var url = str.format(config.account_service.host, config.account_service.rest_trade_password_otp);
				return $http({
					method:'GET',
					url: url,
					headers:{
						'Authorization': User.getAuthorization()
					}
				})
			},
			
			postvcation:function(cardNo,idNo,smsCode){//提交验证身份
				
					var str =  "{0}:{1}/{2}";
                	var url = str.format(config.account_service.host, config.user_service.port, config.account_service.account_account);
				
					return $http({
					 method:'post',
					 url:url,
					 headers: {
							'Content-Type': 'application/json',
							'Authorization': User.getAuthorization(),
							},
					 data:{'cardNo':cardNo,'idNo':idNo,'smsCode':smsCode}
					 
					}) 

				
			},
            login: function(username, password, saveLocally, autoLogin,aptchaimg,token, successCallback, errorCallback){
                var errorFn = function(error){
                    //error function
                    console.log('login fail');
                    var errorMsg = '登陆失败，请检查网络设置';
                    if(error.status == '400'){
                        //user name or password error
                        errorMsg = '信息有误，请重新登录';
                    }else {
                        errorMsg = '当前网络不稳定，系统正在努力加载中。 ';
                    }
                    errorCallback(errorMsg);
                }
               
                return getUserSalt(username).then(function(response){
                        if(response.data["error"]==1)
                        {
                            errorCallback("用户名不存在，请先注册");
                            return {loginStatus:'failed', errorMsg:"用户名不存在，请先注册"}
                        }
                        var salt = response.data.data['salt'];
                        getUser(username, password, aptchaimg, token, salt).then(function(response){
                        //success function
                        // init user. -- see module:user
                        var token=response.data.data['accessToken'];
                        if(token!=null){
                            var current_user = new User({
                                userName:response.data.data['userName'],
                                userRole:response.data.data['roleIds'],
                                phoneNum: response.data.data['cellphone'],
                                token: response.data.data['accessToken']
                            });
                            var redrict_to = current_user.loginSuccess();
                            successCallback(redrict_to)
                        }else{
                            var error=response.data['error'];
                            switch(error)
                            {
                                case 1:
                                    error='图片验证码失效，请重新输入';
                                    break;
                                case 2:
                                    error='图片验证码错误，请重新输入';
                                    break;
                                case 3:
                                    error='用户名和密码不匹配，请检验后重新登录';
                                    break;
                                case 4:
                                    error='账户已被锁定，请30分钟后重试';
                                    break;
                                default:
                                    error=response.data['message'];
                                    break;
                            }
                            errorCallback(error)
                        }
                    },errorFn)
                    }, errorFn)
			}
		}
	}]);
})