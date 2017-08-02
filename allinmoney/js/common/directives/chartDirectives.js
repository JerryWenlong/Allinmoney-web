define(['directives', 'chart'], function(directives, chart){
	directives.directive('chartRoundProgress',[function(){
		var linkFn = function(scope, templateElement, templateAttributes, transclude){
			var node = templateElement[0];
			var canvas = document.createElement('canvas');
			canvas.setAttribute('width', scope.width);
			canvas.setAttribute('height', scope.height);
			node.parentNode.appendChild(canvas);
			var context = canvas.getContext('2d');
			var myChart = new chart(context).Bar(scope.barChartData,{
				responsive:true
			});
		}

		return {
			restrict: "EA",
			replace: true,
			scope:{
				barChartData: "=data",
				width: '@chartWidth',
				height: '@chartHeight'
			},
			link: linkFn,
		}
	}])
})