define(['controllers','notifyWindow','user','sockjs','stomp','config'], function (controllers, notifyWindow, user, sockjs, stomp,config) {
	'use strict';
	controllers.controller('payConfirmController', ['$scope', 'productService', 'userService', '$routeParams','$window',
		function($scope, productService, userService, $routeParams, $window){
			$scope.showConfirm = false;
			$scope.showCardLimit = false;
			var orderId = $routeParams.orderId;
			//var tradeSerialNo = $routeParams.tradeSerialNo;
			var regPayAmount = /(\d{1,3})(?=(?:\d{3})+(?!\d))/g;
			var regPhoneNo = /(\d{3})(\d{4})(\d+)/g;
			//mock product			
			var getOrderSuccessFn = function(order){
				var order = $scope.order = order;
				order.payAmount = order.entrustAmount.toString().replace(regPayAmount,'$1,');
				order.totalAmount = order.total.toString().replace(regPayAmount,'$1,');
				var orderLeftTime =  order.ttl;//order close 15mins
				var interval = 1000;
				(function(beginStamp, interval){
					var clockSec_b = document.getElementById('clockSec_b');
					var clockSec_a = document.getElementById('clockSec_a');
					var clockmin_b = document.getElementById('clockmin_b');
					var clockmin_a = document.getElementById('clockmin_a');
					var clockhour_b = document.getElementById('clockhour_b');
					var clockhour_a = document.getElementById('clockhour_a');
					var clockhour_e = document.getElementById('clockhour_e');

					var clock = function(){
						if(beginStamp <= 0){
                            if(orderTimer) clearInterval(orderTimer);
                            clockSec_b.innerHTML = 0;
                            clockSec_a.innerHTML = 0;
                            clockmin_b.innerHTML = 0;
                            clockmin_a.innerHTML = 0;
                            clockhour_b.innerHTML = 0;
                            clockhour_a.innerHTML = 0;
                            clockhour_e.innerHTML = 0;
                            clockhour_e.style.display = 'none';

                        }else{
							var leftTime = parseInt(beginStamp / 1000);
							var oneDay = 60 * 60 * 24;
							var oneHour = 60 * 60;
							var oneMinute = 60;
							beginStamp = beginStamp - interval;
							var leftTime = parseInt(beginStamp / 1000);
							var hour = Math.floor((leftTime)/oneHour);
							var minute = Math.floor((leftTime - hour * oneHour)/oneMinute);
							var second = Math.floor((leftTime - hour * oneHour - minute * oneMinute));
							var sec_b = second%10;
							clockSec_b.innerHTML = sec_b;
							var sec_a = Math.floor(second/10);
							clockSec_a.innerHTML = sec_a;
							var min_b = minute%10;
							clockmin_b.innerHTML = min_b;
							var min_a = Math.floor(minute/10);
							clockmin_a.innerHTML = min_a;
							var hour_b = hour%10;
							clockhour_b.innerHTML = hour_b;
							var hour_a = Math.floor(hour/10)%10;
							clockhour_a.innerHTML = hour_a;
							var hour_e = Math.floor(hour/100);
							if(hour_e <= 0){
								clockhour_e.style.display = 'none';
							}
							clockhour_e.innerHTML = hour_e;
							if(leftTime <= 0){
								clearInterval(orderTimer);
							}
						}
					}
					clock();
				var orderTimer = setInterval(clock, interval);
				})(orderLeftTime, interval);
			}
			userService.getOrder(orderId, getOrderSuccessFn, function(){console.log("get order failed:" + orderId)});// get order

			//payMethod
			$scope.currentPayMethod = "0";
			
			$scope.selectCard = function(card){
				if($scope.selectedCardIndex == card.index){
					$scope.selectedCardIndex = -1;
					$scope.cards=false;
				}else{
					$scope.selectedCardIndex = card.index;
					$scope.cards=true;
				}
			}
			var getCardListSuccessFn = function(list){
				$scope.cardList = list;
				$scope.selectedCardIndex = 0;//set default
				if(list.length>0){
					$scope.cards=true;
				}
			}
			$scope.selectStyle=function(card){
				//watch card select, set style class
				var result = false;
				if(card.index == $scope.selectedCardIndex){
					result = true;
				}
				return result;
			}
			$scope.oddStyle=function(card){
				//watch card index, set style class
				var result = false;
				var n = (card.index + 1) % 2;
				if(n == 1){
					result = true;
				}
				return result;
			}
			var bankLimit={
				_hover_tips:false,
				_tips_node:null,
				_timer:null,
				container:document.getElementById('bankList'),
			}
			var containerWidth = 1098;//container width
			var limitPannelWidth = 610;//limitpannel width
			
			var	hideTips=function(){
					if(bankLimit._tips_node){
						bankLimit.container.removeChild(bankLimit._tips_node);
					}
					bankLimit._tips_node = null;
				};
			var	setTips=$scope.showCardDetail=function($event,card){
					if(bankLimit._tips_node != null){
						clearTimeout(bankLimit._timer);
						hideTips();
					}
					var pannel = document.createElement('div');
					pannel.className='card-detail-pannel';
					bankLimit._tips_node = pannel;
					var ul = document.createElement('ul');
					var title = document.createElement('li');
					title.innerHTML= card.cardName;
					ul.appendChild(title);
					var line_1 = document.createElement('li');
					line_1.innerHTML='<span class="label">卡片类型</span>' +
						'<span class="label">单笔限额</span>' +
						'<span class="label">单日限额</span>' +
						'<span class="label">当月限额</span>';
					ul.appendChild(line_1);
					var line_2 = document.createElement('li');
					line_2.innerHTML='<span class="value">' + card.cardType + '</span>' +
						'<span class="value">' + card.limited_once + '</span>' +
						'<span class="value">' + card.limited_oneday + '</span>' +
						'<span class="value">/</span>';
					ul.appendChild(line_2);
					var line_3 = document.createElement('li');
					line_3.innerHTML=card.marks;
					ul.appendChild(line_3);
					pannel.appendChild(ul);
					bankLimit.container.appendChild(pannel);
					var e = $event || window.event;
					var currentTarget = e.currentTarget || e.srcElement;
					
					var n = (card.index + 1)%2;
					
					if(n==1){
						var left_pix=currentTarget.offsetLeft - limitPannelWidth/2 + 'px';
						bankLimit._tips_node.style.left = left_pix;
					}else{
						//
						bankLimit._tips_node.style.right=10+'px';
					}
					bankLimit._tips_node.style.top = pannel.offsetTop + currentTarget.offsetTop + 15 + 'px';
				};
			var	resetTips= $scope.hideCardDetail=function(){
					bankLimit._timer = setTimeout(function(){
						if(!bankLimit._hover_tips && bankLimit._tips_node){
							hideTips();
						}
					},200);
				};
			
			
			userService.getUserBankList(getCardListSuccessFn, function(){console.log("get bankcard list error")})
			var confirmBuy = function(){
				$scope.confirmBuy = null;
				//check agree
				if(!$scope.check_protocol){
					$scope.confirmBuy = confirmBuy;
					return false;
				}
				if($scope.currentPayMethod == "0"){
					//check select card
					var selectedCard = $scope.cardList[$scope.selectedCardIndex];
					if(!selectedCard){
						$scope.confirmBuy = confirmBuy;
						return false;
					}
					openConfirmPannel();
					//opt send
				}else if($scope.currentPayMethod == "1"){
					//show 2D pic
				}
			}
			$scope.confirmBuy = confirmBuy;
			$scope.userphoneNum = user.getUserInfo().phone_num;
			var sendOtp = function(){
				var otpSendSuccessCallBack = function(error_code, message){
					if(error_code == 0){
						$scope.userphoneNum = message; 
					}else{
						//if otp failed, still need 60s for user to click again.
					}
					$scope.confirmBuy = confirmBuy;
				}
				userService.payOtp(otpSendSuccessCallBack)
			}
			var openConfirmPannel = function(){
				$scope.code = "";
				$scope.tradeCode = "";
				$scope.showConfirm = true;
			}
			$scope.sendBtnText = "发送";
			var btnStr = "重新发送({0})s";
			var sendTimer = null;
			var sendBtn = document.getElementById('sendBtn');
			var turnOffSend = false;
			var sendBtnFn = function(){
				$scope.sendBtnClick = null;
				if(sendTimer){clearInterval(sendTimer)}
				sendOtp();
				var sendSecond = 60;
				sendBtn.innerHTML = btnStr.format(sendSecond);
				allinmoney.addClass(sendBtn, 'disabled')
				sendTimer = setInterval(function(){
					sendSecond -- ;
					if(sendSecond < 0){
						$scope.sendBtnClick = sendBtnFn;
						sendBtn.innerHTML = "重新发送";
						allinmoney.removeClass(sendBtn, 'disabled')
						clearInterval(sendTimer);
						return false;
					}
					sendBtn.innerHTML = btnStr.format(sendSecond);
				},1000);
				
			}
			$scope.sendBtnClick = sendBtnFn;

			$scope.checkCode = function(){
				var re = /^[0-9]{6}$/;
				if(!re.test($scope.code)){
					$scope.codeInvalid = true;
				}else{
					//pass
					$scope.codeInvalid = false;
					return true;
				}
				return false;
			}
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
			$scope.closeConfirmPannel=function(){
				$scope.code = "";
				$scope.showConfirm = false;
				$scope.codeInvalid = false;
				$scope.tradeCodeInvalid = false;
				$scope.codeFailed = false;
				$scope.tradeCodeFailed = false;
				$scope.confirmBuy = confirmBuy;
				
			}
			
			$scope.disableConfirmBtn = function(){
				if($scope.currentPayMethod == "0"){
					if(!$scope.cards||!$scope.check_protocol){
						return true;
					}else{
						return false;
					}
				}else if($scope.currentPayMethod == "1"){
					if(!$scope.check_protocol){
						return true
					}else{
						return false;
					}
				}
			}
			
			//二维码
			var timeoutscode=null;
			$scope.scoderroe=0;
			$scope.paysucc="";
			$scope.currentPayMethodc = 0
			$scope.colseScancode=function(){
				$scope.currentPayMethod = "0";	
				$scope.currentPayMethodc = 0
			}
			
			var stompClient = null;
			
			var erros=function(error,scodemessage){
					$scope.paysucc=scodemessage;
						if(error==0){
							$scope.scoderroe=0;
						}else if(error==1){
							$scope.scoderroe=2;
							clearInterval(timeoutscode);
						}else if(error==2){
							$scope.scoderroe=2;
							$window.location.href="#/orderComplete#top";
						}else if(error==3){
							$scope.scoderroe=2;
						}		
			}

            var getTradeSerialNo=function(orderId, callback){
                userService.createTrade(orderId).then(function(response){
                        $scope.currentPayMethodc = "1";
                        if(response.status==200){
                            callback(response.data.data['tradeSerialNo']);
                        }

                },function(response){
                        if(response.status==404){
                            var notify = new notifyWindow({
                            title: '支付失败',
                            message: ['订单不存在', "已支付或过期，请重新下单支付"],
                            buttonList:[
                                    {
                                    labelText:"确认",
                                    btnClass:"btn confirm-btn"
                                    }
                                ]
                            })
                        }
                })
            }


			var getcodeimgs=function(orderId){
				userService.getQrcode(orderId).then(function(response){
						$scope.currentPayMethodc = "1";	
						if(response.status==200){
							
							$scope.scoderroe=1;
							$scope.codeimg=response.data.data['qrcode'];
							getTradeSerialNo(orderId, function(tradeSerialNo) {
                                userService.newChannl(tradeSerialNo).then(function(resp){
                                    connect(resp.data['channelId'],erros);

                                },function(resp){

                                })
							});
						}
						
				},function(response){
						$scope.currentPayMethodc = "0";	
						$scope.currentPayMethod = "0";
						if(response.status==404){
							var notify = new notifyWindow({
							title: '支付失败',
							message: ['订单不存在', "已支付或过期，请重新下单支付"],
							buttonList:[
									{
									labelText:"确认",
									btnClass:"btn confirm-btn"
									}
								]
							})
							
							//$scope.scoderroe=2;
							//$scope.paysucc='订单不存在，过期或者已支付';
						}
				})
			}
			


			
			var connect=function(channl,fn) {
				var socketUrl = String('{0}/{1}').format(config.utilService.host, config.config.utilService.socket_for_qrpay);
				var socket = new SockJS(socketUrl);
				stompClient = Stomp.over(socket);
				stompClient.connect({}, function(frame) {
					console.log('Connected: ' + frame);
					console.log('channl:'+channl);
					stompClient.subscribe('/topic/web/'+channl, function(greeting){
					var error=JSON.parse(greeting.body).error;
					var scodemessage=JSON.parse(greeting.body).message;
						console.log('e:'+error);
						console.log('wz:'+scodemessage);
						fn(error,scodemessage);
						$scope.$apply();

					});
				});
        	 }
			
			
			$scope.scanCode=function(){
				getcodeimgs(orderId);
				clearInterval(timeoutscode);
				timeoutscode=setInterval(function(){
					getcodeimgs(orderId)
				},1800000)
				$scope.tradeCode='';
			}
			
			$scope.openOrderComplete=function(){
				$window.location.href="#/orderComplete#top"	
			}
			
			
			
			$scope.seeResults=function(){
				userService.getOrder(orderId, function(order){
						switch(order.payStatus){
							case 0:
								$scope.scoderroe=2;
								$scope.paysucc='未处理'
								
							break;
							case 1:
								$scope.scoderroe=2;
								$scope.paysucc='正在支付中'
							break;
							case 2:
								$window.location.href="#/orderComplete#top";
								
							break;
							case 3:
								$scope.scoderroe=2;
								$scope.paysucc='支付失败'
							break;
							
						}
				},function(){})
			}
			
			$scope.regetcode=function(){
				$scope.scoderroe=1;
				getcodeimgs(orderId);
			}

			var payOrder = function(){
				$scope.payOrder = null;
				$scope.loading = true;
				$scope.checkCode();
				$scope.checkTradeCode();

				getTradeSerialNo(orderId, function(tradeSerialNo){
                    if(!$scope.codeInvalid && !$scope.tradeCodeInvalid){
                        var otpCode = $scope.code;
                        var tradeCode = $scope.tradeCode;
                        var acceptTos = $scope.check_protocol? 1 : 0;
                        userService.payOrder(tradeSerialNo, $scope.order.total, tradeCode, otpCode, acceptTos, payOrderSuccess, payOrderFailed)
                    }else{
                        $scope.payOrder = payOrder;
                        $scope.loading = false;
                    }
				});
			}
			$scope.payOrder = payOrder;
			var payOrderSuccess = function(responseData){
				var error_code = responseData['error'];
				var message=responseData['message'] || "";
				if(error_code == 0){
					//pay success page
					$window.location.href="#/orderComplete#top";
					$scope.closeConfirmPannel();
				}else if(error_code == 2014){
					$scope.tradeCodeErrorMessage = String("支付密码错误,还有{0}次输入机会").format(3 - responseData['failAttempts']);
					$scope.tradeCodeFailed = true;
					$scope.tradeCode='';
				}else if(error_code == 2015){
					$scope.tradeCodeErrorMessage = "密码错误多次,账号锁定";
					$scope.tradeCodeFailed = true;
					$scope.tradeCode='';
				}else if(error_code == 2007){
					$scope.codeErrorMessage = "手机动态码不正确";
					$scope.codeFailed = true;
					$scope.tradeCode='';
				}else if(error_code == 2003){
					//pay failed
					var notify = new notifyWindow({
						title:'支付失败',
						message:["支付失败", "请重新支付"],
						buttonList:[
							{
								labelText:"确认",
								btnClass:"btn confirm-btn"
							},
						]
					});
					$scope.closeConfirmPannel();
					$scope.tradeCode='';
				}else if(error_code == 2024){
					var notify = new notifyWindow({
						title: '支付失败',
						message: ['订单已过期', "请重新下单支付"],
						buttonList:[
							{
								labelText:"确认",
								btnClass:"btn confirm-btn"
							}
						]
					})
					$scope.tradeCode='';
				}else if(error_code == 2025){
					var notify = new notifyWindow({
						title: '支付失败',
						message: ['订单已支付'],
						buttonList:[
							{
								labelText:"确认",
								btnClass:"btn confirm-btn"
							}
						]
					})
					$scope.tradeCode='';
				}else if(error_code == 2028){
					var notify = new notifyWindow({
						title: '支付错误',
						message: [message],
						buttonList:[
							{
								labelText:"确认",
								btnClass:"btn confirm-btn"
							}
						]
					})
					$scope.tradeCode='';
				}
				$scope.payOrder = payOrder;
				$scope.loading = false;
				
			}
			var payOrderFailed = function(message){
				$scope.closeConfirmPannel();
				$scope.tradeCode='';
				
					var notify = new notifyWindow({
						title:'支付失败',
						message:["支付失败", message],
						buttonList:[
							{
								labelText:"确认",
								btnClass:"btn cancel-btn"
							},
						]
					});
					$scope.tradeCode='';
				
				$scope.payOrder = payOrder;
				$scope.loading = false;
			}

	}]);
})