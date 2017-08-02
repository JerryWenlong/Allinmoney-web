define(["allbase",'config'], function (allinmoney, config){
	var sStorage = {
		getItem:function(c_name){
			if(document.cookie.length>0){
				c_start=document.cookie.indexOf(c_name + "=");
				if(c_start != -1){
					c_start = c_start + c_name.length +1;
					c_end=document.cookie.indexOf(";",c_start)
				    if (c_end==-1) c_end=document.cookie.length
			    	return unescape(document.cookie.substring(c_start,c_end))
				    }
				}
			return "";
		},
		setItem:function(c_name, value, expireDays){
			var expireDays = expireDays || 365;
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expireDays);
			document.cookie=c_name + "=" + escape(value) + 
			((expireDays == null)? "" : ";expires=" + exdate.toGMTString());
		},
		removeItem:function(c_name){
			this.setItem(c_name,"",-1000);
		}
	}
	var lStorage = window.localStorage;
	var login_address = config.login_page;
	var home_address = config.home_page;

	var User = { // extend. add to obj self not to prototype
		getUserTemp: function(){
			var user_name = sStorage.getItem("loginuser");
			var token = sStorage.getItem("token");
			var phoneNum = sStorage.getItem("phoneNum");
			var has_login = user_name? true : false;
			return {user_name:user_name, token:token, has_login:has_login, phone_num:phoneNum};
		},
		getUserLocally: function(){
			var user_name = lStorage.getItem("loginuser");
			var token = lStorage.getItem("token");
			var phoneNum = lStorage.getItem("phoneNum");
			var has_login = user_name? true : false;
			return {user_name:user_name, token:token, has_login:has_login, phone_num:phoneNum};
		},
		clearUserTemp: function(){
			sStorage.removeItem('loginuser');
			sStorage.removeItem('token');
			sStorage.removeItem('phoneNum');
			sStorage.removeItem('loginBackUrl');
			sStorage.removeItem('payAmount');
		},
		clearUserLocally: function(){
			lStorage.removeItem('loginuser');
			lStorage.removeItem('token');
			lStorage.removeItem('phoneNum');
		},
		logout: function(){
			this.clearUserTemp();
			this.clearUserLocally();
		},
		getUserInfo:function(){
			var loginInfo = this.getUserTemp();
			var autoLoginInfo = this.getUserLocally();
			var userInfo = loginInfo.has_login?  loginInfo : autoLoginInfo;
			return userInfo;
		},
		gotoLogin:function(param){
			var backUrl = '/index.html';
			if(param){
				backUrl = param.backUrl || backUrl; 
			}
			sStorage.setItem('loginBackUrl', backUrl);
			window.location.href= login_address;
		},
		catchPayAmount: function(payAmount){
			sStorage.setItem('payAmount', payAmount);
		},
		getPayAmount: function(){
			var payAmount = sStorage.getItem('payAmount');
			sStorage.removeItem('payAmount');
			return payAmount
		},
		clearPayAmount:function(){
			sStorage.removeItem('payAmount');
		},
		getAuthorization:function(){
			return ("{0} {1}").format(config.auth_str, this.getUserInfo().token);
		},
		//end of extend
	}

	var userObj = allinmoney.derive(null, {
		initUser: function(userInfo){
			var phoneReg = /(\d{3})(\d{4})(\d+)/g;
			this.userName = userInfo.userName;
			this.userRole = userInfo.userRole;
			if(typeof(userInfo.phoneNum) === 'string'){
				this.phoneNum = userInfo.phoneNum.toString().replace(phoneReg, '$1****$3');
			}
			this.token = userInfo.token;
		},
		create: function(userInfo){
			this.initUser(userInfo);
		},
		storeUserTemp: function(userName, token){
			var userName = userName || this.userName;
			var token = token || this.token;
			var phoneNum = this.phoneNum || "";
			sStorage.setItem('loginuser', userName);
			sStorage.setItem('token', token);
			sStorage.setItem('phoneNum', phoneNum);
		},
		storeUserLocally: function(userName, token){
			var userName = userName || this.userName;
			var token = token || this.token;
			var phoneNum = this.phoneNum || "";
			lStorage.setItem('loginuser', userName);
			lStorage.setItem('token', token);
			lStorage.setItem('phoneNum', phoneNum);
		},
		loginSuccess:function(saveLocally, autoLogin){
			if(saveLocally || autoLogin){
                this.storeUserLocally();
            }else{
                User.clearUserLocally();
            }
            this.storeUserTemp();
			//goto login back page
			return sStorage.getItem('loginBackUrl') || home_address;
		},
		//end of include
	}, User);

	return userObj;
});
