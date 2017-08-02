define(['allbase','config', 'user', 'notifyWindow'], function (allinmoney, config, user, notifyWindow){
	var actionObj = allinmoney.derive(null, {
			create:function(){
				this.initAction();
			},
			initAction: function(){
				this.initWithdraw();
				this.initTempCreateOrder();
				this.initTempPayOrder();
			},
			initWithdraw:function(){
				this.withdrawAmount=0;
			},
			initTempCreateOrder:function(){
				this.setTradeKeyBack = null;
				this.currentProductPage="";
				this.currenttransactionAmount="";
			},
			initTempPayOrder:function(){
				this.orderProductName = "";
			},
			setTempCurrentOrder:function(currentPage, transactionAmount, productTitle){
				this.currentProductPage = currentPage;
				this.currenttransactionAmount = transactionAmount;
				this.orderProductName = productTitle;
			},
			withdrawStr:function(){
				return allinmoney.regPayAmount(this.withdrawAmount);
			},
			fogetTradeCode: function(){

			},
			routeChange: function(prevLocation, prevParams, currentLocation, currentParams){
				if(currentLocation != 'pages/withdraw.html' && (currentParams && currentParams.setp != 'stepThree')){
					this.initWithdraw();
				}
				if(currentLocation != 'pages/productDetail.html' && currentLocation != 'pages/tradepw.html' && currentLocation != 'pages/bindingCard.html'){
					this.initTempCreateOrder();
					user.clearPayAmount();
				}
			},
		}
	,{});

	return actionObj;
})