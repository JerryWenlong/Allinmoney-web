define(['controllers', 'config'], function(controllers, config){
	'use strict';
	controllers.controller('finacialPageController',[
    '$rootScope',
    '$scope', 
    'commonService', 
    'productService', 
    '$window', 
    '$routeParams',
    '$timeout',
	function($rootScope,$scope, commonService, productService, $window, $routeParams,$timeout){
		$scope.searchingData = false;//close warp
		commonService.slideChangeListen($scope);
		var slides = []; // pictures slide imgs;
		var slide_config = {
			slide_container:{
				className:'slide-container',
			},
			btn_container:{
				className:'slide-btn-container',
			},
			btn_notactive:{
				className:'notactive-btn',
				text:'■',
			},
			float_btn_left: {
				className:'float-btn float-left-btn hidden'
			},
			float_btn_right: {
				className:'float-btn float-right-btn hidden'
			},
			slide_width: 900,
			slide_height: 300,
		}

		var productShowNode = document.getElementById('slide-product');
		var slide_product_config = {
			slide_container:{
				className:'slide-container',
			},
			btn_container:{
				className:'slide-btn-container',
			},
			btn_notactive:{
				className:'notactive-btn',
				text:'■',
			},
			float_btn_left: {
				className:'float-btn float-left-btn hidden',
				text:'<'
			},
			float_btn_right: {
				className:'float-btn float-right-btn hidden',
				text:'>'
			},
			slide_width: 300,
			slide_height: 300,
			hide_floatBtn: false,
			needSlideBtn:false,
      slide_time:4000,
		};


		var getProductShowListSuccessFn = function (productShowList) {
			// body...
			commonService.showProductSlide(productShowNode, productShowList, slide_product_config);
		}
		var errorFn = function (argument) {
			// body...
			console.log("getProductShowList error");
		}

		var productShowList = productService.getProductShowList($routeParams.finacial_type, getProductShowListSuccessFn, errorFn);

		$scope.changeLocation = function (src) {
			// body...
			$window.location.href = src;
		};

		$scope.selectFilter = function (filter) {
			return filter.selectIndex;
		}
		$scope.filterSet = function(filterIndex, itemIndex){
			$scope.filterList[filterIndex].selectIndex = itemIndex;
			$scope.getfinacialShowList('annualized_rate',0,$scope.FinacialProductPage.perPage,1,-1);
		}
		$scope.expandFilter = function (filterIndex, expandStatus) {
			$scope.filterList[filterIndex].expand_status = expandStatus;
		}
	   var getfinacialShowListSuccessFn = function (productShowList,padding,feild,sort,currentbutton) {
            // body...
           if(currentbutton==-1)
           {
               $scope.FinacialProductPage. page1=1;
               $scope.FinacialProductPage. page2=2;
               $scope.FinacialProductPage.page3=3;

           }
           $scope.finacialList=productShowList;
           $scope.FinacialProductPage.isload=true;
           $scope.FinacialProductPage.pageT=padding['total'];
           if($scope.FinacialProductPage.pageT<3)
           {
               $scope.FinacialProductPage.page1=$scope.FinacialProductPage.pageT-2;
               $scope.FinacialProductPage.page2=$scope.FinacialProductPage.pageT-1;
               $scope.FinacialProductPage.page3=$scope.FinacialProductPage.pageT;
           }
           $scope.FinacialProductPage. currentfeild=feild;
           $scope.FinacialProductPage. currentSort=sort;
           $scope.FinacialProductPage. currentclickpage=currentbutton;
           $scope.FinacialProductPage.currentPage=padding['page'];
           if(currentbutton>2&&currentbutton<=4)
           {
               if(($scope.FinacialProductPage.page2+currentbutton-2)<$scope.FinacialProductPage.pageT)
               {
                   $scope.FinacialProductPage.page1+=currentbutton-2;
                   $scope.FinacialProductPage.page2+=currentbutton-2;
                   $scope.FinacialProductPage.page3+=currentbutton-2;
               }

           }
           else if(currentbutton==5)//total
           {
               $scope.FinacialProductPage.page1=$scope.FinacialProductPage.pageT-3;
               $scope.FinacialProductPage.page2=$scope.FinacialProductPage.pageT-2;
               $scope.FinacialProductPage.page3=$scope.FinacialProductPage.pageT-1;
           }else if(currentbutton==1) //上一页
           {
               $scope.FinacialProductPage.page1-=1;
               $scope.FinacialProductPage.page2-=1;
               $scope.FinacialProductPage.page3-=1;
           }
           else if(currentbutton==6) //后一页
           {
               $scope.FinacialProductPage.page1+=1;
               $scope.FinacialProductPage.page2+=1;
               $scope.FinacialProductPage.page3+=1;
           }else if(currentbutton==0)
           {
               $scope.FinacialProductPage.page1=1;
               $scope.FinacialProductPage.page2=2;
               $scope.FinacialProductPage.page3=3;
           }

           $scope.searchingData = false;
        }
        var errorfinacialFn = function (argument) {
            // body...
            $scope.searchingData=false;//close warp
            console.log("getfinacialShowList error");
        }
        $scope.getfinacialList=function(currentbutton){
            $scope. getfinacialShowList($scope.FinacialProductPage.currentfeild,$scope.FinacialProductPage.currentSort,$scope.FinacialProductPage.perPage,1,currentbutton);
        }
        $scope.getfinacialShowListclick =function(feild,sort,n,page,currentbutton)
        {
            if(currentbutton==-1)
            {
                if(feild==$scope.FinacialProductPage.currentfeild)
                {
                    $scope.FinacialProductPage.currentSort=!$scope.FinacialProductPage.currentSort;
                    sort=$scope.FinacialProductPage.currentSort;
                }
            }
            $scope.getfinacialShowList(feild,sort,n,page,currentbutton);
        }
        $scope.getfinacialShowList =function(feild,sort,n,page,currentbutton){//currentbutton -1初始 首页 0 ，上一页 1 ， p1 2 ,p2 3, p3 4 ,pT 5 ，后一页 6
        	$scope.searchingData = true;
            if(currentbutton!=-1)
            {
                switch(currentbutton)
                {
                    case 0:
                        page=1;
                        break;
                    case 1:
                        if($scope.FinacialProductPage.page1-1>0)
                        {
                            page= $scope.FinacialProductPage.page1-1;
                        }
                        else
                        {
                            page=1;
                        }

                        break;
                    case 2:
                        page=$scope.FinacialProductPage.page1;
                        break;
                    case 3:
                        page=$scope.FinacialProductPage.page2;
                        break;
                    case 4:
                        page=$scope.FinacialProductPage.page3;
                        break;
                    case 5:
                        page=$scope.FinacialProductPage.pageT;
                        break;
                    case 6:
                        page=$scope.FinacialProductPage.currentPage+1;
                        break;

                }
            }
            $timeout(function(){//for debug sleep 1sec
              productService.getFinacialProduct(feild,sort,n,page,currentbutton,$scope.filterList,config.product_list_type[$routeParams.finacial_type],getfinacialShowListSuccessFn,errorfinacialFn);  
            },1000);
            
        }
        $scope.FinacialProductPage=
        {
            isload:false,
            page1:1,
            page2:2,
            page3:3,
            pageT:'1',
            currentfeild:'',
            currentclickpage:-1,
            currentPage:0,
            perPage:10,
            currentSort:0
        }


		switch($routeParams.finacial_type){
			case 'bank': slides = [
							{imgUrl:'img/advertisement_pic_001_900_300.png'},
							{imgUrl:'img/advertisement_pic_002_900_300.png'}
						];
						commonService.slideChangeTrigger($scope, slides, slide_config);
						commonService.categoryShowTrigger($scope, {isHomePage: false});
						$scope.locationList = [
							{title: "首页", href: "#/"},
							{title: "银行理财", href: "#/finacial/bank"}
						];
						$scope.filterList = productService.productBankFilterLimitedList();
            $rootScope.rootIndex = 1;
						break;
      case 'trust': slides = [
              {imgUrl:'img/advertisement_pic_001_900_300.png'},
              {imgUrl:'img/advertisement_pic_002_900_300.png'}
            ];
            commonService.slideChangeTrigger($scope, slides, slide_config);
            commonService.categoryShowTrigger($scope, {isHomePage: false});
            $scope.locationList = [
              {title: "首页", href: "#/"},
              {title: "信托产品", href: "#/finacial/trust"}
            ];
            $scope.filterList = productService.productTrustFilterLimitedList();
             $rootScope.rootIndex = 2;
            break;
			case 'assets': slides = [
							{imgUrl:'img/advertisement_pic_001_900_300.png'},
							{imgUrl:'img/advertisement_pic_002_900_300.png'}
						];
						commonService.slideChangeTrigger($scope, slides, slide_config);
						commonService.categoryShowTrigger($scope, {isHomePage: false});
						$scope.locationList = [
							{title: "首页", href: "#/"},
							{title: "资管计划", href: "#/finacial/asset"}
						];
						$scope.filterList = productService.productAssetFilterLimitedList();
             $rootScope.rootIndex = 3;
						break;
		}

		$scope.gotoDetail = function(item){
			var src = "#/product/{0}#top";
			$window.location.href=src.format(item.productID);
		}
	}]);
})