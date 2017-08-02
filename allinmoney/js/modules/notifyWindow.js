define(["allbase"], function (allinmoney){
	allinmoney.notifyWindows = allinmoney.notifyWindows ||  [];
	var self = {
		closeWindow:function(){
			if(allinmoney.notifyWindows && allinmoney.notifyWindows.length > 0){
				for (var i=allinmoney.notifyWindows.length; i>0;i--){
					var notify = allinmoney.notifyWindows[i-1];
					notify.rootNode.removeChild(notify.notifyNode);
					notify.rootNode.removeChild(notify.warpNode);
					allinmoney.notifyWindows.pop(notify);
				}
			}
		}
	}
	var notifyWindow = allinmoney.derive(null, {
		initDom:function(){
			var warpNode = this.warpNode = document.createElement('div');
			var backgroundColor = this.loading? '#FFF' : '#000';
			var styleStr = String('height:100%;width:100%;position:fixed;top:0;background-color:{0};opacity: 0.5;filter:alpha(opacity=50);z-index: 998;').format(backgroundColor);
			warpNode.setAttribute('style', styleStr);
			var notifyNode = this.notifyNode = document.createElement('div');
			if(this.loading){
				notifyNode.innerHTML = 'loading...';
				var sStyle = 'display:inline-block;height:50px;width:50px;position:fixed;top:50%;left:50%;margin-left:-25px;margin-top:-25px;text-align:center';
				notifyNode.setAttribute('style', sStyle);
				this.rootNode.appendChild(notifyNode);
			}else{
				var bar = document.createElement('header');
				var barStr = 'display:inline-block;width:100%;height:50px;background-color:#EFEFEF;';
				bar.setAttribute('style', barStr);
				var title = document.createElement('span');
				allinmoney.addClass(title, 'title');
				var titleStr = 'font-size:16px;line-height:50px;margin-left:20px;';
				title.setAttribute('style', titleStr);
				title.innerHTML = this.windowTitle;
				var closeBtn = document.createElement('a');
				allinmoney.addClass(closeBtn, 'close-btn');
				allinmoney.bind(closeBtn, 'click', self.closeWindow);
				bar.appendChild(title);
				if(!this.hideCloseBtn){
					bar.appendChild(closeBtn);
				}
				notifyNode.appendChild(bar);
				this.rootNode.appendChild(notifyNode);
				this.initNotifyMessage();
				this.initButtons();
				var str = 'width:{0}px;margin-left:-{1}px;margin-top:-{2}px;top:50%;left:50%;position:fixed;display:inline-block;color:#666666;background:#FFF;z-index:999;';
				var notifyStyle = str.format(this.windowWidth, this.windowWidth/2, notifyNode.clientHeight/2);
				notifyNode.setAttribute('style', notifyStyle);
			}
			
			// var str = 'width:{0}px;margin-left:-{1}px;margin-top:-{2}px;top:50%;left:50%;position:fixed;display:inline-block;color:#666666;background:#FFF;z-index:999;';
			// var notifyStyle = str.format(this.windowWidth, this.windowWidth/2, notifyNode.clientHeight/2);
			// notifyNode.setAttribute('style', notifyStyle);
			this.rootNode.appendChild(warpNode);
		},
		create:function(arg){
			this.rootNode = arg['rootNode'] || document.getElementsByTagName('body')[0];
			this.loading = arg['loading'] || false;// if is loading warp
			this.buttonList = arg['buttonList'] || [];
			this.message = arg['message'] || null;
			this.windowWidth = arg['width'] || 450;
			this.windowHeight = arg['height'] || 380;
			this.windowTitle = arg['title']||"";
			this.hideCloseBtn = arg['hideClose']||false;
			this.initDom();
			allinmoney.notifyWindows.push({rootNode:this.rootNode, notifyNode: this.notifyNode, warpNode: this.warpNode});
		},
		initNotifyMessage:function(){
			var substanceMainStr = 'margin:30px;font-size:18px;color:#333333;';
			var substanceSubStr = 'margin:0 30px 30px 30px; font-size:14px;';
			if(typeof(this.message) == 'string' && this.message != null){
				//only one message
				var substanceMain = document.createElement('p');
				substanceMain.innerHTML = this.message;
				substanceMain.setAttribute('style', substanceMainStr);
				this.notifyNode.appendChild(substanceMain);
			}else if(allinmoney.isArray(this.message)){
				var substanceMain = document.createElement('p');
				substanceMain.innerHTML = this.message[0];
				substanceMain.setAttribute('style', substanceMainStr);
				this.notifyNode.appendChild(substanceMain);
				if(this.message.length>0){
					for(var i=1;i<this.message.length;i++){
						var substanceSub = document.createElement('p');
						substanceSub.innerHTML = this.message[i];
						substanceSub.setAttribute('style', substanceSubStr);
						this.notifyNode.appendChild(substanceSub);
					}
				}
			}
		},
		initButtons:function(){
			var len = this.buttonList.length;
			var that = this;
			if(allinmoney.isArray(this.buttonList) && len>0){
				var btnContainer = document.createElement('div');
				var containerStr = 'display:inline-block;width:100%;text-align:center;margin-bottom:30px;font-size:14px;';
				btnContainer.setAttribute('style', containerStr);
				for(var i=0;i<len;i++){
					var btn = this.buttonList[i];
					var btnDom = document.createElement('a');
					var btnDomStr = 'display:inline-block;';
					btnDom.setAttribute('style', btnDomStr);
					if(btn.btnClass){
						allinmoney.addClass(btnDom, btn.btnClass);
					}
					var text = document.createElement('span');
					var str = btn.labelText|| "";
					text.innerHTML = str;
					allinmoney.bind(btnDom, 'click', self.closeWindow);
					if(btn.clickFn){
						allinmoney.bind(btnDom, 'click', btn.clickFn);
					}
					
					btnDom.appendChild(text);
					btnContainer.appendChild(btnDom);

				}
				this.notifyNode.appendChild(btnContainer);
			}
		},
	}, self);

	return notifyWindow;
})