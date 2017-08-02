define(['allbase'], function (allinmoney) {
	// body...
	var myObj = allinmoney.derive(null, {
		initSlider: function(slideNodes){
			this.slideNodes = slideNodes.nodes;
			this.slide_container = slideNodes.container;
			this.config = {
				index:0,
				auto:true,
				direct:'left',
				slide_width: 750,
				slide_height: 300,
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
				hide_floatBtn: true,
				needSlideBtn: true,
				slide_time:5000,
			}
		},
		initStyle:function(){
			var style = document.createElement('style');
			document.head.appendChild(style);
			this.sheet = style.sheet;
		},
		insertRule: function(sheet, selectorText, cssText, position){
			if(sheet.insertRule){
				sheet.insertRule(selectorText + "{" + cssText + "}", position);
			}else if(sheet.addRule){
				//for IE
				sheet.addRule(selectorText, cssText, position);
			}
			//insertRule(document.styleSheets[0], "body", "background-color: silver", 0);
		},
		// createPicSlider:function(parentNode, imgUrlList, config){
		// 	this.clearData(parentNode);
		// 	var slide_container = this.addDom(parentNode, 'div', null, config.slide_container.className);
		// 	//create img doms
		// 	var slideNodes = {
		// 		nodes:[],
		// 		container:slide_container
		// 	};
		// 	for(var j=0;j<imgUrlList.length;j++){
		// 		var url = imgUrlList[j].imgUrl;
		// 		slideNodes.nodes.push(this.addDom(slide_container, 'img', {'src':url}, null));
		// 	}
		// 	return this.createSlider(parentNode, slideNodes, config);
		// },
		createSlider:function(parentNode, slideNodes, config){
			this.initSlider(slideNodes);
			if(config){
				for(var i in config)
				this.config[i] = config[i];
			}
			this.initDom(parentNode);
			if(this.config.auto) this.play();
			this.hover();
			return this.slide.timer;
		},
		clearData:function(node){
			var divList = allinmoney.getElementByTag('div',node);
			var len = divList.length;
			for(var i=len-1; i>=0;i--){
				node.removeChild(divList[i]);
			}
		},
		initDom:function(parentNode){
			var that = this;
			this.slide = parentNode;
			if(this.slide.timer) clearInterval(this.slide.timer);
			if(this.config.needSlideBtn){
				//create button 
				this.btn_container = this.addDom(this.slide, 'div', null, this.config.btn_container.className);
				this.btn_container.style = {}
				this.slide_btn = [];
				for(var i = 0; i < this.slideNodes.length ; i++){
					this.slide_btn.push(this.addButton(this.btn_container, this.config.btn_notactive.text));
				}
			}
			this.addFloatButton(this.slide);
			this.showFloatButton = null;
			
			if(this.config.hide_floatBtn){
				this.slide.onmouseover= function(e){
					allinmoney.removeClass(that.float_btn_left, 'hidden');
					allinmoney.removeClass(that.float_btn_right, 'hidden');
				};
				this.slide.onmouseleave = function(e){
					allinmoney.addClass(that.float_btn_left, 'hidden');
					allinmoney.addClass(that.float_btn_right, 'hidden');
				};
			}
			that.float_btn_left.onclick = function(e){
				that.preImg();
			};
			that.float_btn_right.onclick = function(e){
				that.nextImg();
			}
		},
		addDom:function(parentNode, tagName, attr, className){
			var new_ele = document.createElement(tagName);
			className? allinmoney.addClass(new_ele, className) : {} ;
			if(attr){
				for(var attribute in attr){
					new_ele.setAttribute(attribute, attr[attribute]);
				}
			}
			parentNode.appendChild(new_ele);
			return new_ele;
		},
		addButton:function(parentNode, buttonText){
			var btn = this.addDom(parentNode, 'span', null, null);
			// btn.innerHTML = buttonText;
			btn.className = this.config.btn_notactive.className;
			return btn;
		},
		addFloatButton:function(parentNode){
			if(this.config.hide_floatBtn){
				this.float_btn_left = this.addDom(parentNode, 'span', null, 'float-left-btn float-btn hidden');
				this.float_btn_right = this.addDom(parentNode, 'span', null, 'float-right-btn float-btn hidden');
			}else{
				this.float_btn_left = this.addDom(parentNode, 'span', null, 'float-left-btn float-btn');
				this.float_btn_left.innerHTML = this.config.float_btn_left.text;
				this.float_btn_right = this.addDom(parentNode, 'span', null, 'float-right-btn float-btn');
				this.float_btn_right.innerHTML = this.config.float_btn_right.text;
			}
		},
		animate:function(obj,attr,val){
			// debugger;
			var d = 1000;//动画时间一秒完成。
			if(obj[attr+'timer']) clearInterval(obj[attr+'timer']);
			var start = parseInt(allinmoney.css(obj,attr));//动画开始位置
			//space = 动画结束位置-动画开始位置，即动画要运动的距离。
			var space =  val- start,st=(new Date).getTime(),m=space>0? 'ceil':'floor';
			var that = this;
			obj[attr+'timer'] = setInterval(function(){
				var t=(new Date).getTime()-st;//表示运行了多少时间，
				if (t < d){//如果运行时间小于动画时间
					allinmoney.css(obj,attr,Math[m](that.easing['easeOut'](t,start,space,d)) +'px');
				}else{
					clearInterval(obj[attr+'timer']);
					allinmoney.css(obj,attr,top+space+'px');
				}
			},20);
		},
		play:function(){
			var that = this;
			if(that.slide_btn){
				allinmoney.addClass(that.slide_btn[that.config.index],'hover');
			}
			this.slide.timer = setInterval(function(){
				that.config.index++;
				if(that.config.index>=that.slideNodes.length) that.config.index=0;//如果当前索引大于图片总数，把索引设置0
				// console.log("timer:" + that.slide.timer + "index:" + that.config.index);
				that.animate(that.slide_container,that.config.direct,-that.config.index*that.config.slide_width);
				if(that.slide_btn){
					for(var j=0;j<that.slide_btn.length;j++){
						allinmoney.removeClass(that.slide_btn[j],'hover');
					}
					allinmoney.addClass(that.slide_btn[that.config.index],'hover');
				}			
			},this.config.slide_time)		
		},
		hover:function(){
			var that = this;
			if(that.slide_btn){
				for(var i=0;i<this.slide_btn.length;i++){
					this.slide_btn[i].index = i;//储存每个导航的索引值
					this.slide_btn[i].onmouseover = function(){
						if(that.slide.timer) clearInterval(that.slide.timer);
						that.config.index =this.index; 
						
						for(var j=0;j<that.slide_btn.length;j++){
							allinmoney.removeClass(that.slide_btn[j],'hover') ;
						}
						allinmoney.addClass(that.slide_btn[that.config.index],'hover');
						that.animate(that.slide_container,that.config.direct,-that.config.index*that.config.slide_width);
					}
					that.slide_btn[i].onmouseout = function(){
						that.play();
					}
				}
			}
		},
		preImg:function(){
			var that = this;
			var length = that.slideNodes.length;
			if(that.slide.timer){
				clearInterval(that.slide.timer);
			}
			that.config.index--;
			that.config.index = (that.config.index >= 0) ? that.config.index : length - 1;
			//remove hover
			if(that.slide_btn){
				for(var j=0;j<that.slide_btn.length;j++){
					allinmoney.removeClass(that.slide_btn[j],'hover') ;
				}
				allinmoney.addClass(that.slide_btn[that.config.index],'hover');
			}
			that.animate(that.slide_container,that.config.direct,-that.config.index*that.config.slide_width);
			//add hover
			that.play();
		},
		nextImg:function(){
			var that = this;
			var length = that.slideNodes.length;
			if(that.slide.timer){
				clearInterval(that.slide.timer);
			}
			that.config.index++;
			that.config.index = (that.config.index <= (length-1)) ? that.config.index : 0;
			//remove hover
			if(that.slide_btn){
				for(var j=0;j<that.slide_btn.length;j++){
					allinmoney.removeClass(that.slide_btn[j],'hover') ;
				}
				allinmoney.addClass(that.slide_btn[that.config.index],'hover');
			}
			that.animate(that.slide_container,that.config.direct,-that.config.index*that.config.slide_width);
			
			//add hover
			that.play();
		},
		 easing :{
			linear:function(t,b,c,d){return c*t/d + b;},
			swing:function(t,b,c,d) {return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;},
			easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t + b;},
			easeOut:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t - 1) + b;},
			easeInOut:function(t,b,c,d){return ((t/=d/2) < 1)?(c/2*t*t*t*t + b):(-c/2*((t-=2)*t*t*t - 2) + b);}
		}
	});

	return myObj;
})