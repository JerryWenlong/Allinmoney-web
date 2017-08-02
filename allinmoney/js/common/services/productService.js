define(['services', 'config', 'product'], function (services, config, product) {
	services.factory('productService', ['$http', function($http){
		var recommendsType = {
			trust:2,
			bank:4,
			assets:5,
		}
		var SERVER_API = {
			get_recommends_all: function(){
				// 首页热推产品（所有）
				var str =  "{0}:{1}/{2}";
				var api_url = str.format(
					config.product_service.host, 
					config.product_service.port, 
					config.product_service.recommends_all
				);
				return $http({
					method: 'GET',
					url: api_url,
					headers:{
						'Content-Type': 'application/json'
					}

				});
			},
			get_recommends: function(productType, limit){
				// 首页热推产品（所有）
				var str =  "{0}/{1}/{2}?productType={3}&limit={4}";
				var api_url = str.format(
					config.product_service.host, 
					config.product_service.recommends, 
					config.product_service.recommends_kind,
					productType,
					limit
				);
				return $http({
					method: 'GET',
					url: api_url,
					headers:{
						'Content-Type': 'application/json'
					}

				});
			},
			get_product_detail:function(prodict_id){
				//get product detail
				var str =  "{0}:{1}/{2}/{3}";
				var api_url = str.format(
					config.product_service.host, 
					config.product_service.port, 
					config.product_service.product_detail,
					prodict_id);
				return $http({
					method: 'GET',
					url: api_url,
					headers:{
						'Content-Type': 'application/json'
					}

				});
			},
            get_finacail_produce_list: function(feild,sort,n,page,filter,type){
                // 获取产品列表
                var str =  "{0}:{1}/{2}";
                var api_url = str.format(config.product_service.host, config.product_service.port, config.product_service.product);
                api_url= api_url+'?'+'type='+type+'&'+"sort="+feild+'&'+"asc="+sort+"&"+"pageSize="+n+'&'+"page="+page;
				api_url += filter;
                return $http({
                    method: 'GET',
                    url: api_url,
                    headers:{
                        'Content-Type': 'application/json'
                    }

                });
            }
		}

		var create_recommonds_list = function(response){
			var recommonds_list = [];
			var length = response.data.data.length <=3 ? response.data.data.length : 3;//default value for home page
			for (var i=0;i<length;i++){
				var dataObj = response.data.data[i];
				var productObj = new product(dataObj);
				var recommond_obj = {};
				recommond_obj.detail = productObj;
				var href_str = "#/product/{0}/#top";
				recommond_obj.href = href_str.format(productObj.productID);
				investment_type_str = productObj.type;
				recommond_obj.tagsList = [];
				recommond_obj.tagsList.push({text:investment_type_str,className:"blue-icon"})
				if(productObj.risk){
					var risk_str ="风险 {0}";
					risk_str = risk_str.format(productObj.risk);
					recommond_obj.tagsList.push({text:risk_str,className:"red-icon"});
				}
				recommonds_list.push(recommond_obj);
			}
			return recommonds_list;
		};


		var service = {
			getRecommendList: function(successFn, errorFn){
				// call API
				return SERVER_API.get_recommends_all().then(function(response){
					//success
					successFn(create_recommonds_list(response));
				},function(){
					//failed
					console.log("GET RECOMMOND LIST DATA FAILED");
				})
			},
			getBankFinancing: function(successFn, errorFn){
				// call API
				return SERVER_API.get_recommends(recommendsType.bank, 3).then(function(response){
					//success
					successFn(create_recommonds_list(response));
				}, function(){
					console.log("GET RECOMMOND BANK LIST DATA FAILED");
				});
			},
			getTrustFund:function(successFn, errorFn){
				// call API
				return SERVER_API.get_recommends(recommendsType.trust,3).then(function(response){
					successFn(create_recommonds_list(response));
				}, function(){
					console.log("GET RECOMMOND BANK LIST DATA FAILED");
				});
			},
			getAssetsProductList:function(successFn, errorFn){
				return SERVER_API.get_recommends(recommendsType.assets,3).then(function(response){
					successFn(create_recommonds_list(response));
				})
			},
			// getHotProductList: function(successFn, errorFn){
			// 	return SERVER_API.get_recommends().then(function(response){
			// 		successFn(create_recommonds_list(response));
			// 	})	
			// },
			getRankingList: function(){
				return [
					{
						order: 1,
						userName: "某某****moumou",
						mount: "1,496,534"
					},
					{
						order: 2,
						userName: "某某****moumou",
						mount: "1,496,534"
					},
					{
						order: 3,
						userName: "某某****moumou",
						mount: "1,496,534"
					},
					{
						order: 4,
						userName: "某某****moumou",
						mount: "1,496,534"
					},
					{
						order: 5,
						userName: "某某****moumou",
						mount: "1,496,534"
					},
					{
						order: 6,
						userName: "某某****moumou",
						mount: "1,496,534"
					},
				];
			},
			getProductDetail:function(productID, successFn, errorFn){
				return SERVER_API.get_product_detail(productID).then(function(response){
					successFn(new product(response.data.data));
				},function(error){
					console.log("FAILED TO GET PRODUCT DETAIL, productID:" +  productID);
				});
				
			},
			bindDetailForPage: function(product){
				var page_detail = product;
				page_detail.details = [
					{
						label:"起购金额",
						value:String("{0}{1}").format(product.min_sub_amount.value, product.min_sub_amount.unit)
					},
					{
						label:"管理费",
						value:String("{0}{1}").format(product.fares_manage.value, product.fares_manage.unit)
					},
					{
						label:"认购费率",
						value:String("{0}{1}").format(product.sub_rate.value, product.sub_rate.unit)
					},
					{
						label:"手续费",
						value:String("{0}{1}").format(product.fares_charge.value, product.fares_charge.unit)
					},
					{
						label:"赎回费率",
						value:String("{0}{1}").format(product.fares_backrate.value,product.fares_backrate.unit)
					},
					{
						label:"发行机构",
						value: product.company
					},
					{
						label:"投资期限",
						value:String("{0}{1}").format(product.end_time.numb, product.end_time.unit) 
					},
					{
						label:"产品库存",
						value:String("{0}{1}").format(product.productAvailableQuota, '份')
					},
					{
						label:'产品单价',
						value:String("{0}{1}").format(product.unit.value, product.unit.unit)
					}
				];
				page_detail.details_data_1=[
					{
						label:"产品名称",
						value:product.title,
					},
					{
						label:"产品代码",
						value:product.code
					},
					{
						label:"产品类型",
						value:product.type,
					},
					{
						label:"收益类型",
						value:product.incomeType,
					},
					{
						label:"投资类别",
						value:product.investType,
					},
					{
						label:"发行机构",
						value:product.company
					},
					{
						label:"风险等级",
						value:product.risk
					}
				];
				page_detail.details_data_2=[
					{
						label:"预期年化收益率",
						value: String("{0}{1}").format(product.expected_revenue.value, product.expected_revenue.unit),
					},
					{
						label:"分红方式",
						value:product.dividendType
					},
					{
						label:"付息频率",
						value:product.interestFrequency
					},
					{
						label:"认购费率",
						value: String("{0}{1}").format(product.sub_rate.value, product.sub_rate.unit),
					},
					{
						label:"回购费率",
						value:String("{0}{1}").format(product.fares_backrate.value,product.fares_backrate.unit)
					},
					{
						label:"管理费",
						value:String("{0}{1}").format(product.fares_manage.value, product.fares_manage.unit)
					},
					{
						label:"手续费",
						value:String("{0}{1}").format(product.fares_charge.value, product.fares_charge.unit)
					}
				];
				page_detail.details_data_3=[
					{
						label:"投资期限",
						value:String("{0}{1}").format(product.end_time.numb, product.end_time.unit),
					},
					{
						label:"募集规模",
						value:String("{0}元").format(product.productMaxBalance)
					},
					{
						label:"赎回到账时间",
						value:"无"
					},
					{
                        label:"产品成立日",
                        value:product.start_date
                    },
                    {
                        label:"产品到期日",
                        value:product.end_date
                    },
                    {
                        label:"募集开始日",
                        value:product.ipo_start_date
                    },
                    {
                        label:"募集结束日",
                        value:product.ipo_end_date
                    },
					{
						label:"托管人",
						value:product.trustee
					}
				];
				return page_detail;
			},
			getProductShowList:function(finacial_type, successFn, errorFn){
				var list = [];
				return SERVER_API.get_recommends(recommendsType[finacial_type],3).then(function(response){
					var dataList = response.data;
					var len = dataList.length;
					for(var i=0;i<len;i++){
						list.push(new product(dataList[i]));
					}
					successFn(list);
				}, function(){
					errorFn();
				});
			},
			productAnnouncementList:[
			],
			productBankFilterLimitedList: function (argument) {
				// body...
				return [
					{
						title:"起投金额",
						api_field:"minSubBalance",
						index: 0,
						lines: [1],
						expand_status: 0,
						selectList:[
							{title:"不限", code:"unlimited", index:0}, 
							{title:"1万元以下", value_start:"none", value_end:10000, index:1, lineNum:1},
							{title:"1到5万", value_start:10000, value_end:50000, index:2, lineNum:1},
							{title:"5到20万", value_start:50000, value_end:200000, index:3, lineNum:1},
							{title:"20到50万", value_start:200000, value_end:500000, index:4, lineNum:1},
							{title:"50万以上", value_start:500000, value_end:"none", index:5, lineNum:1}
						],
						selectIndex: 0,
					},
					{
						title:"投资周期",
						api_field:"investmentPeriod",
						index:1,
						lines: [1],
						expand_status:0,
						selectList:[
							{title:"不限", code:"unlimited", index:0}, 
							{title:"6个月以下", value_start:"none", value_end:180, index:1, lineNum:1}, 
							{title:"6到12个月", value_start:180, value_end:365, index:2, lineNum:1},
							{title:"12个月以上", value_start:365, value_end:"none", index:3, lineNum:1}
						],
						selectIndex:0
					},
					{
						title:"年收益率",
						api_field:"annualizedRate",
						index:2,
						lines: [1],
						expand_status:0,
						selectList:[
							{title:"不限", code:"unlimited", index:0},
							{title:"6%以下", value_start:"none", value_end:0.06, index:1, lineNum:1},
							{title:"6%-8%", value_start:0.06, value_end:0.08, index:2, lineNum:1},
							{title:"8%-10%", value_start:0.08, value_end:0.1, index:3, lineNum:1},
							{title:"10%以上", value_start:0.1, value_end:"none", index:4, lineNum:1}
						],
						selectIndex:0
					},
				];
			},
			productAssetFilterLimitedList:function(){
				return [
					{
						title:"起投金额",
						api_field:"minSubBalance",
						index: 0,
						lines: [1],
						expand_status: 0,
						selectList:[
							{title:"不限", code:"unlimited", index:0}, 
							{title:"10万以下", value_start:"none", value_end:100000, index:1, lineNum:1},
							{title:"10-100万", value_start:100000, value_end:1000000, index:2, lineNum:1},
							{title:"100-300万", value_start:1000000, value_end:3000000, index:3, lineNum:1},
							{title:"300万以上", value_start:3000000, value_end:"none", index:4, lineNum:1}
						],
						selectIndex: 0,
					},
					{
						title:"投资期限",
						api_field:"investmentPeriod",
						index:1,
						lines: [1],
						expand_status:0,
						selectList:[
							{title:"不限", code:"unlimited", index:0}, 
							{title:"1年以下", value_start:"none", value_end:365, index:1, lineNum:1}, 
							{title:"1年-2年", value_start:365, value_end:730, index:2, lineNum:1},
							{title:"2年以上", value_start:730, value_end:"none", index:3, lineNum:1}
						],
						selectIndex:0
					},
					{
						title:"年收益率",
						api_field:"annualizedRate",
						index:2,
						lines: [1],
						expand_status:0,
						selectList:[
							{title:"不限", code:"unlimited", index:0},
							{title:"6%以下", value_start:"none", value_end:0.06, index:1, lineNum:1},
							{title:"6%-8%", value_start:0.06, value_end:0.08, index:2, lineNum:1},
							{title:"8%-10%", value_start:0.08, value_end:0.1, index:3, lineNum:1},
							{title:"10%以上", value_start:0.1, value_end:"none", index:4, lineNum:1}
						],
						selectIndex:0
					},
				];
			},
			productTrustFilterLimitedList:function(){
				return [
						{
							title:"起投金额",
							api_field:"minSubBalance",
							index: 0,
							lines: [1],
							expand_status: 0,
							selectList:[
								{title:"不限", code:"unlimited", index:0}, 
								{title:"50万以下", value_start:"none", value_end:500000, index:1, lineNum:1},
								{title:"50-100万", value_start:500000, value_end:1000000, index:2, lineNum:1},
								{title:"100-300万", value_start:1000000, value_end:3000000, index:3, lineNum:1},
								{title:"300万以上", value_start:3000000, value_end:"none", index:4, lineNum:1}
							],
							selectIndex: 0,
						},
						{
							title:"投资期限",
							api_field:"investmentPeriod",
							index:1,
							lines: [1],
							expand_status:0,
							selectList:[
								{title:"不限", code:"unlimited", index:0}, 
								{title:"1年以下", value_start:"none", value_end:365, index:1, lineNum:1}, 
								{title:"1年-2年", value_start:365, value_end:730, index:2, lineNum:1},
								{title:"2年以上", value_start:730, value_end:"none", index:3, lineNum:1}
							],
							selectIndex:0
						},
						{
							title:"年收益率",
							api_field:"annualizedRate",
							index:2,
							lines: [1],
							expand_status:0,
							selectList:[
								{title:"不限", code:"unlimited", index:0},
								{title:"8%以下", value_start:"none", value_end:0.08, index:1, lineNum:1},
								{title:"8%-10%", value_start:0.08, value_end:0.1, index:2, lineNum:1},
								{title:"10%-12%", value_start:0.1, value_end:0.12, index:3, lineNum:1},
								{title:"12%以上", value_start:0.12, value_end:"none", index:4, lineNum:1}
							],
							selectIndex:0
						},
					];
			},
            getFinacialProduct:function(feild,sort,n,pagen,currentbutton,filterList,type,successFn, errorFn){
                var list = [];
                var filterStr = "";
                for(var i=0;i<filterList.length;i++){
                	var filter = filterList[i];
                	if (filter.selectIndex != 0){
                		var str = "&{0}={1},{2}";
                		var min = filter.selectList[filter.selectIndex].value_start == "none"? 0 : filter.selectList[filter.selectIndex].value_start;
                		var max = filter.selectList[filter.selectIndex].value_end == "none"? "" : filter.selectList[filter.selectIndex].value_end;
                		filterStr += str.format(filter.api_field, min, max);
                	}
                }
                return SERVER_API.get_finacail_produce_list(feild,sort,n,pagen,filterStr,type).then(function(response){
                    var dataList = response.data.data;
                    var len = dataList.length;
                    for(var i=0;i<len;i++){
                        list.push(new product(dataList[i]));
                    }
                    successFn(list,response.data.paging,feild,sort,currentbutton);
                }, function(){
                    errorFn();
                });
            },
		}

		return service;
	}]);
})