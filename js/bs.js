function BS(){
		
	this.ready = function(name, _function){
		name.addEventListener('DOMContentLoaded', _function, false);
	}
		
	this.click = function(name, _function){
		this.element = document.querySelectorAll(name);
		
		for(var i = 0; i < this.element.length; i ++){
			this.element[i].addEventListener('click', _function, false);
		}
	}

	this.touch = function(name, _function){
		this.element = document.querySelectorAll(name);
		
		for(var i = 0; i < this.element.length; i ++){
			this.element[i].addEventListener('touchstart', _function, false);
		}
	}
	
	this.key = function(name, _function){
		this.element = document.querySelectorAll(name);
		
		for(var i = 0; i < this.element.length; i ++){
			this.element[i].addEventListener("keydown", _function, false);
		}
	}
	
	this.keyRemove = function(name, _function){
		this.element = document.querySelectorAll(name);
		
		for(var i = 0; i < this.element.length; i ++){
			this.element[i].removeEventListener("keydown", _function);
		}
	}
	
	

	this.val = function(name){
		this.element = document.querySelectorAll(name);
		for(var i = 0; i < this.element.length; i ++){
			return this.element[i].value;
		}
	}
	
	this.cssChangeAttr = function(name, cssAttr, cssVal){
		this.element = document.querySelectorAll(name);
		
		for(var i = 0; i < this.element.length; i ++){
			this.element[i].style[cssAttr] = cssVal;
		}
	}
	
	this.Toggle = function(name, style){
		this.element = document.querySelectorAll(name);
		
		for(var i = 0; i < this.element.length; i ++){
			this.element[i].classList.toggle(style);
		}
	}	
	
}

var $ = new BS();
