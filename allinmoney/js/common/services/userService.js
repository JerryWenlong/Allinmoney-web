define(['services', 'config', 'user', 'encrypt','sockjs','stomp'], function (services, config, User,encrypt, sockjs, stomp) {
	services.factory('userService', ['$http', function($http){

		var regPayAmount = /(\d{1,3})(?=(?:\d{3})+(?!\d))/g;

		var userServiceApi = {
			getUserSalt: function(username){
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
		        },
			createOrder: function(productID, balance){
				var str =  "{0}/{1}";
				var api_url = str.format(config.biz_trade_service.host, config.biz_trade_service.create_order);
				return $http({
					method: 'POST',
					url: api_url,
					headers:{
						'Content-Type': 'application/json',
						'Authorization': User.getAuthorization(),
					},
					data:{
						'productId': productID,
						'amount': balance
					}	
				});
			},
			getOrder:function(orderId){
				var str = "{0}/{1}/{2}";
				var api_url=str.format(config.biz_trade_service.host, config.biz_trade_service.create_order, orderId);
				return $http({
					method: 'GET',
					url: api_url,
					headers:{
						'Authorization': User.getAuthorization(),
					}
				});
			},
			getOrderList:function(pageSize, page, fromDate, toDate, sort, asc, status){
				var str =  "{0}/{1}";
                var api_url = str.format(config.biz_trade_service.host, config.biz_trade_service.get_user_orders);

                var search='?pageSize=' + pageSize+'&page='+page+'&fromDate='+ fromDate +'&toDate='+toDate+'&sort='+sort +'&asc='+asc+'&status='+status;

                var url = api_url + search;
                return $http({
                    method: 'GET',
                    url: url,
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': User.getAuthorization()
                    }
                });
			},
			getUserBankList: function(){
				var str = "{0}/{1}";
				var api_url = str.format(config.account_service.host, config.account_service.get_user_bank);
				return $http({
					method: 'GET',
					url: api_url,
					headers:{
						'Content-Type': 'application/json',
						'Authorization': User.getAuthorization(),
					}
				});
			},
			payOrder:function(tradeSerialNo, amount, password, smsCode, acceptTos, salt){
				var str = "{0}/{1}";
				var api_url = str.format(config.account_service.host, config.account_service.payorder);
				var encrypt_password = encrypt.cryptPasswordSync(password, salt)[0];

				var payForm = {
					assetType:0,
					amount: amount
				} 


				return $http({
					method: 'POST',
					url: api_url,
					headers:{
						'Content-Type': 'application/json',
						'Authorization': User.getAuthorization(),
					},
					data:{
						tradeSerialNo: tradeSerialNo,
						password: encrypt_password,
						smsCode: smsCode,
						acceptTos: acceptTos,
						items:[payForm]
					}
				});
			},
			payOtp:function(){
				var str = "{0}/{1}";
				var api_url = str.format(config.account_service.host, config.account_service.get_pay_otp);
				return $http({
					method:'GET',
					url: api_url,
					headers:{
						'Content-Type': 'application/json',
						'Authorization': User.getAuthorization(),
					}
				});
			},
			getAccountInfo:function(){
				var str = "{0}/{1}";
				var api_url = str.format(config.biz_account_service.host, config.biz_account_service.get_account_info);
				return $http({
					method:'GET',
					url: api_url,
					headers:{
						'Authorization': User.getAuthorization(),
					}
				});
			},
			withdrawAuthorize: function(salt, tradeKey){
				var str = "{0}/{1}";
				var api_url = str.format(config.account_service.host, config.account_service.withdraw_authorize);
				var encrypt_password = encrypt.cryptPasswordSync(tradeKey, salt)[0];
				return $http({
					method:'POST',
					url:api_url,
					headers:{
						'Content-Type': 'application/json',
						'Authorization': User.getAuthorization(),
					},
					data:{
						password: encrypt_password
					}
				})
			},
			withdrawConfirm: function(balance){
				var str="{0}/{1}";
				var api_url = str.format(config.account_service.host, config.account_service.withdraw_confirm);
				return $http({
					method:'POST',
					url: api_url,
					headers:{
						'Content-Type': 'application/json',
						'Authorization': User.getAuthorization(),
					},
					data:{
						totalAmount: balance
					}
				})
			},
		}

		var CARDTYPELIST = ['对私借记卡', '对私贷记卡', '对私存折', '对公借记卡', '对公贷记卡', '对公存折'];// 1：对私借记卡；2：对私贷记卡；3：对私存折；4：对公借记卡；5：对公贷记卡；6：对公存折；
		var CARDTYPE = function(n){
			return CARDTYPELIST[n-1];
		}
		var generateBankList=function(response){
			var responseData = response.data;
			var result = [];
			if(responseData.length > 0){
				for(var i=0; i<responseData.length;i++){
					var item = responseData[i];
					var card = {};
					var bankNameStr = "{0}(尾号{1})";
					card.cardName = bankNameStr.format(item.bankName, item.cardNo);
					card.cardCode = item.bankCode; 
					card.cardUrl = config.bank_icon[item.bankNo].logo;
					card.cardNum = String("************{0}").format(item.cardNo);
					card.cardType = CARDTYPE(item.cardType);
					card.index=i;
					card.limited_title=String("{0}支付限额").format(item.bankName);
					card.limited_once=item.limitPerPay ? item.limitPerPay : '/';
					card.limited_oneday=item.limitPerDay ?item.limitPerPay : '/';
					card.marks = item.marks || "";
					card.phoneNo = item.phoneNo;
					result.push(card);
				}
			}
			return result;
		}
		var generateUserInfo=function(responseData){
			var IDTYPE_LIST = ["身份证", "护照", "营业执照", "军官证", "社会保障号"];
			var IDTYPE = function(n){
				return IDTYPE_LIST[n];
			}
			var userInfo = {};
			var cardList = [];
			var productList = [];
			userInfo.accountName = responseData.data.name;
			userInfo.idType = IDTYPE(responseData.data.idCardType);
			userInfo.idNo = responseData.data.idCardNo;
			userInfo.phoneNumber = responseData.data.phoneNo;
			userInfo.userAuth = responseData.data.bankCards.length > 0 ? true : false;
			userInfo.userBindPhone = responseData.data.phoneNo? true : false;
			userInfo.hasSetTradingPassword = responseData.data.hasSetTradingPassword;
			userInfo.yesterdayRevenue = responseData.data.yesterdayRevenue.replace(regPayAmount,'$1,');//昨日收益
			userInfo.totalRevenue = responseData.data.totalRevenue.replace(regPayAmount,'$1,');//总收益
			userInfo.totalFundsStr = responseData.data.totalBalance.replace(regPayAmount,'$1,');//总资金 ->余额
			userInfo.totalFunds = responseData.data.totalBalance;//总资金 ->余额
			userInfo.totalAsset = responseData.data.totalAsset.replace(regPayAmount,'$1,');//总资产

			for (var i =0;i<responseData.data.bankCards.length;i++){
				var card = {};var data = responseData.data.bankCards[i];
				var titleStr = "{0}-{1}(尾号{2})";
				card.cardType = CARDTYPE(data.cardType);
				card.cardTitle = titleStr.format(data.bankName, card.cardType, data.last4);
				card.cellphone = data.cellphone;
				cardList.push(card);
			}
			return {userInfo: userInfo, cardList: cardList}
		}

		var generateOrderDetail = function (responseData) {
			var orderDetail = responseData;
			var ORDER_STATUS_LIST = ["未支付", "支付成功", "支付失败", "过期", "交易中(已清算)", ".交易失败", "产品募集中","募集失败", "持有中", "赎回中", "已赎回"];
			var ORDER_STATUS = function (n) {
				return ORDER_STATUS_LIST[n];
			}
			orderDetail.businessDate = responseData.createdAt.toString().replace(/T/, " ");
			orderDetail.statusStr = ORDER_STATUS(responseData.status);
			return orderDetail;
		}

		var service = {
            signout:function(){
                var str= "{0}/{1}";
                var url = str.format(config.user_service, config.user_signout);
                return $http({
                    method:'get',
                    url:url,
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': User.getAuthorization(),
                    },
                })
            },
			createOrder:function(productID, amount, successFn, failedFn){
				var amount = parseFloat(amount);
				userServiceApi.createOrder(productID, amount).then(function(response){
					var error_code = response.data['error'];
					var error_message = "";
					if(error_code == 0){
						//create order success
						var orderId = response.data.data['orderNo'];
						error_message = "success";
						successFn(orderId)
					}else{
						switch(error_code){
							case 41000:error_message="商品不存在";break;
							case 41002:error_message="用户未绑定银行卡";break;
							case 41001:error_message="对不起, 该产品已下架";break;
							case 41005:error_message="对不起, 产品已被抢空";break;
							case 41004:var quota = response.data['quota'];
								error_message=String("最大购买额度{0}, 请重新输入").format(quota);break;
							case 41003:error_message="已达单日购买最大限额";break;
							case 41006:error_message="对不起, 您购买的金额小于最低购买额度";break;
						}
						failedFn(error_code, error_message)
					}
				}, function(error){
					var error_code = error.status;
					var error_message = "生成订单失败";
					failedFn(error_code, error_message);
				})
			},
			getOrder:function(orderId, successFn, failedFn){
				userServiceApi.getOrder(orderId).then(function(response){
					var order = response.data.data;
					successFn(generateOrderDetail(order));
				}, function(){
					failedFn();
				})
			},
			getUserBankList: function(successFn, failedFn){
				userServiceApi.getUserBankList().then(function(response){
					var bankList = generateBankList(response.data);
					successFn(bankList);
				},function(){
					failedFn();
				})
			},
			getUserProduct:function(){
				return [
					{title: "创势翔0号",productID:"100014",href:"#/product/100014/#top"},
					{title: "元普金牛71号", productID:"100020",href:"#/product/100020/#top"},
					{title: "个人房抵第十期", productID:"100013",href:"#/product/100013/#top"},
					{title: "和聚38号", productID:"100015",href:"#/product/100015/#top"},
					{title: "巨柏18号",productID:"100021",href:"#/product/100021/#top"},
				]
			},
			payOrder: function(tradeSerialNo, amount, password, smsCode, acceptTos, successFn, failedFn){
				var userName = User.getUserInfo().user_name;
				userServiceApi.getUserSalt(userName).then(function(response){
					if(response.data["error"]) {
						failedFn("getSaltFailed","获取用户信息失败");
					}else{
						var salt = response.data.data['salt'];
						userServiceApi.payOrder(tradeSerialNo, amount, password, smsCode, acceptTos, salt).then(function(response){
							var data = response.data;
							if(data['error'] == 0){
								successFn(data);
							}else{
								var errorCode = data['error'];
								var message='';
								switch(errorCode){
									case 2201: message= 'OTP发送失败';break;

								}
								failedFn(message);
							}
						},function(error){
							// switch(error)
							// failedFn(error.status);
						});
					}
				}, function(error){
					//get salt failed
					failedFn(error.status);
				})

				
			},
			payOtp:function(otpSendSuccessCallBack){
				userServiceApi.payOtp('pay').then(function(response){
					var error_code = response.data['error'];
					var message = "";
					if (error_code == 0){
						message = response.data['phoneNo'];
					}else{
						message = response.data['message'];
					}
					otpSendSuccessCallBack(error_code, message);
				},function(error){
					otpSendSuccessCallBack("failed");
				})
			},
		    getUserRevenue:function(successFn, failedFn){
				
				userServiceApi.getAccountInfo().then(function(response){
					var error_code = 0;
					if(response.data.data['bankCards'].length <= 0){
						error_code = 2001;
						failedFn(error_code);
					}
					var userInfo = generateUserInfo(response.data);
					successFn(userInfo);

		    	}, function(error){
		    		failedFn(error.status)
		    	});
		    },
		    withdrawAuthorize: function(tradeKey, successFn, failedFn){
		    	var userName = User.getUserInfo().user_name;
		    	userServiceApi.getUserSalt(userName).then(function(response){
		    		if(response.data["error"]) {
						failedFn("getSaltFailed","获取用户信息失败");
					}else{
						var salt = response.data.data['salt'];
						userServiceApi.withdrawAuthorize(salt, tradeKey).then(function(response){
							var data = response.data;
							successFn(data)
						},function(error){
							failedFn(error.status);
						});
					}
		    	},function(error){
		    		//get salt failed
					failedFn(error.status);
		    	}) 
		    },
		    withdrawConfirm: function(balance, successFn, failedFn){
		    	userServiceApi.withdrawConfirm(balance).then(function(response){
		    		successFn(response.data)
		    	}, function(error){
		    		failedFn(error.status)
		    	})
		    },
		    getWithdrawBalance:function(successFn, failedFn){
		    	userServiceApi.getAccountInfo().then(function(response){
					var error_code = 0;
					if(response.data.data['bankCards'].length <= 0){
						error_code = 2001;
						failedFn(error_code);
					}
		    		if(!response.data.data['hasSetTradingPassword']){
						error_code = 2010;
						failedFn(error_code);
					}
		    		
					var balance = parseFloat(response.data.data['availableBalance']);
					var cardInfo = response.data.data['bankCards'][0];
					successFn(balance, cardInfo);

		    	}, function(error){
		    		var error_code = error.status;
		    		failedFn(error_code)
		    	});
		    },
            getRevenues:function(size,page,fromDate,toDate,sort){
                var str =  "{0}/{1}";
                var size = size || -1;
		var asc = 0;//TODO
                var api_url = str.format(config.biz_trade_service.host,config.biz_trade_service.revenue);
                api_url += "?pageSize=" + size+'&page='+page+'&fromDate='+fromDate+'&toDate='+toDate+'&asc='+asc;
                return $http({
                    method: 'GET',
                    url: api_url,

                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': User.getAuthorization()
                    }


                });
            },
            getJournal:function(size,page,fromDate,toDate,sort){
                var str =  "{0}/{1}";
                var api_url = str.format(config.account_service.host,config.account_service.propertyjournal);
                api_url += '?page='+page+'&fromDate='+fromDate+'&toDate='+toDate+'&sort='+sort;
                return $http({
                    method: 'GET',
                    url: api_url,

                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': User.getAuthorization()
                    }
                });
            },
			getQrcode:function(orderId){
                var str =  "{0}/{1}";
                var api_url2 = str.format(config.biz_trade_service.host, config.biz_trade_service.account_qrcode);
		
                api_url =api_url2.format(orderId);
                return $http({
                    method: 'GET',
                    url: api_url,

                    headers:{
                        'Content-Type': 'application/json',
						'Authorization': User.getAuthorization()
                    }
                });
            },
            createTrade: function(orderId){
                var str =  "{0}/{1}";
                var api_url2 = str.format(config.biz_trade_service.host, config.biz_trade_service.create_trade);

                api_url = api_url2.format(orderId);
                return $http({
                    method: 'POST',
                    url: api_url,

                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': User.getAuthorization()
                    }
                });
            },
			newChannl:function(tradeSerialNo){
				var str =  "{0}/{1}";
                var api_url2 = str.format(config.account_service.host,config.account_service.account_channel);
               	api_url =api_url2.format(tradeSerialNo);
				
				return $http({
                    method: 'GET',
                    url: api_url,
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': User.getAuthorization()
                    }
                });
			},
				
			getWithdraw:function(size,page,from,to,asc){
                var str =  "{0}/{1}";
                var tradeType = 2;//withdrew
                var api_url = str.format(config.account_service.host, config.account_service.get_trade);
                api_url += '?tradeType='+ tradeType;
				
                return $http({
                    method: 'GET',
                    url: api_url,
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': User.getAuthorization()
                    }
                });
            },
			
			getWithdrawDetai:function(tradeSerialNo){
                var str =  "{0}/{1}";
                var url = str.format(config.account_service.host,config.account_service.get_trade);
                url += "?tradeSerialNo=" + tradeSerialNo;
				
                return $http({
                    method: 'GET',
                    url: url,
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': User.getAuthorization()
                    }
                });
            },
		    
		    accotp:function(){
					var str =  "{0}/{1}";
	                var url = str.format(config.account_service.host, config.account_service.account_otp);
						return $http({
						 method:'GET',
						 url:url,
						 headers: {							
								'Authorization': User.getAuthorization(),
								},					 
					}) 	
			},
		 	userbankno:function(){
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
			 resetTradepswd:function(pword,cfpword,bankcard,smscode){
				 return userServiceApi.getUserSalt().then(function(response){
					var salt = response.data.data['salt'];
				 	var str =  "{0}/{1}";
					var tradepw_url = str.format(config.account_service.host, config.account_service.paypassword);
					var encrypt_password = encrypt.cryptPasswordSync(pword, salt)[0];
					var encrypt_password2 = encrypt.cryptPasswordSync(cfpword, salt)[0];
					
					 return $http({
							method: 'POST',
							url: tradepw_url,
							headers:{
								'Content-Type': 'application/json',
								'Authorization': User.getAuthorization(),
							},
							data:{
								'password': encrypt_password,
								'confirmPassword': encrypt_password2,
								'cardNo':bankcard,
								'smsCode':smscode,
							}	
					});
				 },function(response){})
			 },
	    
	    	getUserHandlingOrders:function(successFn, failedFn){//
	    		//get all user handling orders
	    		var pageSize = -1;
	   			var page = 1;
	    		var fromDate = '';
	    		var toDate = '';
	    		var sort = '';
	    		var asc = 'false';
	    		var status = 8;//handling
	    		return userServiceApi.getOrderList(pageSize, page, fromDate, toDate, sort, asc, status).then(function(response){
	    			var handlingOrderList = response.data['data'];
	    			successFn(handlingOrderList);
	    		}, function(error){
	    			//
	    			console.log('getUserHandlingOrdersError');
	    		});
	    	},

            getOrders:function(size,page,from,to,sort){
                var str =  "{0}/{1}";
                var size = size || -1;
                var api_url = str.format(config.biz_trade_service.host, config.biz_trade_service.get_user_orders);
                api_url += "?pageSize=" + size+'&page='+page+'&fromDate='+from+'&toDate='+to;
                return $http({
                    method: 'GET',
                    url: api_url,
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': User.getAuthorization()
                    }
                });
            }

         };
		return service;
	}])
})