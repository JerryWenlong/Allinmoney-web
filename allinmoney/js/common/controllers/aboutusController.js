define(['controllers'], function(controllers){
	'use strict';
	controllers.controller('aboutusController',['$rootScope','$scope','$window', function($rootScope, $scope,$window){
		$scope.ischeck=false;
		$scope.about = {
			rootIndex:0	
		};
		
		$scope.links=function(k){
			if(k==0){
			$scope.about.rootIndex=0;
			a(120,'a')
			}else if(k==1){
			$scope.about.rootIndex=1;
			a(120,'b')
			}else if(k==2){
			$scope.about.rootIndex=2;
			a(40,'c')
			}else if(k==3){
			$scope.about.rootIndex=3;
			a(40,'d')
			}else if(k==4){
			$scope.about.rootIndex=4;
			a(40,'e')
			}
		}
		
		function a(px,id){
			var tops=document.getElementById(id).offsetTop-px;
			window.scrollTo(0,tops)
		}
		
		
		//function ost(n,bTop){
			//var bTop=document.getElementById('b').offsetTop;
//			var n
//			if($scope.t<bTop){n=1}else if($scope.t>bTop){n=-1}
//
//			var setn=setInterval(function(){
//				$scope.t+=n;
//				window.scrollTo(0,$scope.t)		
//				if($scope.t==bTop){
//					clearInterval(setn)
//				}
//				
//			},1);	
		//}
		
		
		
	}]);
})