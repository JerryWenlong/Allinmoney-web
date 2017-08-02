'use strict';
require.config({
	baseUrl:'js',
	paths:{
		'angular': 'lib/angular/angular',
		'angularRoute': 'lib/angular/angularRoute',
		'angularCookies': 'lib/angular/angularCookies',
		'domReady': 'lib/require/domReady',
		'jBcrypt': 'lib/jBcrypt/bcrypt.min',
		'MD5': 'lib/md5',
		'jsencrypt': 'lib/jsencrypt',
		'controllers': 'controllers',
		'directives': 'directives',
		'services': 'services',
		'routes': 'appLogin/routes',
		'loginController': 'appLogin/controllers/loginController',
		'logoutController': 'appLogin/controllers/logoutController',
		'loginService': 'appLogin/services/loginService',
		'loginDirective': 'appLogin/directives/loginDirective',
		'config': 'config',
		'util': 'util',
		'user': 'modules/user',
		'allbase': 'modules/allbase',
        'forgetController': 'appLogin/controllers/forgetController',
		'findController': 'appLogin/controllers/findController',
		'encrypt': 'modules/encrypt',
        'footController': 'common/controllers/footController',
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
		}
	},
	priority:[
		'angular'
	],
	// urlArgs: "bust=" + (new Date()).getTime() //clear cache
});

require([
	'require', 
	'angular',
	'angularRoute',
	'angularCookies',
	'domReady',
	'allbase',
	'util',
	'encrypt',
	'user',
	'appLogin/app',
    'footController'
], function(require, angular){
	'use strict';
	require(['domReady!'],(function(document){
		angular.bootstrap(document, ['loginApp']);
	}));
});