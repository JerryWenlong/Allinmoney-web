define(['services', 'slidePicShow', 'slideProductShow','config', 'encrypt'], function (services, Slider, productSlide,config,encrypt) {
	// body...
	services.factory('commonService', ['$http', function($http){
		
		var SLIDESHOWCHANGEEVENTNAME='imgUrlListChange';
		var SLIDESHOWDELIVERNAME='imgUrlListChangeFromNavigate';

		var CATEGORYSHOWEVENTNAME='categoryShowChange';
		var CATEGORYSHOWDELIVERNAME='categoryShowChangeFromNavigate';

        var setTradeKeyCallback = null; //set trade key success callback 

		return {

			slideChangeListen: function(scope){
				scope.$on(SLIDESHOWDELIVERNAME, function(event, data, config){
					scope.slides = data;
					var parentNode = document.getElementById('slide');
					var slide = new Slider();
					var timer = slide.createPicSlider(parentNode, data, config);
					if(!allinmoney.slideTimer){
						allinmoney.slideTimer = [];
					}
					allinmoney.slideTimer.push(timer);
				});
			},
			slideChangeTrigger: function(scope, data, config){
				scope.$emit(SLIDESHOWCHANGEEVENTNAME, data, config);
			},
			slideChangeDeliver: function(parent_scope){
				parent_scope.$on(SLIDESHOWCHANGEEVENTNAME, function(event, data, config){
					parent_scope.$broadcast(SLIDESHOWDELIVERNAME, data, config);
				});
			},

			categoryShowListrn: function(scope){
				scope.$on(CATEGORYSHOWDELIVERNAME, function(event, data){
					if(data.isHomePage){
						//remove category hover
						scope.hoverShowCategory = false;
					}else{
						//add category hover
						scope.hoverShowCategory = true;
					}
				})
			},
			categoryShowTrigger: function(scope, data){
				scope.$emit(CATEGORYSHOWEVENTNAME, data);
			},
			categoryShowDeliver: function(parent_scope){
				parent_scope.$on(CATEGORYSHOWEVENTNAME, function(event, data){
					parent_scope.$broadcast(CATEGORYSHOWDELIVERNAME, data);
				});
			},
			showProductSlide: function(parentNode, productList, config){
				var slider = new productSlide();
				slider.createProductSlider(parentNode, productList, config);
			},
            setTradePasswordOtp:function(){
				var str = "{0}/{1}";
				var url = str.format(config.account_service.host, config.account_service.set_trade_password_otp);
				return $http({
					method:'GET',
					url: utl,
					headers:{
						'Authorization': User.getAuthorization()
					}
				})
			},
            getUserSalt: function(username){
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
            },
            setPayPassword:function(password,confirmPassword,idNo,smsCode,token,settoken,salt)
            {
                var str =  "{0}:{1}/{2}";
                var url = str.format(config.account_service.host, config.account_service.port, config.account_service.paypassword);
                var encryptPassword= encrypt.cryptPasswordSync(password ,salt)[0];
                var encryptConfirmPassword = encrypt.cryptPasswordSync(confirmPassword, salt)[0];
                return $http({
                    method: 'POST',
                    url: url,
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization':' Bearer '+token
                    },
                    withCredentials:true,
                    data:{'password':encryptPassword,'confirmPassword':encryptConfirmPassword,'token':settoken}

                });
            },

            geCityList:function(phone)
            {
                var str =  "{0}:{1}/{2}";
                var url = str.format(config.pay_service.host, config.pay_service.port, config.pay_service.province);

                return $http({
                    method: 'GET',
                    url: url,

                    headers:{
                        'Content-Type': 'application/json'
                    },
                    withCredentials:true

                });
            },
            getCardBin:function(phone)
            {
                var str =  "{0}:{1}/{2}";
                var url = str.format(config.pay_service.host, config.pay_service.port, config.pay_service.cardbin);

                return $http({
                    method: 'GET',
                    url: url,
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    withCredentials:true

                });
            },
            setAccountCards:function(name,idNo,cardNO,cellphone,smsCode,Tops,bankCode,provinceCode,cityCode, token)
            {
                var str =  "{0}/{1}";
                var url = str.format(config.account_service.host, config.account_service.cards);

                return $http({
                    method: 'POST',
                    url: url,
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization':' Bearer '+token
                    },
                    withCredentials:true,
                    data:{
                        "holderName":name,
                        "idNo":idNo, 
                        "cardNo":cardNO,
                        "cellphone":cellphone,
                        "smsCode":smsCode,
                        "acceptTos":Tops,
                        'bankNo':bankCode,
                        'province':provinceCode,
                        'city':cityCode}
                });
            }
		}
	}]);
})