define(['controllers', 'user', 'notifyWindow', 'allbase'], function(controllers, User, notifyWindow, allinmoney){
	'use strict';
	controllers.controller('productPageController',[
		'$scope',
		'commonService',
		'productService',
		'userService',
		'$routeParams', 
		'$filter',
		'$location',
		'$window',
		function($scope, commonService, productService, userService, $routeParams, $filter,  $location, $window){
			commonService.categoryShowTrigger($scope, {isHomePage: false});
			var getProductCallBack = function(data){
				var product = $scope.product =productService.bindDetailForPage(data);
				$scope.placeholder = String("{0}{1}起投, {2}{3}的倍数").format(
					product.min_sub_amount.value, product.min_sub_amount.unit, product.unit.value, product.unit.unit);
				$scope.unitInfo = String("购买金额必须是{0}的倍数").format(product.unit.value);
				if(product.status >= 1 && product.status <= 4){
					if(product.productAvailableQuota <= 0){
						$scope.product.sellStatus = 'sellOut';
					}else{
						$scope.product.sellStatus = 'canBuy';
					}
				}else{
					$scope.product.sellStatus = 'stopBuy';
				}
				$scope.getProductSellStatus = function (status) {
					return $scope.product.sellStatus == status;
				}
			};
			var errorCallBack = function(){};
			productService.getProductDetail($routeParams._id, getProductCallBack, errorCallBack); 
			
			var MOCK = $scope.MOCK = {};
			MOCK.focus = true;
			MOCK.sell_status = 1;
			$scope.hasFocusProduct = function(){
				return MOCK.focus;// get item focused
			};
			$scope.focusProduct = function(){
				//do focus 
				MOCK.focus = true;
			};
			$scope.cancelFocusProduct = function(){
				//do cancel focus
				MOCK.focus = false;
			};
			var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
			$scope.roundData = {
				labels : ["January","February","March","April","May","June","July"],
				datasets : [
					{
						fillColor : "rgba(220,220,220,0.5)",
						strokeColor : "rgba(220,220,220,0.8)",
						highlightFill: "rgba(220,220,220,0.75)",
						highlightStroke: "rgba(220,220,220,1)",
						data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
					},
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,0.8)",
						highlightFill : "rgba(151,187,205,0.75)",
						highlightStroke : "rgba(151,187,205,1)",
						data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
					}
				]
			};

			var tabMenus = $scope.tabMenus = [
				{
					index:0,
					title:"产品详细",
					selected:false
				},
				// {
				// 	index:1,
				// 	title:"产品公告",
				// 	selected:false
				// },
				// {
				// 	index:2,
				// 	title:"常见问题",
				// 	selected:false
				// }
			];
			

			var changeTab = $scope.changeTab = function(index){
				if(cuttentTab != null){
					cuttentTab.selected = false;
				}
				cuttentTab = tabMenus[index];
				cuttentTab.selected = true;
			}
			var showTab = $scope.showTab = function(tabIndex){
				return tabIndex == cuttentTab.index ;
			}
			var cuttentTab = $scope.cuttentTab = null;
			changeTab(0); //set default

			//get announcement
			var anouncePageSize = 8;
			$scope.currentAnouncePage =1;
			$scope.selectAnouncePage =-1;
			var amount = $scope.amount = 50;
			var hasMoreAnounceData = false;
			$scope.hasNextPage=false;
			$scope.hasPrevPage=false;
			var cacheData = [];

			function getPuList(start, amount, category_id){

			}
			function setViewItem(){
				var announcementList=[];
				var start = ($scope.selectAnouncePage%(amount/anouncePageSize) -1) * anouncePageSize;
				var end = start + anouncePageSize;
				end = (cacheData.length - 1) >= end? end:cacheData.length ;
				for(var i=start ; i<end; i++){
					announcementList.push(cacheData[i]);
				}
				$scope.announcementList = announcementList;
				$scope.currentAnouncePage = $scope.selectAnouncePage;
				$scope.hasPrevPage = $scope.currentAnouncePage <=1 ? false : true;
				$scope.hasNextPage = (!hasMoreAnounceData && (cacheData.length - 1) <= start + anouncePageSize) ? false:true;
			}
			function showList(selectPage, currentPage){
				if(Math.ceil(selectPage*anouncePageSize/amount) != Math.ceil(currentPage*anouncePageSize/amount)){
					//getPuList TODO
					cacheData = productService.productAnnouncementList;
					hasMoreAnounceData = false;
				}
				cacheData = productService.productAnnouncementList;//for mock data
				hasMoreAnounceData = false;
				$scope.selectAnouncePage = selectPage;
				setViewItem();
			}
			$scope.prevAnnouncementPage = function(){
				$scope.selectAnouncePage = $scope.currentAnouncePage - 1;
				showList($scope.selectAnouncePage, $scope.currentAnouncePage);
			}
			$scope.nextAnnouncementPage = function(){
				$scope.selectAnouncePage = $scope.currentAnouncePage + 1;
				showList($scope.selectAnouncePage, $scope.currentAnouncePage);
			}
			showList(1, 1);

			//payment
			$scope.transactionAmount = allinmoney.action.currenttransactionAmount || User.getPayAmount() || "";
			
			$scope.checkTranscationAmount = function(){
				// var re = /^\+?[1-9][0-9]*$/;
				var re = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
				if(!re.test($scope.transactionAmount)){
					$scope.patternAmountInvalid = true;
				}else{
					if($scope.transactionAmount % $scope.product.unit.value != 0){
						$scope.patternAmountUnitInvalid = true;
					}else{
						$scope.patternAmountUnitInvalid = false;
					}
					$scope.patternAmountInvalid = false;
				}

			};

			var createOrderSuccess=function(orderId){
				notifyWindow.closeWindow();
				var url = '#payconfirm/{0}';
				$window.location.href=url.format(orderId);
			};
			var bindCard = function(){
				allinmoney.action.setTradeKeyBack = setTradeKeyCallback;
				$window.location.href='#/binding';
			}
			var setTradeKey = function(){
				allinmoney.action.setTradeKeyBack = setTradeKeyCallback;
				$window.location.href="#/tradepw";
			}
			var setTradeKeyCallback = function(){
				//create order again
				allinmoney.action.setTradeKeyBack = null;
				$window.location.href=allinmoney.action.currentProductPage;
			}
			var createOrderFailed=function(error_code, error_message){
				notifyWindow.closeWindow();
				if(error_code == 41002){
					//go to bind bank card. open tip window
					var notify = new notifyWindow({
						title:'交易提示',
						message:"您还没有绑定银行卡",
						buttonList:[
							{
								labelText:"去绑定",
								btnClass:"btn confirm-btn",
								clickFn:bindCard,
							},
							{
								labelText:"取消",
								btnClass:"btn cancel-btn"
							},
						]
					});
				}else if(error_code == 41001 || error_code == 41005 || error_code == 41004 || error_code == 41003 || error_code == 41006){
					//notify user 		
					var notify = new notifyWindow({
						title:'交易提示',
						message:error_message,
						buttonList:[
							{
								labelText:"取消",
								btnClass:"btn cancel-btn"
							},
						]
					});
				}else{
					var notify = new notifyWindow({
						title:'交易提示',
						message:"交易出错",
						buttonList:[
							{
								labelText:"取消",
								btnClass:"btn cancel-btn"
							},
						]
					});
				}
				$scope.createOrder = createOrder;
			};
			var createOrder=function(){
				$scope.createOrder = "";
				//check if login
				var userInfo = User.getUserInfo();
				if(!userInfo.has_login){
					if(!$scope.patternAmountInvalid && !$scope.patternAmountUnitInvalid){
						//catch payAmount
						User.catchPayAmount($scope.transactionAmount);
					}
					//go to login
					var currentPage = $location.absUrl();
					User.gotoLogin({backUrl:currentPage});
					return false;
				}
				//check transactionAmount
				$scope.checkTranscationAmount();
				if($scope.patternAmountInvalid || $scope.patternAmountUnitInvalid){
					$scope.createOrder = createOrder;
					return false;
				}
				//create order
				var warp = new notifyWindow({
					loading:true
				});
				var currentPage = $location.absUrl();
				allinmoney.action.setTempCurrentOrder(currentPage, $scope.transactionAmount, $scope.product.title);
				userService.createOrder($scope.product.productID, $scope.transactionAmount, createOrderSuccess,createOrderFailed);
						
			}
			$scope.createOrder = createOrder;			
		}]);
})