define(['allbase','slideShow'], function (allinmoney, slideShow) {
	var picSlideShow = allinmoney.derive(slideShow, {
		createPicSlider:function(parentNode, imgUrlList, config){
			this.clearData(parentNode);
			var slide_container = this.addDom(parentNode, 'div', null, config.slide_container.className);
			//create img doms
			var slideNodes = {
				nodes:[],
				container:slide_container
			};
			var slide_container_width = 0;
			for(var j=0;j<imgUrlList.length;j++){
				var url = imgUrlList[j].imgUrl;
				slideNodes.nodes.push(this.addDom(slide_container, 'img', {'src':url}, null));
				slide_container_width += config.slide_width;
			}
			var styleStr = "position:absolute;top:0;left:0;width:" + slide_container_width + "px";
			slide_container.setAttribute('style', styleStr);
			return this.createSlider(parentNode, slideNodes, config);
		}
	})
	return picSlideShow;
})