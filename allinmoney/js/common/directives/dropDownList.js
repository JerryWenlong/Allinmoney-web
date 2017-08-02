define(['directives'], function(directives){
	directives.directive('mySelect', [function(){
		var htmlStr =
		'<div ng-mouseleave="hideSelect()" class="my-select">' +
			'<div class="selected-pannel" ng-hide="isHideDefautl()" ng-click="changeShow()">'+
                '<span class="value-container-hint" ng-show="hintShow">{{defaultSelectValue}}</span>' +
				'<span class="value-container" ng-show="!hintShow">{{selectedData}}</span>' +
				'<div class="icon-container"><span class="icon"></span></div>' + 
			'</div>' +
			'<ul class="options-pannel" ng-show="showMySelect">' + 
				'<li class="options" ng-repeat="item in dataList" ng-click="selectItem(item)">' +
					'<span>{{item.label}}</span>'
				'</li>' +
			'</ul>' +
		'</div>';

		return {
			restrict: "EA",
			replace: true, //replace the element with tamplate
			template: htmlStr,
			scope:{
				dataList: '=optionsData',
				selected: '=selectedIndex',
				defaultSelect: '@defaultSelect',
				defaultSelectValue: '@defaultSelectValue',
				replaceSelect: '@replaceSelect',
                clickfunction:'&clickFun',
                hintShow: '=hintShow'
			},
			link: function(scope, element, attrs, ctrl){
				scope.showMySelect = false;
				if(scope.defaultSelect == 'true'){
					scope.selectedData = scope.defaultSelectValue;
				}else{
					scope.selectedData = scope.dataList[scope.selected].label;
				}
				scope.hideSelect = function() {
					scope.$parent.showOptions = scope.showMySelect=false;
				}
				scope.selectItem = function(item){
					scope.showMySelect = false;
					scope.selected = item.index; // set selected
					if(scope.replaceSelect == 'true'){
						scope.selectedData = item.label;
                        if(scope.clickfunction)
                        {
                            scope.clickfunction({t:scope.selected});
                        }

					}
					if(typeof(scope.$parent.showOptions) != 'undefined'){
						scope.$parent.showOptions = scope.showMySelect;
					}
				}
				scope.changeShow = function(){
					scope.showMySelect = !scope.showMySelect;
					if(typeof(scope.$parent.showOptions) != 'undefined'){
						scope.$parent.showOptions = scope.showMySelect;
					}
				}
                scope.isHideDefautl = function() {
                   if(scope.defaultSelect=='false'&&scope.showMySelect)
                   {
                       return true;
                   }
                   else
                   {
                       return false;
                   }
                }
			}
		}
	}]);
})