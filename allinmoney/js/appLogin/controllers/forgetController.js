/**
 * Created by chenwei on 2015/11/23.
 */
define(['controllers', 'config'], function (controllers, config) {
    controllers.controller('forgetController', [
        '$scope',
		'$timeout',
        'loginService',
        '$location',
        '$cookies',
        '$window',
        function ($scope,$timeout, loginService, $location, $cookies, $window) {
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
            $scope.forget={
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
				smsdisable:false
            }

            $scope.registercheck={
                "usernamecheck": false,
                "cellphonecheck": false

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



            $scope.getOtp = function( ) {
                if($scope.register.errormessage=="手机号已存在，请重新输入" || $scope.register.errormessage=="请输入正确的手机号码")
                {
                    $scope.register.errormessage='';
                }
                if($scope.register.cellphone&&$scope.register.cellphone.length==11)
                {
                    if($scope.registercheck.cellphonecheck==true)
                    {
                        $scope.register.errormessage="手机号已存在，请重新输入";
                        return false;
                    }
                    loginService.getSignUpOtp($scope.register.cellphone).then(function(response) {
                        if(response.data['error'] == 0) {

                        }else
                        {

                        }
                    },function(resp){
                        //带有错误信息的resp
                        $scope.register.errormessage="当前网络不稳定，系统正在努力加载中。 ";
                    })
                    return true;
                }
                else
                {
                    $scope.register.errormessage="请输入正确的手机号码";
                    return false;
                }


            }
            $scope.smstimerout = function(name)
            {
                if(tElement)
                {
                    return;
                }
                if(name=='forget')
                {
                    $scope.getOtpForget();
                    tElement  =document.getElementById('ptimeout_f');
                    timeOutSms = setInterval(smsInterval, 1000)
                }
                else
                {
                    if( $scope.getOtp())
                    {
                        tElement  =document.getElementById('ptimeout_r');
                        timeOutSms = setInterval(smsInterval, 1000);
                    }
                }
				
				$scope.forget.smsdisable=true;
				$timeout(function(){	
							$scope.forget.smsdisable=false;
							$scope.forget.errormessage="";
				},61000)


            }


            $scope.confimPassword = function(name ) {
                if(name=='forget')
                {
                    if($scope.forget.confirmPassword==$scope.forget.password)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    if($scope.register.confirmPassword==$scope.register.password)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }

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
                $window.location.href='login.html';
            }

            $scope.firstgetCaptcha=function(name)
            {
                $scope. clickimg=true;

                $scope.getcaptchatoken(name);
            }
            $scope. getcaptchatoken=function(pname)
            {
                loginService.getcaptchaRequest().then(function(response){
                    if( response.status=='200')
                    {

                        if(pname=='forget')
                        {
                            $scope.forget.token=response.data.data['token'];
                            $scope.forget.url=response.data.data['url'];
                        }
                        else
                        {
                            $scope.register.token=response.data.data['token'];
                            $scope.register.url=response.data.data['url'];
                        }

                        $scope.getCaptcha(pname);
                    }
                    else
                    {
                        $scope.register.errormessage="当前网络不稳定，系统正在努力加载中。 ";
                    }
                });
            }
            $scope.getCaptcha = function(pname){
                var verify;
                if(pname=='forget')
                {
                     verify=document.getElementById('f_check');
                    verify.setAttribute('src',config.user_service.host+':'+config.user_service.port+$scope.forget.url);

                }
                else
                {
                     verify=document.getElementById('r_check');
                    verify.setAttribute('src',config.user_service.host+':'+config.user_service.port+$scope.register.url);
                }



            }
            $scope.onblurcheck = function(bool,name,value)
            {
                if(bool||value==""||!value)
                {
                    return;
                }
                loginService.checkFeild(name,value).then(function(response) {
                    if(response.data['data'] == 0) {
                        if(name=="username")
                        {
                            $scope.registercheck.usernamecheck=true;
                        }
                        if(name=="cellphone")
                        {
                            $scope.registercheck.cellphonecheck=true;
                        }
                    }
                    else
                    {
                        if(name=="username")
                        {
                            $scope.registercheck.usernamecheck=false;
                        }
                        if(name=="cellphone")
                        {
                            $scope.registercheck.cellphonecheck=false;
                        }
                    }
                },function(resp){
                    //带有错误信息的resp
                    if(name=="username")
                    {
                        $scope.registercheck.usernamecheck=false;
                    }
                    if(name=="cellphone")
                    {
                        $scope.registercheck.cellphonecheck=false;
                    }

                });

            }

            $scope.gotofirst = function() {
                $window.location.href='index.html';
                $scope.register.errormessage="";
            }
            $scope.gotoAccount = function() {
                $window.location.href='./index.html#/account';
                $scope.register.errormessage="";
            }
            $scope.RegisterToServer = function(){

                if($scope.register.username&&$scope.register.password&&$scope.register.confirmPassword&&$scope.register.cellphone&&$scope.register.smsCode&&$scope.register.captcha)
                {

                    loginService.checkCaptcha($scope.register.captcha,$scope.register.token).then(function(response){
                        if(response.data['error'] == 0){
                            loginService.register($scope.register.username,$scope.register.password,$scope.register.cellphone,
                                    $scope.register.smsCode,$scope.register.captcha,$scope.register.email,
                                    $scope.register.confirmPassword,1,$scope.register.token
                            ).then(function(response){

                                    if(response.Status == 'success'){

                                        $scope.show_p=1;
                                        $scope.register.errormessage="";
                                    }else{
                                        $scope.register.captcha='';
                                        $scope.getcaptchatoken();
                                        $scope.register.errormessage=response.errorMsg;
                                    }
                                })
                        }else{
                            $scope.register.errormessage="图片验证码错误，请重新输入";
                            $scope.register.captcha='';
                            $scope.getcaptchatoken();
                        }
                    },function(resp){
                        //带有错误信息的resp

                        $scope.register.errormessage="当前网络不稳定，系统正在努力加载中。 ";
                        $scope.register.captcha='';
                        $scope.getcaptchatoken();
                    });
                }
                else
                {
                    $scope.register.errormessage="请填写所有空行";
                }

            }

            $scope.forgetrequest = function() {
             return   loginService.forgetrequestuser($scope.forget.username,$scope.forget.captcha,$scope.forget.token).then(function(response){
                    if(response.data['error'] == 0) {
                        $scope.forget.token=response.data.data['resetToken'];
                       return{cellphone: response.data.data['cellphone'],
                           email: response.data.data['email']};
                    }
                    else if(response.data['error'] == 1)
                    {
                        $scope.forget.errormessage="验证码失效，请重新输入 ";
                    }
                    else if(response.data['error'] == 2)
                    {
                        $scope.forget.errormessage="验证码错误，请重新输入";
                    }
                    else if(response.data['error'] == 3)
                    {
                        $scope.forget.errormessage="用户不存在，请重新输入";
                    }
                     else
                    {
                        $scope.forget.errormessage="操作过期，请重新返回操作";
                    }
                      $scope.getcaptchatoken('forget');

                     $scope.forget.captcha='';
                      return null;
                },function(resp){
                   $scope.forget.captcha='';
                    $scope.getcaptchatoken('forget');
                     if(resp.status == '400'){
                         $scope.forget.errormessage="信息有误，请重新输入";
                     }
                    else
                    {
                        $scope.forget.errormessage="当前网络不稳定，系统正在努力加载中。 ";
                    }

                 return null;
                });

            }

            $scope.forgetrequestuser = function()
            {
                $scope.forgetrequest().then(function(response) {
                   if(response!=null)
                   {
                       $scope.forget. maskcellphone=response['cellphone'];

                       document.getElementById('user_phone').innerHTML=$scope.forget. maskcellphone;
                       $scope.forget.step=1;
                       $scope.show_p=1;
                       $scope.forget.errormessage="";
                       $scope. showPage($scope.forget.step,'f');

                   }else
                   {
                       $scope.forget.step=0;
                   }

               })

            }

            $scope.forgetCheckOtp = function() {

                loginService.forgetcheckotp( $scope.forget.username,$scope.forget.smsCode,$scope.forget.token).then(function(response){
                    if(response.data['error'] == 0){
                        $scope.forget.temptoken=response.data['token'];
                        $scope.forget.step=2;
                        $scope.show_p=2;
                        $scope.forget.errormessage="";
                        $scope. showPage($scope.forget.step,'f');
                    }
                    else if(response.data['error'] == 1)
                    {
                        $scope.forget.errormessage="重置密码超时,请重新输入";
                    }
                    else if(response.data['error'] == 2)
                    {

                        $scope.forget.errormessage="短信验证码错误,请重新输入";
                    }
                },function(resp){
                    //带有错误信息的resp
                    if(resp.status == '400'){
                        $scope.forget.errormessage="信息有误，请重新输入";
                    }
                    else{
                        $scope.forget.errormessage="当前网络不稳定，系统正在努力加载中。 ";
                    }


                });
            }
            $scope.getOtpForget = function() {
                loginService.getotpforget($scope.forget.token).then(function(response){
                    if(response.data['error'] == 0){

                    }
                });
            }

            $scope.userpasswordreset=function()
            {
                loginService.userpasswordreset($scope.forget.password,$scope.forget.confirmPassword,$scope.forget.token).then(function(response) {
                    if(response.data['error'] == 0) {
                        $scope.forget.step=3;
                        $scope.show_p=3;
                        $scope.forget.errormessage="";    
                        $scope. showPage($scope.forget.step,'f');
                    }else if(response.data['error'] == 1)
                    {
                        $scope.forget.errormessage="重置超时，请重新设置";
                        $window.location.href='forgetPassWord.html';

                    }else if(response.data['error'] == 2)
                    {
                        $scope.forget.errormessage="短信未验证";
                    }else if(response.data['error'] == 3)
                    {
                        $scope.forget.errormessage=" 重置失败，请重新设置";
                    }

                },function(resp){
                    //带有错误信息的resp
                    if(resp.status == '400'){
                        $scope.forget.errormessage="信息有误，请重新输入";
                    }
                    else{
                        $scope.forget.errormessage="当前网络不稳定，系统正在努力加载中。 ";
                    }

                });
            }

        }]);

})
