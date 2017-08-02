define(['allbase'], function (allinmoney) {
	// body...
	allinmoney.bind = function(target, type, listener){
		if(target.addEventListener){
			target.addEventListener(type, listener, false)
		}else if(target.attachEvent){
			target.attachEvent('on'+type, listener)
		}else{
			target["on"+type] = listener;
		}
	}
	allinmoney.unbind=function(target, type, listener){
		if(target.removeEventListener){
			target.removeEventListener(type, listener, false)
		}else if(target.detachEvent){
			target.detachEvent("on"+type, listener);
		}else{
			target["on"+type]=null;
		}
	}
	allinmoney.getElementById = function(id){
		return document.getElementById(id);
	}
	allinmoney.getElementByTag = function(tagName,obj){
		return (obj ?obj : document).getElementsByTagName(tagName);	
	}
	allinmoney.getElementByClass = function (claN,obj){
		var tag = this.getElementByTag('*'),reg = new RegExp('(^|\\s)'+claN+'(\\s|$)'),arr=[];
		for(var i=0;i<tag.length;i++){
			if (reg.test(tag[i].className)){
				arr.push(tag[i]);
			}
		}
		return arr;
	};
	allinmoney.addClass=function(obj,claN){
		reg = new RegExp('(^|\\s)'+claN+'(\\s|$)');
		if (!reg.test(obj.className)){
			obj.className += ' '+claN;
		}
	}
	allinmoney.removeClass=function(obj,claN){
		var cla=obj.className,reg="/\\s*"+claN+"\\b/g";
		obj.className=cla?cla.replace(eval(reg),''):''
	}
	allinmoney.css=function(obj,attr,value){
		if(value){
		  obj.style[attr] = value;
		}else{
	   		return  typeof window.getComputedStyle != 'undefined' ? window.getComputedStyle(obj,null)[attr] : obj.currentStyle[attr];
	   }
	}

	String.prototype.format = function(){	
	    var args = arguments;
	    return this.replace(/\{(\d+)\}/g,                
	        function(m,i){
	            return args[i];
	        });
	}

	allinmoney.isArray = function(obj){
		return obj && typeof obj === 'object' &&
			typeof obj.length === 'number' &&
			typeof obj.splice === 'function' &&
			!(obj.propertyIsEnumerable('length'));
	}

	allinmoney.regPayAmount = function(amount){
		var re = /(\d{1,3})(?=(?:\d{3})+(?!\d))/g;
		if(typeof(amount) == 'number')
			return amount.toString().replace(re,'$1,');
		return parseFloat(amount).toString().replace(re,'$1,');
	}
})