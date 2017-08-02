define(['controllers'], function(controllers){
	'use strict';
	controllers.controller('recommendController', ['$scope', 'productService', '$window', function($scope, productService, $window){
		var getRecommendListCallBack = function(datalist){
			var recommendProdList = $scope.recommendProdList = datalist;
		};
		var errorCallBack = function(){};
		productService.getRecommendList(getRecommendListCallBack, errorCallBack);
		$scope.hotProductList = [];

		$scope.bankContainerTitle = "银行理财";
		$scope.trustFundContainerTitle = "信托产品";
		$scope.hotContainerTitle = "热推";
		$scope.assetsContainerTitle = "资管产品";
		var getBankFinancingCallBack = function(datalist){
			$scope.bankFinancing_first = datalist[0];
			$scope.bankFinancing_second = datalist[1];
			$scope.bankFinancing_third = datalist[2];
			datalist[0]? $scope.hotProductList.push(datalist[0]):null;
		};
		productService.getBankFinancing(getBankFinancingCallBack, errorCallBack);

		var getTrustFundCallBack = function(datalist){
			$scope.assets_first = datalist[0];
			$scope.assets_second = datalist[1];
			$scope.assets_third = datalist[2];
			datalist[0]? $scope.hotProductList.push(datalist[0]):null;
		}
		productService.getAssetsProductList(getTrustFundCallBack, errorCallBack);

		var getTrustProductCallBack = function(datalist){
			$scope.fundProductList = datalist;
			datalist[0]? $scope.hotProductList.push(datalist[0]): null;
		}
		productService.getTrustFund(getTrustProductCallBack, errorCallBack);

		var rankingList = $scope.rankingList = productService.getRankingList();

		$scope.gotoDetail = function(url){
			if(url){
				$window.location.href = url;
			}
		}
		$scope.checkRecommend = function(product) {
			// body...
			if(!product){
				return true
			}
			return false
		}
	}])
})