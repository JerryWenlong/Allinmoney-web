define(["allbase"], function (allinmoney) {
	var RISK_GRADE_LIST = ["默认", "低", "中低", "中", "中高", "高", "极高"];
	var RISK_GRADE = function(n){
		return RISK_GRADE_LIST[n];
	}
	var PRODUCT_TYPE_LIST = ["服务产品", "信托", "保险", "银行理财", "证券理财", "股权"];
	var PRODUCT_TYPE = function(n){
		return PRODUCT_TYPE_LIST[n-1];
	}
	var FARES_TYPE_LIST = ["手续费", "管理费"];
	var FARES_TYPE = function(n){
		return FARES_TYPE_LIST[n];
	}
	var INCOME_LIST = ["未知","保本固定收益", "保本浮动收益", "非保本浮动收益"];
	var INCOME_TYPE = function(n){
		if (n == 9){
			return "其他"
		}else{
			return INCOME_LIST[n];
		}
	}
	var INVEST_LIST = ["未知"," 固定收益类", "权益类", "期货融资融券类", "复杂高风险类", "其他"];
	var INVEST_TYPE = function(n){
		return INVEST_LIST[n]; 
	}
	var DIVIDEND_LIST = ["份额分红","现金分红"];
	var DIVIDEND_TYPE = function(n){
		return DIVIDEND_LIST[0];
	}

	var productObj = allinmoney.derive(null, {
		initProduct: function(serverData){
			this.productID = serverData.id; //产品ID
			this.taNo = serverData.taNo; //产品TA编号
			this.title = serverData.name;//产品名称
			this.code = serverData.code;//产品代码
			this.company = serverData.companyName;//产品公司 发行机构
			this.type = PRODUCT_TYPE(serverData.type);//投资类型 
			this.status = serverData.status//产品状态 1:开放期 2:认购期 3:预约认购期 4:产品成立 5:产品终止 6:停止交易 7:停止申购 8:停止赎回
			this.start_date = serverData.productBeginTime.split("T")[0]; // 产品成立日期 TIMESTAMP
			this.end_date = serverData.productEndTime.split("T")[0]; //产品结束日期 TIMESTAMP
            this.ipo_start_date = serverData.ipoBeginTime.split("T")[0]; // 募集成立日期 TIMESTAMP
            this.ipo_end_date = serverData.ipoEndTime.split("T")[0]; //募集结束日期 TIMESTAMP
			this.end_time = {numb: serverData.investmentPeriod, unit:"天"};//产品期限 投资期限
			this.risk = RISK_GRADE(serverData.riskLevel);//风险等级 0:默认等级 1:保本等级 2:低风险等级 3:中风险等级 4:高风险等级
			this.expected_revenue = {value: this.decimal(serverData.annualizedRate * 100, 2), unit:"%"};//预期年收益率
			this.trustee = serverData.trustee;//托管人
			// this.sub_rate = {value:serverData.subRate, unit:"%"};//认购费率
			this.unit = {value:serverData.subUnit, unit:"元"};//单份价格 认购最小单位

			this.fares_charge = {value: "/", unit:""};//手续费
			this.fares_yinhua = {value: "/", unit:""};//印花税
			this.fares_manage = {value: "/", unit:""};//管理费
			this.sub_rate = {value:"/", unit:""};//认购费率
			this.fares_backrate =  {value:"/", unit:""};//赎回费率
			if (allinmoney.isArray(serverData.fares) && serverData.fares.length>0){
				for (var i=0; i < serverData.fares.length;i++){
					var fare = serverData.fares[i];
					switch(fare.type){
						case 0: this.fares_charge = {value: this.decimal(fare.ratio * 100, 2), unit:"%"};break;//手续费;
						case 1: this.fares_yinhua = {value: this.decimal(fare.ratio * 100, 2), unit:"%"};break;//印花税;
						case 2: this.fares_manage = {value: this.decimal(fare.ratio * 100, 2), unit:"%"};break;//管理费;
						case 3: this.sub_rate = {value: this.decimal(fare.ratio * 100, 2), unit:"%"};break;//认购费率;
						case 4: this.fares_backrate = {value: this.decimal(fare.ratio * 100, 2), unit:"%"};break;//赎回费率;
					}
				}
			}

			// this.max_sub_amount = {value: serverData.max_sub_amount, unit:"元"}//单日申购最高金额
			this.min_sub_amount = {value: serverData.minSubBalance, unit:"元"}//最低认购金额 起购金额
			this.incomeType = INCOME_TYPE(serverData.incomeType);//收益类型
			this.investType = INVEST_TYPE(serverData.investType);//投资类别
			this.dividendType = DIVIDEND_TYPE(serverData.dividendType);//分红方式
			this.interestFrequency = serverData.interestFrequency;//付息频率
			this.productMinBalance = serverData.productMinBalance;//最低募集金额
			this.productMaxBalance = serverData.productMaxBalance;//最大募集金额
			this.productAvailableQuota = serverData.productAvailableQuota;//产品库存
			this.productProgress = {value: this.decimal(serverData.productProgress * 100, 2), unit:"%"};//产品进度
			this.others =  serverData.others || "";
		},
		create:function(serverData){
			this.initProduct(serverData);
		},
		decimal:function(num, v){
			var vv = Math.pow(10, v);
			return Math.round(num*vv)/vv;
		}
		//end of include
	}, {
		//end of extend
	});

	return productObj
});