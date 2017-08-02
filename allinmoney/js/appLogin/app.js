'use strict';
define(['angular', 'routes', 'loginService', 'loginDirective', 'loginController', 'angularCookies','forgetController','findController'], function(angular, routes, loginController){
	return angular.module('loginApp', ['webapp.routers', 'webapp.services', 'webapp.directives','webapp.controllers', 'ngCookies']);
})