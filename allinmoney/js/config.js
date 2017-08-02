define([], function () {
	// config
	bank_icon_base="/img/banklogo_80x50/{0}";
	debug=true;
	return {
        pay_service:{
            host: debug? 'https://unstable-payment-service.allinmoney.com':'https://{{stack}}-payment-service.{{dns_name}}',
            port:'443',
            cardbin: 'payments/banks/cardbins',
            province: 'payments/banks/provinces'
        },
        account_service:{
            host: debug? 'https://unstable-account-service.allinmoney.com':'https://{{stack}}-account-service.{{dns_name}}',
			host2:debug? 'wss://unstable-account-service.allinmoney.com':'wss://{{stack}}-account-service.{{dns_name}}',
            port:'443',
            cards: 'account/cards',
            paypassword:'account/password',
			get_user_bank: 'account/cards',
 			payorder:'trades/pay',
           	get_pay_otp:'account/pay/otp',
           	withdraw_authorize: 'account/withdraw/password/validate',
           	withdraw_confirm:'account/withdraw',
           	get_trade:'trades',
			propertyjournal:'account/balance/journal',
			account_tradingpword:'account/password/validate',
			account_otp:'account/cards/otp',
			account_setnewpword:'account/password',
			account_account:'account/password/reset/validate',
			account_postacco:'account/password/reset',
			account_resetpword:"account/password/reset",
			
			rest_trade_password_otp:"account/password/reset/otp",//get
			set_trade_password_otp:"account/password/otp", //get
			
			
			account_channel:"/trades/{0}/channel",
			
			
        },
        biz_account_service:{
        	host: debug? 'https://unstable-biz-account-service.allinmoney.com':'https://{{stack}}-biz-account-service.allinmoney.com',
        	get_account_info: 'account',
			
        },
        biz_trade_service:{
        	host: debug? 'https://unstable-biz-trade-service.allinmoney.com':'https://{{stack}}-biz-trade-service.allinmoney.com',
        	get_user_orders: 'orders',
        	create_order:'orders',
        	create_trade:'orders/{0}/trade',
        	account_paystatus:"orders", // TODO Change to biz get order,
			account_qrcode:"orders/{0}/qrcode",
			revenue: 'revenues',
        },
		user_service:{
			host: debug? 'https://unstable-user-service.allinmoney.com':'https://{{stack}}-user-service.{{dns_name}}',
			port:'443',
			user_register: 'user/signup',
			user_login: 'user/signin',
			user_signout: 'user/signout',
			user_salt:'user/signin/salt',
    		user_captcha: 'user/captcha/validate',
    		user_captcha_get: 'user/captcha/captcha.jpg',
    		user_validate:'user/signup/validate',
    		user_signup_otp:'user/signup/otp',
		user_quick_signup_otp:'user/signup/quick/otp',
    		user_quick:'user/signup/quick',
    		user_request:'user/password/reset/token',
    		user_requestoptforget:'user/password/reset/otp',
    		user_checkoptforget:'user/password/reset/otp/validate',
    		user_password_reset:'user/password/reset',
            	user_captcha_get_token:'user/captcha'
		},
		product_service:{
			host: debug? 'https://unstable-biz-product-service.allinmoney.com':'https://{{stack}}-product-service.{{dns_name}}',
			port:'443',
			recommends_all:'products/recommends/all',
			recommends:'products/recommends/billboard',
			recommends_kind:'balance',
			// recommends_bank:'product/recommends/bank',
			// recommends_trust:'product/recommends/trust',
			// recommends_hot:'product/recommends/hot',
			// recommends_assets:'product/recommends/assets',
			product_detail:'products',
            finacial_product:'products/bank',
            product:'products'
		},
		util_service:{
			host: debug? 'https://unstable-util-service.allinmoney.com':'https://{{stack}}-util-service.{{dns_name}}',
			socket_for_qrpay: 'web',
		},
		auth_str: 'Bearer',
		login_page: '/login.html',
		home_page:'/index.html',
		product_list_type:{
			service:1,
			trust:2,
			insurance:3,
			bank:4,
			assets:5,
			stock:6
		},
		bank_icon:{
			"102":{
				name:"工商银行",
				logo:bank_icon_base.format("logo_guangda.png")
			},
			"103":{
				name:"农业银行",
				logo:bank_icon_base.format("logo_nongye.png")
			},
			"104":{
				name:"中国银行",
				logo:bank_icon_base.format("logo_zhongguo.png")
			},
			"105":{
				name:"建设银行",
				logo:bank_icon_base.format("logo_jianshe.png")
			},
			"301":{
				name:"交通银行",
				logo:bank_icon_base.format("logo_jiaotong.png")
			},
			"308":{
				name:"招商银行",
				logo:bank_icon_base.format("logo_zhaoshang.png")//no pic
			},
			"100":{
				name:"邮政储蓄银行",
				logo:bank_icon_base.format("logo_youzheng.png")
			},
			"306":{
				name:"广发银行",
				logo:bank_icon_base.format("logo_guangfa.png")
			},
			"309":{
				name:"兴业银行",
				logo:bank_icon_base.format("logo_xingye.png")
			},
			"303":{
				name:"光大银行",
				logo:bank_icon_base.format("logo_guangda.png")
			},
			"307":{
				name:"平安银行",
				logo:bank_icon_base.format("logo_pingan.png")
			},
			"305":{
				name:"民生银行",
				logo:bank_icon_base.format("logo_minsheng.png")
			},
			"302":{
				name:"中信银行",
				logo:bank_icon_base.format("logo_zhongxin.png")
			},
			"310":{
				name:"浦发银行",
				logo:bank_icon_base.format("logo_pufa.png")
			},
			"4031000":{
				name:"北京银行",
				logo:bank_icon_base.format("logo_beijing.png")
			},
			"304":{
				name:"华夏银行",
				logo:bank_icon_base.format("logo_huaxia.png")//no logo
			},
			"401":{
				name:"上海银行",
				logo:bank_icon_base.format("logo_shanghai.png")//no logo
			}
		}
	}
})
