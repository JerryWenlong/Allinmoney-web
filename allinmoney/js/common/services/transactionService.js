define(['services', 'config', 'product'], function (services, config, product) {
	services.factory('transactionService', ['$http', function($http){
		//this service is for deal the transaction
		return {
			gotoBuyProduct: function(productId){
				//get user

			},
		}
	}]);
});