define(['directives'], function(directives){
	directives.directive('scrollTopDir', [function(){
		return {
			restrict: "EA",
			replace: true,
			link: function($scope, element, attrs, ctrl){
				$scope.t=0
				window.onscroll=function(){
				$scope.t=document.documentElement.scrollTop || document.body.scrollTop;
					if(parseInt($scope.t)>540){
						$scope.ischeck=true;
						$scope.$apply();			
					}else{
						$scope.ischeck=false;
						$scope.$apply();
					}

					var px=$scope.t;
					if(px<1050){
						$scope.about.rootIndex=0;
					}else if(px<1600 && px>1050){
						$scope.about.rootIndex=1;
					}else if(px<2200 && px>1600){
						$scope.about.rootIndex=2;
					}else if(px<3000 && px>2200){
						$scope.about.rootIndex=4;
					}
					

					
				}	
			}
		}
	}]);
})	