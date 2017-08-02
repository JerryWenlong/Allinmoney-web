define(['controllers','allbase','notifyWindow', 'user'],function (controllers, allinmoney, notifyWindow, user) {
	'use strict';
	controllers.controller('userCenterController', ['$rootScope','$scope', '$window', 'userService','$routeParams', function($rootScope, $scope, $window, userService,$routeParams){
		//if not login goto login
        $scope.userProductList =null;
        var userProductfullList =new Array();
        $scope.showAllUserProduct = false;
        $scope.showAllProductList = function(){
            $scope.userProductList = userProductfullList;
            $scope.showAllUserProduct = true;
        }
        $scope.hideAllProductList = function(){
            if(userProductfullList.length > 3){
                $scope.userProductList = userProductfullList.slice(0,3);
            }else
            {
                $scope.userProductList = userProductfullList;
            }

            $scope.showAllUserProduct=false;
        }
        $scope.getPhone=function(phone){
            if(phone&&phone.length>0)
            {
                return phone;
            }
            return ' 未绑定';
        };


        userService.getUserHandlingOrders(function(handlingOrderList){
            //success
            userProductfullList = handlingOrderList;
        });

        var initCurrentUser = function (data) {
            if(data){
                $scope.currentUser = data.userInfo;
                $scope.currentUser.cardList = data.cardList;
            }else{
                $scope.currentUser = {
                    cardList:[],
                    totalAsset:"0.00",
                    totalFunds:"0.00",
                    yesterdayRevenue:"0.00",
                    totalRevenue:"0.00",
                    userAuth:false,
                    userBindPhone:false
                }
            }
            var userInfo=user.getUserInfo();
            if(userInfo.phone_num) {
                $scope.currentUser.userBindPhone = true;
                $scope.currentUser.phoneNumber = userInfo.phone_num;
            }

            var userIconList = $scope.userIconList = [
                {
                    name:"phone", active:$scope.currentUser.userBindPhone,
                    activeTips:String("已绑定手机{0}").format($scope.currentUser.phoneNumber), inactiveTips:"未绑定手机",
                    activeMore:null, inactiveMore:"绑定手机",
                    activeTo:"#/", inactiveTo:"#/binding"
                },
                {
                    name:"id_card", active:$scope.currentUser.userAuth,
                    activeTips:"已绑定身份证", inactiveTips:"未绑定身份证",
                    activeMore:null, inactiveMore:"绑定",
                    activeTo:null, inactiveTo:"#/binding"
                },
                {
                    name:"card", active:$scope.currentUser.userAuth,
                    activeTips:"已绑定银行卡", inactiveTips:"未绑定银行卡",
                    activeMore:null, inactiveMore:"绑定",
                    activeTo:"#/", inactiveTo:"#/binding"
                },
            ];

            //set userHandlingOrderConf
        }
        var getUserInfoSuccess = function(data){
            initCurrentUser(data);

            $scope.gotoSetTradeKey=function(){
                $window.location.href = '#/tradepw';
            };
            $scope.gotoChangeTradeKey=function(){
                $window.location.href = '/findPassWord.html';
            };
            $scope.gotoForgetTradeKey=function(){
                $window.location.href = '/backPassWord.html';
            };
        }
        var getUserInfoFailed = function(error_code){
            initCurrentUser();
            $scope.gotoBindCard = function () {
                $window.location.href='#/binding';
            }
            if(error_code == 2001){
                $scope.gotoSetTradeKey=function(){
                    var notify = new notifyWindow({
                        title:'错误',
                        message:["用户尚未绑定银行卡", "请绑定银行卡"],
                        buttonList:[
                            {
                                labelText:"确认",
                                btnClass:"btn confirm-btn",
                                clickFn: function(){
                                    $window.location.href='#/binding';
                                }
                            },
                        ]
                    });
                };
            }
            
        }
        userService.getUserRevenue(getUserInfoSuccess, getUserInfoFailed);

        var userInfo = user.getUserInfo();
        $scope.userName = userInfo.has_login? userInfo.user_name:"";
        var userIconList = $scope.userIconList = [
            {
                name:"phone", active:false,
                activeTips:"", inactiveTips:"未绑定手机",
                activeMore:null, inactiveMore:"绑定手机",
                activeTo:"#/", inactiveTo:"#/binding"
            },
            {
                name:"id_card", active:false,
                activeTips:"", inactiveTips:"未绑定身份证",
                activeMore:null, inactiveMore:"绑定",
                activeTo:null, inactiveTo:"#/binding"
            },
            {
                name:"card", active:false,
                activeTips:"", inactiveTips:"未绑定银行卡",
                activeMore:null, inactiveMore:"绑定",
                activeTo:"#/", inactiveTo:"#/binding"
            },
        ];

        $scope.gotobindCard = function(){
            $window.location.href='#/binding';
        };

		var tabMenus = $scope.tabMenus = {
				tabList:[{index:0, title:"资产总览"},{index:1, title:"我的投资"},{index:2, title:"账户安全"}]	
			};

        $rootScope.accountTab = $rootScope.accountTab? $rootScope.accountTab : 0;

		var changeTab = $scope.changeTab = function(index){
            $rootScope.accountTab = index;
		}
		var showTab = $scope.showTab = function(tabIndex){
			return tabIndex == $rootScope.accountTab ;
		}
		var cuttentTab = $scope.cuttentTab = null;
		
		var _hover_tips=false;
		var _tips_node = null;
		var _timer = null;
		var container = document.getElementById('usercenter_container');
		var hideTips = function(){
			container.removeChild(_tips_node);
			_tips_node = null;
		}
		var setTips = $scope.setTips = function($event, icon){
			if(_tips_node != null){
				clearTimeout(_timer);
				hideTips();
			}
			var arrow_icon_big = document.createElement('span');
			var arrow_icon_small = document.createElement('span');
			arrow_icon_big.className = "arrow big";
			arrow_icon_small.className = "arrow small";
			var tips_node = document.createElement('div');
			_tips_node = tips_node;
			var tips_text = document.createElement('span');
			var tips_more = document.createElement('span');
			if(icon.active){
				tips_text.innerHTML = icon.activeTips || "";
				tips_more.innerHTML = icon.activeMore || "";
				var directTo=function(){
					$window.location.href = icon.activeTo;
				};
			}else{
				tips_text.innerHTML = icon.inactiveTips || "";
				tips_more.innerHTML = icon.inactiveMore || "";
				var directTo=function(){
					$window.location.href = icon.inactiveTo;
				};
			}
			allinmoney.bind(tips_more, 'click', directTo);
			tips_node.className = 'tips';
			tips_node.appendChild(tips_text);
			tips_node.appendChild(tips_more);
			tips_node.appendChild(arrow_icon_big);
			tips_node.appendChild(arrow_icon_small);
			container.appendChild(tips_node);
            var e = $event || window.event;
            var currentTarget = e.currentTarget || e.srcElement;
			var left_pix = currentTarget.offsetLeft + 35/2 + "px";
			var top_pix = currentTarget.offsetTop + 35 + 6 + "px";			
			tips_node.style.left = left_pix;
			tips_node.style.top = top_pix;
			tips_node.style.marginLeft = -(tips_node.clientWidth/2)+"px";

			arrow_icon_big.style.left = arrow_icon_small.style.left = tips_node.clientWidth/2 + "px";
			arrow_icon_big.style.top = "-6px";
			arrow_icon_small.style.top = "-4px";
			tips_node.onmouseover = function(){
				_hover_tips = true;
			};
			tips_node.onmouseleave = function(){
				_hover_tips = false;
				if(_tips_node){
					hideTips();
				}
			}
		};

		var resetTips = $scope.resetTips = function(){
			_timer = setTimeout(function(){
				if(!_hover_tips && _tips_node){
					hideTips();
				}
			},200);
		}

        //Tab1
        
		$scope.showAmount = false;
		$scope.swichShowAmount = function(swich){
			$scope.showAmount = swich;
		}

		var amount_tip_big = document.getElementById('arrow_big');
		var amount_tip_small = document.getElementById('arrow_small');
		$scope.show_amount_tip = false;
		var hover_amount_tip = $scope.hover_amount_tip = function($event){
            var e = $event || window.event;
            var currentTarget = e.currentTarget || e.srcElement;
			var left_pix = currentTarget.offsetLeft + 17/2 - 1 + "px";
			amount_tip_big.style.left = amount_tip_small.style.left = left_pix;
            amount_tip_big.style.top = amount_tip_small.style.top="30px";
			$scope.show_amount_tip = true;
		}
		var leave_amount_tip = $scope.leave_amount_tip = function(){
			$scope.show_amount_tip = false;
		}
		


        $scope.InvestmentPage={
            isload:false,
            action:0,//1 买入，2 取出 3 收益 4 余额 5 提现
            page1:1,
            page2:2,
            page3:3,
            pageT:1,
            currentfeild:1,//1 全部，2 近一个月 3 三月 4 一年 5 查询
            currentclickpage:-1,
            currentPage:1,
            perPage:3,
            fromdata:null,
            todata:null
        }
        $rootScope.investmentPage = $rootScope.investmentPage ? $rootScope.investmentPage : 1;

        $scope.orderdetail = new Array();
        $scope.listInvestment=new Array();
        $scope.listInvestmentpropertyjourna=new Array();
        $scope.listInvestmentRevenues=new Array();
		$scope.listwithdraw=new Array();
		$scope.withdrawdetails=new Array();
        var listInvestmentall=null;
        var listInvestpropertyjournal=null;
        var listInvestmentallRevenues=null;
		var listInvestwithdraw=null;
        var listInvestmentfilter=new Array();
        var  p3sort=2;
        var  p4sort=2;
        var timeFrom;
        var timeTo;

        var selectFeild=[{ first:1, secend:null},{ first:1, secend:null},{ first:1, secend:null},{ first:1, secend:null}];

        $scope.formatedate=function(time)
        {
            if(time)
            {
                var s=String(time);
                var t= s.indexOf('T');
                return s.substring(0,t);
            }
            return '';

        }
        //currentbutton -1初始 首页 0 ，上一页 1 ， p1 2 ,p2 3, p3 4 ,pT 5 ，后一页 6
        $scope.getinvestmentList=function(actionitem){
            switch(actionitem)
            {
                case 0:
                    if($scope.getCurrentPageOrders(1))
                    {
                        $scope.InvestmentPage.page1=1;
                        $scope.InvestmentPage.page2=2;
                        $scope.InvestmentPage.page3=3;
                    }


                    break;
                case 1:
                   if($scope.getCurrentPageOrders($scope.InvestmentPage.currentPage-1))
                   {
                       if($scope.InvestmentPage.currentPage<$scope.InvestmentPage.pageT-1)
                       {
                           $scope.InvestmentPage.page1-=1;
                           $scope.InvestmentPage.page2-=1;
                           $scope.InvestmentPage.page3-=1;
                       }
                   }
                    break;
                case 2:
                    if($scope.getCurrentPageOrders($scope.InvestmentPage.page1))
                    {

                    }
                    break;
                case 3:
                   if( $scope.getCurrentPageOrders($scope.InvestmentPage.page2))
                   {
                       if(($scope.InvestmentPage.page2+actionitem-2)<$scope.InvestmentPage.pageT)
                       {
                           $scope.InvestmentPage.page1+=actionitem-2;
                           $scope.InvestmentPage.page2+=actionitem-2;
                           $scope.InvestmentPage.page3+=actionitem-2;
                       }
                   }

                    break;
                case 4:
                   if($scope.getCurrentPageOrders($scope.InvestmentPage.page3))
                   {
                       if(($scope.InvestmentPage.page2+actionitem-2)<$scope.InvestmentPage.pageT)
                       {
                           $scope.InvestmentPage.page1+=actionitem-2;
                           $scope.InvestmentPage.page2+=actionitem-2;
                           $scope.InvestmentPage.page3+=actionitem-2;
                       }
                   }

                    break;
                case 5:

                    if($scope.getCurrentPageOrders($scope.InvestmentPage.pageT))
                    {
                        $scope.InvestmentPage.page1=$scope.InvestmentPage.pageT-3;
                        $scope.InvestmentPage.page2=$scope.InvestmentPage.pageT-2;
                        $scope.InvestmentPage.page3=$scope.InvestmentPage.pageT-1;
                    }
                    break;
                case 6:
                    if($scope.getCurrentPageOrders($scope.InvestmentPage.currentPage+1))
                    {
                        $scope.InvestmentPage.page1+=1;
                        $scope.InvestmentPage.page2+=1;
                        $scope.InvestmentPage.page3+=1;
                    }
                    break;
                default:
                    break;
            }
        }
        $scope.getCurrentPageOrders=function(iPage){
            if(iPage<1)
            {
                return false;
            }
            var listInvestment=null;
            var listall=null;
            switch($scope.InvestmentPage.action) {
                case 1:
                    listInvestment=$scope.listInvestment;
                    listall=listInvestmentall;
                    break;
                case 3:
                    listInvestment=$scope.listInvestmentRevenues;
                    listall=listInvestmentallRevenues;
                    break;
                case 4:
                    listInvestment=$scope.listInvestmentpropertyjourna;
                    listall=listInvestpropertyjournal;
                    break;
				case 5:
					listInvestment=$scope.listwithdraw;
					listall=listInvestwithdraw;
					break;	
                default:
                    return;
            }
            if(listInvestmentfilter.length!=0)
            {
                listall=listInvestmentfilter;
            }
           listInvestment.length=0;
            for(var i=0;i< $scope.InvestmentPage.perPage;i++)
            {
                var index=(iPage-1)*3+i;
                if(listall.length>index)
                {
                    if(listall[index].businessDate){
                        var s=listall[index].businessDate.toString();
                        listall[index].businessDate=s.replace(/T/," ");
                    }
                    if(listall[index].exchangeDate){
                        var s=listall[index].exchangeDate.toString();
                        listall[index].exchangeDate=s.replace(/T/," ");
                    }

                    listInvestment.push(listall[index]);
                }

            }
            if( listInvestment.length!=0)
            {
                $scope.InvestmentPage.currentPage=iPage;
                return true;
            }
            return false;
        }
        var getNowFormatDate=function(datain) {
            var date=null;
            if(datain){
                date = datain;
            }
            else{
                date = new Date();
            }
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
           var h=date.getHours();
            if(h>=0 && h<=9){
                h = '0'+h;
            }
            var m=date.getMinutes();
            if(m>=0 && m<=9){
                m = '0'+m;
            }
            var s=date.getSeconds();
            if(s>=0 && s<=9){
                s = '0'+s;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + "T" + h + seperator2 + m
                + seperator2 + s;
            return currentdate;
        }
        var getMormatDate=function(m) {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var year=date.getFullYear();
            var imonth=parseInt(month);
            if(imonth-m<=0){
               var iyear=parseInt(year);
                iyear--;
                year=iyear.toString();
                if(m!=12){
                    if(imonth-m==0){
                        month='12';
                    }
                    else{
                        month=imonth+12-m;
                    }
                }
            }
            else{
                month=imonth-m;
            }
            var currentdate =year  + seperator1 + month + seperator1 + strDate
                + "T" + '00' + seperator2 + '00'
                + seperator2 + '00';
            return currentdate;
        }
        var initPage=function(list,listview){
            $scope.InvestmentPage.page1=1;
            $scope.InvestmentPage.page2=2;
            $scope.InvestmentPage.page3=3;
            $scope.InvestmentPage.currentPage=1;
            $scope.InvestmentPage.pageT=1;
            if(list==null||listview==null){
                return;
            }
            if(list.length==0){
                listview.length=0;
                return;
            }
            $scope.InvestmentPage.pageT=parseInt( list.length/$scope.InvestmentPage.perPage);
            if(list.length%$scope.InvestmentPage.perPage>0){
                $scope.InvestmentPage.pageT++;
            }
            listview.length=0;
            for(var i=0;i< $scope.InvestmentPage.perPage;i++){
                var index=($scope.InvestmentPage.currentPage-1)*3+i;
                if(list.length>index){
                    if(list[index].createdAt){
                       var s=list[index].createdAt.toString();
                       list[index].createdAt=s.replace(/T/," ");
                    }
                    listview.push(list[index]);
                }
            }
        }
		
        $scope.getexchangeTypeFromID=function(id){
            var s=null;
            switch(id){
                case 0:
                    s='买入';
                    break;
                case 1:
                    s='赎回';
                    break;
                case 2:
                    s='到期结算';
                    break;
                case 3:
                    s='撤单';
                    break;
                case 4:
                    s='提现';
                    break;
                case 5:
                    s='充值';
                    break;
                case 6:
                    s='利息积数改变';
                    break;
                case 7:
                    s='罚息积数改变';
                    break;
                case 8:
                    s='系统红包奖励';
                    break;
            }
            return s;
        }
        $scope.toPay=function(id){
            $window.open("./index.html#/payconfirm"+"/"+ id + "/#top");
        }
        $scope.needPay=function(id){
            if(id==0||id==2){
                return true;
            }
            return false;
        }
		var statusList = ['未支付','支付成功','支付失败','订单过期','交易中(已清算)','交易失败','产品募集中','募集失败',
			'持有中','赎回中','已赎回'];
		var getStatusOptions = function(){
			var len = statusList.length;
			var options=[];
			for(var i=0;i<len;i++){
				options.push({
					index:i,
					label:statusList[i]
				})
			}
			return options
		}
		$scope.orderStatusOptions = getStatusOptions();
		
        $scope.getStatusFromID=function(i){
            return statusList[i];
        }
        $scope.filterSort=function(index){
            switch($scope.InvestmentPage.action) {
                case 1:
                    break;
                case 3:
                    if(index!=p3sort){
                        p3sort=index;
                        $scope.getRevenues(timeFrom,timeTo,p3sort);
                    }
                    break;
                case 4:
                    if(index!=p4sort)
                    {
                        p4sort=index;
                        $scope.getJournal(timeFrom,timeTo,p4sort);
                    }
                    break;
            }
        }
		$scope.getCountstatus2=function(arg1,arg2)
        {

            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;

            var count= ((arg1 * m - arg2 * m) / m).toFixed(n);
            if(count>=0)
            {
                return '+'+count;
            }
            else
            {
                return count;

            }
        }
        $scope.getCountstatus=function(count)
        {
            if(count>=0)
            {
                return '+'+count;
            }
            else
            {
                return count;

            }
        }
	var indexstatus=[-1,-1,-1];
		
	$scope.getpaymentStatus=function(status){
		var f=null;
		if(status==0){
			f='未处理'	
		}else if(status==1){
			f="处理中"	
		}else if(status==2){
			f="交易成功"	
		}else if(status==3){
			f="交易失败"	
		}else if(status == 5){
            f="交易关闭"
        }
		return f;
	}
    $scope.formatBalanceType = function(index){
        var list = ['购买理财','充值','提现','收益','转账','赎回','撤单','红包','提成','利息积数改变','罚息积数改变'];
        return list[index];
    }
    $scope.filterStatus=function(index){
	    if(index==-1){
            return;
        }

            var list=null;
            listInvestmentfilter.length=0;
            switch($scope.InvestmentPage.action) {
                case 1:
                    indexstatus[0]=index;
                    list=listInvestmentall;
                    if(index==9)
                    {
                        initPage(list,$scope.listInvestment);
                        return;
                    }
                    for(var i=0;i<list.length;i++)
                    {
                        if(index==list[i].status)
                        {
                            listInvestmentfilter.push(list[i]);
                        }
                    }
                    initPage(listInvestmentfilter,$scope.listInvestment);
                    break;
                case 3:
                    indexstatus[1]=index;
                    list=listInvestmentallRevenues;
                    if(index==7)
                    {
                        initPage(list,$scope.listInvestmentRevenues);
                        return;
                    }
                    for(var i=0;i<list.length;i++)
                    {
                        if(index==list[i].productType)
                        {
                            listInvestmentfilter.push(list[i]);
                        }
                    }
                    initPage(listInvestmentfilter,$scope.listInvestmentRevenues);
                    break;
                case 4:
                    indexstatus[2]=index;
                    list=listInvestpropertyjournal;
                    if(index==9)
                    {
                        initPage(list,$scope.listInvestmentpropertyjourna);
                        return;
                    }
                    for(var i=0;i<list.length;i++)
                    {
                        if(index==list[i].exchangeType)
                        {
                            listInvestmentfilter.push(list[i]);
                        }
                    }

                    initPage(listInvestmentfilter,$scope.listInvestmentpropertyjourna);
                    break;
                default:
                    return;
            }



        }

        $scope.getOrdersM=function(action)
        {
            var m=action;
            switch(action)
            {
                case 0:
                    $scope.InvestmentPage.currentfeild=1;
                    break;
                case 1:
                    $scope.InvestmentPage.currentfeild=2;
                    break;
                case 3:
                    $scope.InvestmentPage.currentfeild=3;
                    break;
                case 12:
                    $scope.InvestmentPage.currentfeild=4;
                    break;
            }


            if(m!=0)
            {
                var st= getMormatDate(m);
                timeFrom=st;
            }
            else
            {
                timeFrom='2015-01-01T00:00:00';
            }

            timeTo=getNowFormatDate();
            switch($scope.InvestmentPage.action) {
                case 1:
                    $scope.getOrders(st,timeTo,2);
                    selectFeild[0].first=$scope.InvestmentPage.currentfeild;
                    selectFeild[0].secend=null;
                    break;
                case 3:
                    $scope.getRevenues(st,timeTo,p3sort);
                    selectFeild[1].first=$scope.InvestmentPage.currentfeild;
                    selectFeild[1].secend=null;
                    break;
                case 4:
                    $scope.getJournal(st,timeTo,p4sort);
                    selectFeild[2].first=$scope.InvestmentPage.currentfeild;
                    selectFeild[2].secend=null;
                    break;
				case 5:
					$scope.getWithdraw(st,timeTo,p4sort);
                    selectFeild[3].first=$scope.InvestmentPage.currentfeild;
                    selectFeild[3].secend=null;
					break;	
            }


        }
        $scope.queryOrders=function()
        {
            $scope.InvestmentPage.currentfeild=5;
            var from=getNowFormatDate($scope.InvestmentPage.fromdata);
            var to=getNowFormatDate($scope.InvestmentPage.todata);
            timeFrom=from;
            timeTo=to;
            switch($scope.InvestmentPage.action) {
                case 1:
                    $scope.getOrders(from, to, 2);
                    selectFeild[0].first=$scope.InvestmentPage.fromdata;
                    selectFeild[0].secend=$scope.InvestmentPage.todata;
                    break;
                case 3:
                    $scope.getRevenues(from, to,p3sort);
                    selectFeild[1].first=$scope.InvestmentPage.fromdata;
                    selectFeild[1].secend=$scope.InvestmentPage.todata;
                    break;
                case 4:
                    $scope.getJournal(from, to, p4sort);
                    selectFeild[2].first=$scope.InvestmentPage.fromdata;
                    selectFeild[2].secend=$scope.InvestmentPage.todata;
                    break;
				case 5:
                    $scope.getWithdraw(from, to, p4sort);
                    selectFeild[3].first=$scope.InvestmentPage.fromdata;
                    selectFeild[3].secend=$scope.InvestmentPage.todata;
                    break;	
            }

        }
        $scope.openOrderDetail=function(orderdetail)
        {
            $window.open("./index.html#/orderdetail"+"/"+orderdetail);
        }
        $scope.getOrderDetail=function(){
            var successFn = function(orderDetail) {debugger;
                $scope.orderdetail=orderDetail;
                $scope.showOrderTime = (orderDetail.status == 0 || orderDetail.status == 2)? true : false;
                var orderLeftTime =  orderDetail.ttl;//order close 15mins
                var interval = 1000;
                if($scope.showOrderTime){
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
            }
            var failedFn = function(){
                console.log("get order error")
            }
            userService.getOrder($routeParams.id, successFn, failedFn);
        }
		
		$scope.getDatetime=function(time){
				var times=time.toString().replace(/T/," ");
				return times;			
		}
		
		$scope.withdrawmore=function(withdrawdetail){
			$window.open("./index.html#/withdrawdetail"+'/'+withdrawdetail);
		}


		$scope.getWithdrawDetail=function()
        {
            userService.getWithdrawDetai($routeParams.tradeSerialNo).then(function (response) {
                if (response.status='200') {
                    $scope.withdrawdetails.length=0;
                    $scope.withdrawdetails = response.data.data;
                    $scope.withdrawdetailstime=$scope.withdrawdetails['createdAt'].toString().replace(/T/," ");
                }
				

            },function(){});
        }



        $scope.clickType=function(action)
        {


            var action = action? action : 1;
            $rootScope.investmentPage = action;
            if($scope.InvestmentPage.action==action){
                return;
            }
            if(action){
                $scope.InvestmentPage.action=action;
            }
            initPage(null,null);


            timeFrom='2015-01-01T00:00:00';
            timeTo=getNowFormatDate();
            switch($scope.InvestmentPage.action)
            {
                case 1:
                    if(selectFeild[0].secend==null)
                    {
                        $scope.InvestmentPage.currentfeild=selectFeild[0].first;
                    }else
                    {
                        $scope.InvestmentPage.currentfeild=5;
                    }

                    if(listInvestmentall==null||listInvestmentall.length==0)
                    {
                        $scope.getOrders(timeFrom,timeTo,2);
                        $scope.InvestmentPage.currentfeild=1;

                    }else
                    {
                        if(indexstatus[0]==-1)
                        {
                            initPage(listInvestmentall,$scope.listInvestment);
                        }
                        else
                        {
                            $scope. filterStatus(indexstatus[0]);
                        }

                    }



                    break;
                case 3:
                    if(selectFeild[1].secend==null)
                    {
                        $scope.InvestmentPage.currentfeild=selectFeild[1].first;
                    }else
                    {
                        $scope.InvestmentPage.currentfeild=5;
                    }
                    if(listInvestmentallRevenues==null||listInvestmentallRevenues.length==0) {
                        $scope.getRevenues(timeFrom,timeTo, 2);
                        $scope.InvestmentPage.currentfeild=1;
                    }else
                    {
                        if(indexstatus[1]==-1)
                        {
                            initPage(listInvestmentallRevenues,$scope.listInvestmentRevenues);
                        }
                       else
                        {
                            $scope. filterStatus(indexstatus[1]);
                        }

                    }

                    break;
                case 4:
                    if(selectFeild[2].secend==null)
                    {
                        $scope.InvestmentPage.currentfeild=selectFeild[2].first;
                    }else
                    {
                        $scope.InvestmentPage.currentfeild=5;
                    }
                    if(listInvestpropertyjournal==null||listInvestpropertyjournal.length==0) {
                        $scope.getJournal(timeFrom,timeTo, 2);
                        $scope.InvestmentPage.currentfeild=1;
                    }else
                    {
                        if(indexstatus[2]==-1)
                        {
                            initPage(listInvestpropertyjournal,$scope.listInvestmentpropertyjourna);
                        }
                        else
                        {
                            $scope.filterStatus (indexstatus[2]);
                        }

                    }

                    break;
				case 5:
                    if(selectFeild[3].secend==null)
                    {
                        $scope.InvestmentPage.currentfeild=selectFeild[3].first;
                    }else
                    {
                        $scope.InvestmentPage.currentfeild=5;
                    }
					 if(listInvestwithdraw==null||listInvestwithdraw.length==0) {
                        $scope.getWithdraw(timeFrom,timeTo, 2);
                         $scope.InvestmentPage.currentfeild=1;
                    }else
                    {
                        initPage(listInvestwithdraw,$scope.listwithdraw);
                    }

					break;	

            }

        }
		
		
		$scope.getWithdraw=function(form,to,sort){
			userService.getWithdraw('',1,form,to,sort).then(function (response) {
                if (response.data['error'] == 0) {
					
                    listInvestwithdraw = response.data['data'];
                    if (listInvestwithdraw.length > 0) {
                        initPage(listInvestwithdraw,$scope.listwithdraw);
                        listInvestmentfilter.length=0;
                    }else{
						listInvestwithdraw.length=0;
						initPage(listInvestwithdraw,$scope.listwithdraw);
					}

                }

            });
			
		}
		
        $scope.getRevenues=function(form,to,sort)
        {
             userService.getRevenues('',1,form,to,sort).then(function (response) {
                if (response.data['error'] == 0) {
                    listInvestmentallRevenues = response.data['data'];
                    if (listInvestmentallRevenues.length > 0) {
                        if(indexstatus[1]==-1)
                        {
                            initPage(listInvestmentallRevenues,$scope.listInvestmentRevenues);
                        }
                         else
                        {
                            $scope.filterStatus(indexstatus[1]);
                        }
                    }else
                    {
                        initPage(listInvestmentallRevenues,$scope.listInvestmentRevenues);
                        $scope.listInvestmentRevenues.length=0;

                    }
                    listInvestmentfilter.length=0;

                }

            });
        }

        $scope.getJournal=function(from,to,sort)
        {
            userService.getJournal('',1,from,to,sort).then(function (response) {
                if (response.data['error'] == 0) {
                    listInvestpropertyjournal = response.data['data'];
                    if (listInvestpropertyjournal.length > 0) {
                        if(listInvestpropertyjournal.length>1)
                        {
                            listInvestpropertyjournal.sort(function(a,b){
                                if(sort==2)
                                {
                                    return b.createdAt.localeCompare(a.createdAt)
                                }
                               else
                                {
                                    return a.createdAt.localeCompare(b.createdAt)
                                }
                            });
                        }


                        if(indexstatus[2]==-1)
                        {
                            initPage(listInvestpropertyjournal,$scope.listInvestmentpropertyjourna);
                        }
                       else
                        {
                            $scope. filterStatus(indexstatus[2]);
                        }
                    }else
                    {
                        $scope.listInvestmentpropertyjourna.length=0;
                        initPage(listInvestpropertyjournal,$scope.listInvestmentpropertyjourna);
                    }
                    listInvestmentfilter.length=0;
                }

            });
        }
        $scope.getOrders=function(from,to,sort){
            userService.getOrders('',1,from,to,sort).then(function (response) {
                listInvestmentall = response.data['data'];
                if (listInvestmentall.length > 0) {

                    if(indexstatus[0]==-1)
                    {
                        initPage(listInvestmentall,$scope.listInvestment);
                    }else{
                        $scope. filterStatus(indexstatus[0]);
                    }
                    if($scope.InvestmentPage.isload==false)
                    {
                       // for(var i=0;i<listInvestmentall.length;i++)
                       // {
                       //     if(listInvestmentall[i].status==0||listInvestmentall[i].status==4||listInvestmentall[i].status==6) {
                       //         var product = {};
                       //         product.title = listInvestmentall[i].productName;
                       //         product.productID = listInvestmentall[i].productId;
                       //         product.ordetId = listInvestmentall[i].id;
                       //         product.href = String("#/product/{0}/#top").format(product.productID);// 目前恒生系统里取不到productId,在获取所有产品连表时付值
                       //         userProductfullList.push(product);
                       //     }
                       // }
                       //  $scope.hideAllProductList();
                        $scope.InvestmentPage.isload = true;
                    }
                }
                else{
                    $scope.listInvestment.length=0;
                    initPage(listInvestmentall,$scope.listInvestment);
                }
                listInvestmentfilter.length=0;
            });
         }


		// changeTab(0); //set default

        $scope.status = {
            openedf: false,
            openedt: false
        };
        $scope.today = function() {
            if( $scope.status.openedf == true)
            {
                $scope.InvestmentPage.fromdata = new Date();
            }else
            {
                $scope.InvestmentPage.todata = new Date();
            }

        };
        $scope.today();

        $scope.clear = function () {
            if( $scope.status.openedf == true)
            {
                $scope.InvestmentPage.fromdata = null;
            }else
            {
                $scope.InvestmentPage.todata = null;
            }

        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return false;// *//*( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );*//*
        };
        $scope.minDate= new Date(2015, 5, 22);
        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
        $scope.maxDate = new Date(2050, 5, 22);

        $scope.open = function($event,id) {
            if(id=='from')
            {
                $scope.status.openedf = true;
                $scope.status.openedt = false;
            }else
            {
                $scope.status.openedt = true;
                $scope.status.openedf = false;
            }

        };

        $scope.setDate = function(year, month, day) {
            if( $scope.status.openedf == true)
            {
                $scope.InvestmentPage.fromdata =new Date(year, month, day);
            }else
            {
                $scope.InvestmentPage.todata = new Date(year, month, day);
            }

        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.language ='zh-CN';


        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i=0;i<$scope.events.length;i++){
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };


	}])
})