define(['controllers'], function(controllers){
	'use strict';
	controllers.controller('categoryController', ['$scope','commonService', function($scope, commonService){
		$scope.categoryList=[
			{
				"category_id": 0,
				"category_name": "理财分类1",
				"sub_category_list": [
					{"sub_category_id":0, "sub_category_name":"二级分类名01"},
					{"sub_category_id":1, "sub_category_name":"二级分类名02"},
					{"sub_category_id":2, "sub_category_name":"二级分类名03"},
					{"sub_category_id":3, "sub_category_name":"二级分类名04"},
					{"sub_category_id":4, "sub_category_name":"二级分类名05"},
					{"sub_category_id":5, "sub_category_name":"二级分类名06"}
				]
			},
			{
				"category_id": 1,
				"category_name": "理财分类2",
				"sub_category_list": [
					{"sub_category_id":6, "sub_category_name":"二级分类名01"},
					{"sub_category_id":7, "sub_category_name":"二级分类名02"},
					{"sub_category_id":8, "sub_category_name":"二级分类名03"},
					{"sub_category_id":9, "sub_category_name":"二级分类名04"},
					{"sub_category_id":10, "sub_category_name":"二级分类名05"},
					{"sub_category_id":11, "sub_category_name":"二级分类名06"}
				]
			},
			{
				"category_id": 2,
				"category_name": "理财分类3",
				"sub_category_list": [
					{"sub_category_id":12, "sub_category_name":"二级分类名01"},
					{"sub_category_id":13, "sub_category_name":"二级分类名02"},
					{"sub_category_id":14, "sub_category_name":"二级分类名03"},
					{"sub_category_id":15, "sub_category_name":"二级分类名04"},
					{"sub_category_id":16, "sub_category_name":"二级分类名05"},
					{"sub_category_id":17, "sub_category_name":"二级分类名06"}
				]
			},
			{
				"category_id": 3,
				"category_name": "理财分类4",
				"sub_category_list": [
					{"sub_category_id":18, "sub_category_name":"二级分类名01"},
					{"sub_category_id":19, "sub_category_name":"二级分类名02"},
					{"sub_category_id":20, "sub_category_name":"二级分类名03"},
					{"sub_category_id":21, "sub_category_name":"二级分类名04"},
					{"sub_category_id":22, "sub_category_name":"二级分类名05"},
					{"sub_category_id":23, "sub_category_name":"二级分类名06"}
				]
			},
			{
				"category_id": 4,
				"category_name": "理财分类5",
				"sub_category_list": [
					{"sub_category_id":24, "sub_category_name":"二级分类名01"},
					{"sub_category_id":25, "sub_category_name":"二级分类名02"},
					{"sub_category_id":26, "sub_category_name":"二级分类名03"},
					{"sub_category_id":27, "sub_category_name":"二级分类名04"},
					{"sub_category_id":28, "sub_category_name":"二级分类名05"},
					{"sub_category_id":29, "sub_category_name":"二级分类名06"}
				]
			}
		];
		var hash_category_selected = {};
		var selected_category = null;
		var currentSelectedNode = null;
		var category_id = null;
		for (var i=0; i<$scope.categoryList.length; i++){
			hash_category_selected[$scope.categoryList[i].category_id] = {
				isSelected:false,
				sublist:$scope.categoryList[i].sub_category_list
			}
		}
		$scope.hash_category_selected = hash_category_selected;
		//show sub category
		var addClass= function (className, element) {
            element = element || this.node;
            var classes = className.split(" ");
            for (var i = 0, len = classes.length; i < len; i++) {
                var cls = classes[i].trim();
                if (cls) {
                    element.classList.add(cls);
                }
            }
        }
        var removeClass= function (className, element) {
            element = element || this.node;
            return element.classList.remove(className);
        }

        
        var selectCategory = function(selectedNode){
        	//remove last selected
        	if(currentSelectedNode){
	        	removeClass("categoty-selected", currentSelectedNode);
	        }
        	//add class
        	currentSelectedNode = selectedNode;
        	addClass("categoty-selected", selectedNode);
        }
        var clearSelectCategory = function(){
        	if(currentSelectedNode){
	        	removeClass("categoty-selected", currentSelectedNode);
	        }
        }
		$scope.showSubCategory = function(element, $event){
			// addClass("categoty-selected", $event.currentTarget);
			selectCategory($event.currentTarget);
			category_id = element.item.category_id;
			$scope.selectedCategory = element.item.category_name;
			if(selected_category != null){
				$scope.hash_category_selected[selected_category].isSelected = false;
			}
			$scope.hash_category_selected[category_id].isSelected = true;
			selected_category = category_id;
		}

		$scope.isSelected = function(item){
			//console.log("categoryid:"+item.category_id + ", isSelected:" + item.isSelected);
			return item.isSelected;
		}

		$scope.removeSelectedClass = function($event){
			removeClass("categoty-selected", $event.currentTarget);
		}

		$scope.hideSubCategory = function(){
			if(selected_category != null){
				$scope.hash_category_selected[selected_category].isSelected = false;
			}
			clearSelectCategory();
		}

		$scope.searchMount = "-1";
		$scope.searchTimeEnd = "-1";
		//category in head
		commonService.categoryShowListrn($scope); //listen 
		$scope.showCategory = false;
		$scope.hideCategoryContainer=function(){
			$scope.showCategory = false;
		};
		$scope.showCategoryContainer=function(){
			if ($scope.hoverShowCategory) {
				$scope.showCategory = true;
			};
			
		};
	}]);

});