'use strict';
require.config({
    baseUrl:'js',
    paths:{
        'angular':'lib/angular/angular',
		'angularRoute':'lib/angular/angularRoute',
		'angularCookies':'lib/angular/angularCookies',
		'chart': 'lib/Chart.min',
		'domReady': 'lib/require/domReady',
		'jBcrypt': 'lib/jBcrypt/bcrypt.min',
		'MD5': 'lib/md5',
		'jsencrypt': 'lib/jsencrypt',
		'routes': 'common/routes',
		'mainController': 'common/controllers/mainController',
		'parentController': 'common/controllers/parentController',
		'headController': 'common/controllers/headController',
		'categoryController': 'common/controllers/categoryController',
		'homePageController': 'common/controllers/homePageController',
		'finacialPageController': 'common/controllers/finacialPageController',
   		'bindingCardController': 'common/controllers/bindingCardController',
		'productPageController': 'common/controllers/productPageController',
		'advertisementController': 'common/controllers/advertisementController',
		'recommendController': 'common/controllers/recommendController',
		'footController': 'common/controllers/footController',
		'payConfirmController': 'common/controllers/payConfirmController',
		'orderCompleteController': 'common/controllers/orderCompleteController',
		'userCenterController':'common/controllers/userCenterController',
		'withdrawController': 'common/controllers/withdrawController',
		'dropDownList': 'common/directives/dropDownList',
		'chartDirective': 'common/directives/chartDirectives',
		'pagination':'common/directives/pagination',
		'commonService': 'common/services/commonService',
		'productService': 'common/services/productService',
		'transactionService':'common/services/transactionService',
		'userService':'common/services/userService',
		'directives': 'directives',
		'controllers': 'controllers',
		'interceptors': 'interceptors',
		'config': 'config',
		'util': 'util',
		'user': 'modules/user',
		'allbase': 'modules/allbase',
		'action': 'modules/action',
		'product': 'modules/product',
		'slide': 'modules/slide',
		'slideShow': 'modules/slideShow',
		'slidePicShow': 'modules/slidePicShow',
		'slideProductShow':'modules/slideProductShow',
		'encrypt': 'modules/encrypt',
		'notifyWindow':'modules/notifyWindow',
		'tradepwController': 'common/controllers/tradepwController',
        'bootstrap':'lib/bootstrap',
		'sockjs':'modules/sockjs-0.3.4',
		'stomp':'modules/stomp',
		'aboutusController':'common/controllers/aboutusController',
		'scrollTopDirect': 'common/directives/scrollTopDirect',

    },
    shim:{
        'angular':{
            exports:'angular'
        },
		'angularRoute':{
			deps:['angular'],
			exports:'angularRoute'
		},
		'angularCookies':{
			deps:['angular'],
			exports:'angularCookies'
		},
        'bootstrap':{
            deps:['angular'],
            exports:'bootstrap'
        }
    },
    priority:[
        'angular',
    ],
	// urlArgs: "bust=" + (new Date()).getTime() //clear cache
});

require([
	'require',
	'angular',
	'angularRoute',
	'angularCookies',
	'domReady',
	'jBcrypt',
	'jsencrypt',
	'encrypt',
	'util',
	'allbase',
	'action',
	'interceptors',
	'user',
	'product',
	'common/app',
    'bootstrap',

], function (require, angular) {
    //This function will be called when all the dependencies
    //listed above are loaded. Note that this function could
    //be called before the page is loaded.
    //This callback is optional.
	'use strict';
    require(['domReady!','allbase', 'action'],(function (document, allinmoney, action) {
    	allinmoney.action = allinmoney.action || new action();
        angular.bootstrap(document, ['myApp']);
    }));
});