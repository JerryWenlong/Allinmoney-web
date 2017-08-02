define(['allbase','slideShow'], function (allinmoney, slideShow) {
	var productSlideShow = allinmoney.derive(slideShow, {
		createProductSlider:function(parentNode, productList, config){
			this.clearData(parentNode);
			var slide_container = this.addDom(parentNode, 'div', null, config.slide_container.className);
			//create img doms
			var slideNodes = {
				nodes:[],
				container:slide_container
			};
			var length = 0;
			if(productList){
				length = productList.length;
			}
			var container_width=length * config.slide_width;
			for(var j=0; j<length; j++){
				var product = productList[j];
				var node = this.addDom(slide_container, 'div', null, 'product-slide-node');
				this.initProductNode(node, product);
				slideNodes.nodes.push(node);
			}
			var containerStyleStr = "position:absolute;top:0;left:0;width:" + container_width + "px";
			slide_container.setAttribute('style', containerStyleStr);
			// create product node TODO
			return this.createSlider(parentNode, slideNodes, config);
		},
		initProductNode: function(node, product){
			var title = this.addDom(node, 'p', null, "title");
			title.innerHTML = product.title;
			var sub_title = this.addDom(node, 'p', null, "sub-title");
			sub_title.innerHTML = '持续热销,风险低收益稳！';
			var ulList = this.addDom(node, 'ul', null, 'info-list');
			var revenue = this.addDom(ulList, 'li', null, 'revenue');
			var revenue_value = this.addDom(revenue, 'span', null, 'value');
			revenue_value.innerHTML = product.expected_revenue.value;
			var revenue_unit = this.addDom(revenue, 'span', null, 'unit');
			revenue_unit.innerHTML = product.expected_revenue.unit;
			var revenue_title = this.addDom(ulList, 'li', null, 'revenue-title');
			revenue_title.innerHTML = "七日年化收益(无字段)";
			var button_pannel = this.addDom(ulList, 'li', null, 'buy-btn-pannel');
			var href_str = "#/product/{0}";
			var href = href_str.format(product.productID);
			var buy_btn = this.addDom(button_pannel, 'span', null, 'buy-btn btn allinmoney-button-b64');
			buy_btn.onclick = function(){
				window.location.href = href;
			}
			buy_btn.innerHTML = "购买";
		},
	});

	return productSlideShow;
})