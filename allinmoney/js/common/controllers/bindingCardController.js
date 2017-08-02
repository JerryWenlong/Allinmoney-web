define(['controllers', 'user'], function (controllers, User) {
    'use strict';
    controllers.controller('bindingCardController', ['$scope', 'commonService', 'userService','$window', '$routeParams',
        function ($scope, commonService, userService, $window, $routeParams) {
            var timeOutSms;
            var timeOutT = 0;
            var tElement;
            var pArry = new Array;
            var cArry = new Array;
            var bArry = new Array;
            var provinceCode = 0;
            var cityCode = 0;
            var bankCode = 0;
            var provinceindex = -1;
            var binJson;
            var provinceJson;
            var selectbankindex = -1;
            var tokenSuccess = null;
            var City = new Array;
            $scope.card = {
                pass: '',
                comfirmpass: '',
                step: 1,
                name: '',
                no: '',
                card: '',
                cardname: bArry,
                cardposp: pArry,
                cardposc: cArry,
                cellphone: '',
                checkcode: '',
                tos: true,
                errormessage: '',
                bankhint: true,
                prhint: true,
                cityhint: true,
                bankdefault: '请选择发卡银行',
                prdefault: '所在省份',
                citydault: '所在城市',

            }
			
			$scope.cardnod=function(a){
				var retest=/^(^[1]{15}$)|(^[1]{18}$)$/
				if(retest.test(a)){
					return true
				}else{
					return false	
				}
			}
			
            var checkbank = function () {
                if (selectbankindex != -1) {
                    var namebank = bArry[selectbankindex];
                    for (var i = 0; i < binJson.length; i++) {
                        if (namebank.label == binJson[i]['bankName']) {
                            for (var j = 0; j < binJson[i]['bins'].length; j++) {
                                var l = binJson[i]['bins'][j]['len'];
                                var s = binJson[i]['bins'][j]['bin'];
                                if ($scope.card.card.match(s) && $scope.card.card.length == l) {
                                    return true;
                                }
                            }

                        }

                    }
                }
                return false;
            }

            $scope.setAccountCards = function () {
                var info = User.getUserInfo();
                $scope.card.errormessage = "";
                if ($scope.card.name && $scope.card.no && $scope.card.card && $scope.card.cellphone && $scope.card.checkcode&&$scope.card.tos) {
                    if (bankCode == 0 || provinceCode == 0 || cityCode == 0) {
                        $scope.card.errormessage = "请选择银行，城市列表";
                        return true;
                    }
                    if (!checkbank()) {
                        $scope.card.errormessage = "请输入正确的卡号";
                        return true;
                    }

                    commonService.setAccountCards($scope.card.name, $scope.card.no, $scope.card.card, $scope.card.cellphone, $scope.card.checkcode, 1, bankCode, provinceCode, cityCode, info.token).then(function (response) {

                         if (response.status == '200') {
                            var token=response.data.data['token'];
                            if(token)
                            {
                                $scope.card.errormessage = "";
                                $scope.card.step = 2;
                                tokenSuccess=token;
                                return ;
                            }
                            var error=response.data['error'];
                            switch (error)
                            {
                                case 2303:
                                    $scope.card.errormessage ='卡信息有误，请重新输入';
                                   break;
                                case 2304:$scope.card.errormessage = '银行卡号错误'; break;
                                case 2305: $scope.card.errormessage ='卡信息有误，请重新输入';break;
                                case 2005:
                                    $scope.card.errormessage ='此账号已经绑定银行卡';
                                  break;
                                case 2006:
                                    $scope.card.errormessage ='此卡已经被其他用户占用，请重新输入';
                                  break;
                                case 2007:
                                    $scope.card.errormessage ='手机验证码失效或错误，请重新输入';
                                    $scope.card.checkcode='';
                                   break;
                                case 2023:
                                    $scope.card.errormessage ='该身份证号已关联另外一张卡.';
                                    break;
                                case 2029:
                                    $scope.card.errormessage ='银行卡未开通银联在线支付.';
                                    break;
                                default:
                                    $scope.card.errormessage =response.data['message'];
                                    break;
                            }

                        }
                        else {
                            $scope.card.errormessage = '当前网络不稳定，系统正在努力加载中。 ';
                        }
                    }, function (resp) {
                        //带有错误信息的resp
                        $scope.card.errormessage = '当前网络不稳定，系统正在努力加载中。 ';
                    })
                    return true;
                }
                else {
                    $scope.card.errormessage = "请填写全部空行";
                    return false;
                }
            }
            $scope.geBankBin = function () {

                commonService.getCardBin($scope.card.cellphone).then(function (response) {
                    if (response.data['error'] == 0) {
                        binJson = response.data['data'];
                        for (var i = 0; i < binJson.length; i++) {

                            var b = new Object();
                            b.index = i;
                            b.label = binJson[i]['bankName'];
                            bArry.push(b);
                        }
                    } else {
                        $scope.card.errormessage = '当前网络不稳定，系统正在努力加载中。 ';

                    }
                }, function (resp) {
                    //带有错误信息的resp
                    $scope.card.errormessage =  '当前网络不稳定，系统正在努力加载中。 ';
                })
                return true;

            }
            $scope.geCityList = function () {

                commonService.geCityList($scope.card.cellphone).then(function (response) {
                    if (response.data['error'] == 0) {
                        provinceJson = response.data['data'];
                        for (var i = 0; i < provinceJson.length; i++) {
                            City[i] = provinceJson[i]['cities'];

                            var province = new Object();
                            province.index = i;
                            province.label = provinceJson[i]['province'];
                            pArry.push(province);
                        }

                    } else {
                        $scope.card.errormessage = '当前网络不稳定，系统正在努力加载中。 ';

                    }
                }, function (resp) {
                    //带有错误信息的resp
                    $scope.card.errormessage ='当前网络不稳定，系统正在努力加载中。 ';
                })
                return true;

            }
            $scope.getOtp = function () {
                if( $scope.card.errormessage=="请输入正确的手机号码")
                {
                    $scope.card.errormessage='';
                }
                if ($scope.card.cellphone && $scope.card.cellphone.length == 11) {
                    userService.accotp().then(function (response) {
                        if (response.data['error'] == 0) {
                        } else {


                        }
                    }, function (resp) {
                        //带有错误信息的resp
                        $scope.card.errormessage = '当前网络不稳定，系统正在努力加载中。 ';
                    })
                    return true;
                }
                else {
                    $scope.card.errormessage = "请填写正确的手机号";
                    return false;
                }
            }

            var setTradeKey = function(){

                $window.location.href="#/tradepw";
            }
            $scope.setPasswordCallback=function(){
                if (typeof(allinmoney.action.setTradeKeyBack) == 'function'){
                    allinmoney.action.setTradeKeyBack();
                }else{
                    //back to register
                    $window.location.href='index.html';
                   // console.log('back to register');
                }
            }
            $scope.setPassword = function () {
                var info = User.getUserInfo();
                var userName = info.user_name;
                var token=info.token;

                if ($scope.card.pass && $scope.card.comfirmpass) {
                    commonService.getUserSalt(userName).then(function (response)
                    {
                        var salt = response.data.data['salt'];
                        if(salt==null)
                        {
                            $scope.card.errormessage = '当前网络不稳定，系统正在努力加载中。 ';
                            return;
                        }
                        commonService.setPayPassword($scope.card.pass, $scope.card.comfirmpass, $scope.card.no, $scope.card.checkcode, token,tokenSuccess,salt).then(function (response) {
                            if (response.data['error'] == 0) {
                                $scope.card.pass = null;
                                $scope.card.comfirmpass = null;
                                $scope.card.errormessage = null;
                                tokenSuccess=null;
                                $scope.setPasswordCallback();
                            } else {
                                var error= response.data['error'];
                                switch (error)
                                {
                                    case 2001:
                                        $scope.card.errormessage ='用户尚未注册，请先注册';
                                        break;
                                    case 2008:
                                        $scope.card.errormessage ='该用户已设定支付密码，请重新输入';
                                        break;
                                    case 2009:
                                        $scope.card.errormessage ='身份信息有误，请重新输入';
                                        break;
                                    case 2007:
                                        $scope.card.errormessage ='手机验证码失效或错误，请重新输入';
   
                                        break;
                                    case 2027:
				        allinmoney.action.setTradeKeyBack=setTradeKey;
                                        tokenSuccess=null;
                                        $scope.setPasswordCallback();
                                        $scope.card.errormessage ='设定支付密码的token无效或者已失效';
                                        break;
                                    default:
                                        $scope.card.errormessage = '当前网络不稳定，系统正在努力加载中。 ';
                                        break;
                                }
                            }
                        }, function (resp) {
                            //带有错误信息的resp
                            $scope.card.errormessage = '当前网络不稳定，系统正在努力加载中。 ';
                        })
                    }, function (resp) {
                        //带有错误信息的resp
                        $scope.card.errormessage = '当前网络不稳定，系统正在努力加载中。 ';
                    })


                } else {
                    $scope.card.errormessage = "填写所有空行";
                }
                return true;
            }


            var smsInterval = function () {

                //      $scope.registercheck.smsTimeOut="发送动态码（"+ (60-timeOutT)+")";
                tElement.innerHTML = "发送动态码(" + (60 - timeOutT) + ")";
                if (timeOutT == 60) {
                    clearTimeout(timeOutSms);
                    timeOutT = 0;
                    tElement.innerHTML = "发送动态码(" + (60 - timeOutT) + ")";
                    tElement = null;
                }
                timeOutT++;
            }
            $scope.smstimerout = function (name) {
                if (tElement) {
                    return;
                }

                if ($scope.getOtp()) {
                    tElement = document.getElementById('binding-button');
                    timeOutSms = setInterval(smsInterval, 1000);
                }

            }


            $scope.showbank = function (index) {
                $scope.card.bankhint = false;
                selectbankindex = index;
                bankCode = (binJson[selectbankindex]['bankNo']);

            }
            $scope.showcity = function (index) {
                $scope.card.cityhint = false;

                if (provinceindex != -1) {
                    cityCode = (provinceJson[provinceindex]['cities'][index]['code']);
                }

            }
            $scope.initC = function (index) {
                $scope.card.prhint = false;
                $scope.card.cityhint = true;
                cArry.length = 0;
                cityCode = 0;
                provinceindex = index;
                provinceCode = (provinceJson[index]['code']);
                if (City != null) {
                    for (var i = 0; i < City[index].length; i++) {
                        var city = new Object();
                        city.index = i;
                        city.label = City[index][i]['city'];
                        cArry.push(city);
                    }
                }
                else {
                    $scope.geCityList();
                }

            },
                $scope.confimPassword = function( ) {

                        if ($scope.card.comfirmpass == $scope.card.pass) {
                            return true;
                        }
                        else {
                            return false;
                        }

                },
                $scope.test = function () {
                  /*  binJson = [
                        {"bankNo": "102", "bankCode": "ICBC", "bankName": "中国工商银行", "bins": [
                            {"bin": "370246", "len": "15"},
                            {"bin": "370247", "len": "15"}
                        ]}
                    ];
                    provinceJson = [
                        {"code": "110000", "province": "北京", "cities": [
                            {"code": "110000", "city": "北京"}
                        ]},
                        {"code": "120000", "province": "天津", "cities": [
                            {"code": "120000", "city": "天津"}
                        ]}
                    ];

                    var binjson = binJson;
                    for (var i = 0; i < binJson.length; i++) {

                        var b = new Object();
                        b.index = i;
                        b.label = binJson[i]['bankName'];
                        bArry.push(b);
                    }
                    var provincejson = provinceJson;
                    for (var i = 0; i < provincejson.length; i++) {
                        City[i] = provincejson[i]['cities'];

                        var province = new Object();
                        province.index = i;
                        province.label = provincejson[i]['province'];
                        pArry.push(province);
                    }*/
                }

        }

    ]);
})

