define(["allbase",'config'], function (allinmoney, config){
	var service = allinmoney.derive(null, {
		create: function (request) {
			this.method = request.method;
		}
	}, {})
})