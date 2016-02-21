(function (window) {
	window._ = function (selector) {
		return new lib(selector);
	}
	var lib = function (selector) {
		if (window === this) return new lib(selector);
		if (typeof selector == "object") {
			if (selector.length || (selector[0])) {
				if (selector.length) {
					for (var i = 0; i < selector.length; i++) this[i] = selector[i];
					this.length = selector.length;
				} else {
					var i = 0; while (selector[i]) this[i] = selector[i++];
					this.length = i + 1;
				}
			} else {
				this[0] = selector;
				this.length = 1;
			}
		} else if (typeof selector == "string") {
			if (selector.match(/^\<[\s\S]+?\>$/)) {
				var str = selector.substring(1, selector.length - 1);
				var reg = /^[a-zA-z]+?(?=(\.|\#|$|\[|\:))/gmi; //Element Name
				var arr = reg.exec(str); 
				if (!arr || arr === null || !arr[0]) throw "Invalid CSS Selector String";
				var tag = arr[0];
				var elem = document.createElement(tag);
				reg = /\.[a-zA-z0-9_]+?(?=(\.|\#|$|\[|\:))/gmi; //Class
				while((arr = reg.exec(str)) !== null) {
						this[i] = selector[i];
						i++;
					elem.classList.add(arr[0].substring(1, arr[0].length))
				}
				reg = /\#[a-zA-z0-9_]+?(?=(\.|\#|$|\[|\:))/gmi; //ID
				arr = reg.exec(str);
				var id = "";
				if (arr && arr !== null && arr[0]) elem.id = arr[0].substring(1, arr[0].length);
				reg = /\[[a-zA-z0-9_]+?\=[\s\S]+?\](?=(\.|\#|$|\[|\:))/gmi; //Attribute
				while((arr = reg.exec(str)) !== null) {
					var tmp = arr[0].substring(1, arr[0].length - 1);
					tmp = tmp.split("=");
					elem.setAttribute(tmp[0], tmp[1].replace(/(\"|\')/gmi, ""));
				}
				this[0] = elem;
				this.length = 1;
				
			} else {
				if (!document.querySelectorAll) throw "Unsupported Browser";
				var els = document.querySelectorAll(selector);
				for (var i = 0; i < els.length; i++) this[i] = els[i];
				this.length = els.length;
			}
		} else if (typeof selector == "undefined") {
			this[0] = document;
			this.length = 1;
		} else if (typeof selector == "number") {
			if (window._.index && window._.index[selector]) {
				this[0] = window._.index[selector];
				this.length = 1;
			}
		}
		return this;
	};
	lib.prototype = window._.fn = {
		index:function (num) {
			if (!window._.index) window._.index = [];
			for (var i = 0; i < this.length; i++) {
				window._.index[num + i] = this[i];
			}
			return this;
		},
		include:function (selector) {
			if (typeof selector == "object") {
				if (selector.length || (selector[0])) {
					if (selector.length) {
						for (var i = 0; i < selector.length; i++) this[this.length + i] = selector[i];
						this.length += selector.length;
					} else {
						var i = 0; while (selector[i]) {
							this[this.length + i] = selector[i];
							i++;
						}
						this.length = this.length + i + 1;
					}
				} else {
					this[this.length] = selector;
					this.length += 1;
				}
			} else if (typeof selector == "string") {
				if (selector.match(/^\<[\s\S]+?\>$/)) {
					var str = selector.substring(1, selector.length - 1);
					var reg = /^[a-zA-z]+?(?=(\.|\#|$|\[|\:))/gmi; //Element Name
					var arr = reg.exec(str); 
					if (!arr || arr === null || !arr[0]) throw "Invalid CSS Selector String";
					var tag = arr[0];
					var elem = document.createElement(tag);
					reg = /\.[a-zA-z0-9_]+?(?=(\.|\#|$|\[|\:))/gmi; //Class
					while((arr = reg.exec(str)) !== null) {
						elem.classList.add(arr[0].substring(1, arr[0].length))
					}
					reg = /\#[a-zA-z0-9_]+?(?=(\.|\#|$|\[|\:))/gmi; //ID
					arr = reg.exec(str);
					if (arr && arr !== null && arr[0]) elem.id = arr[0].substring(1, arr[0].length);
					reg = /\[[a-zA-z0-9_]+?\=[\s\S]+?\](?=(\.|\#|$|\[|\:))/gmi; //Attribute
					while((arr = reg.exec(str)) !== null) {
						var tmp = arr[0].substring(1, arr[0].length - 1);
						tmp = tmp.split("=");
						elem.setAttribute(tmp[0], tmp[1].replace(/(\"|\')/gmi, ""));
					}
					this[this.length] = elem;
					this.length += 1;
					
				} else {
					if (!document.querySelectorAll) throw "Unsupported Browser";
					var els = document.querySelectorAll(selector);
					for (var i = 0; i < els.length; i++) this[this.length + i] = els[i];
					this.length += els.length;
				}
			} else if (typeof selector == "undefined") {
				this[this.length] = document;
				this.length += 1;
			} else if (typeof selector == "number") {
				if (window._.index && window._.index[selector]) {
					this[this.length] = window._.index[selector];
					this.length += 1;
				}
			}
			return this;
		},
		exclude:function (selector) {
			if (typeof selector == "number") {
				this[selector] == undefined;
				for (var i = selector; i < this.length - 1; i++) {
					this[i] = this[i + 1];
				}
				this.length--;
			} else if (selector.constructor == Array) {
				for (var i = 0; i < selector.length; i++) {
					for (var n = selector[i] + 1; n <= this.length; n++) {
						this[n - 1] = this[n];
					}
					this.length--;
				}
			} else if (typeof selector == "string") {
				var els = document.querySelectorAll(selector);
				for (var i = 0; i < els.length; i++) {
					for (var ii = 0; ii < this.length; ii++) {
						if (els[i] === this[ii]) {
							for (var n = selector; n < this.length - 1; n++) {
								this[n] = this[n + 1];
							}
							this.length--;
						}
					}
				}
			}
			return this;
		},
		get:function (num) {
			if (typeof num == "number") return new _(this[num]);
			if (typeof num == "string") {
				var l = [];
				for (var i = 0; i < this.length; i++) {
					var el = this[i].querySelectorAll(num);
					for (var n = 0; n < el.length; n++) {
						l.push(el[n]);
					}
				}
				for (var i = 0; i < l.length; i++) {
					this[i] = l[i];
				}
				this.length = l.length;
				return this;
			}
			return this;
		},
		appendTo:function (parent) {
			if (typeof parent == "undefined") {
				for (var i = 0; i < this.length; i++) {
					document.body.appendChild(this[i]);
				}
			} else if (typeof parent == "object") {
				for (var i = 0; i < this.length; i++) {
					if (parent.length) {
						parent[0].appendChild(this[i]);
					} else {
						parent.appendChild(this[i]);
					}
				}
			} else if (typeof parent == "string") {
				for (var i = 0; i < this.length; i++) {
					document.querySelectorAll(parent)[0].appendChild(this[i]);
				}
			} else if (typeof parent == "number" && window._.index[parent]) {
				for (var i = 0; i < this.length; i++) {
					window._.index[parent].appendChild(this[i]);
				}
			}
			return this;
		},
		append:function (child) {
			if (typeof child == "undefined") {
				throw "First Parameter";
			} else if (typeof child == "object") {
				if (child.length) {
					for (var i = 0; i < child.length; i++) {
						this[0].appendChild(child[i]);
					}
				} else {
					this[0].appendChild(child);
				}
			} else if (typeof child == "string") {
				try {var el = document.querySelectorAll(child);}
				catch (e) {
					var el = {length:0};
				}
				if ((el.length || 0) <= 0) {
					this[0].innerHTML += child;
				} else {
					for (var i = 0; i < el.length; i++) {
						this[0].appendChild(el[i]);
					}
				}
			} else if (typeof child == "number" && window._.index[child]) {
				this[0].appendChild(window._.index[child]);
			}
			return this;
		},
		css:function (selector, value) {
			if (typeof selector == "string" && typeof value == "string" && arguments.length >= 2) {
				for (var i = 0; i < arguments.length - 1; i += 2) {
					for (var ii = 0; ii < this.length; ii++) {
						this[ii].style[arguments[i]] = arguments[i + 1];
					}
				}
			} else if (typeof selector == "string" && (typeof value == "undefined" || typeof value == "boolean")) {
				if (selector.indexOf(":") == -1) {
					if (value === true) {
						var result = this[0].style[selector].match(/\-{0,1}[0-9]*\.{0,1}[0-9]*/i)[0];
						return (parseFloat(result));
					} else {
						return this[0].style[selector];
					}
				} else {
					var arr = selector.split(";");
					for (var i = 0; i < arr.length; i++) {
						var tmp = arr[i].split(":");
						tmp[0] = tmp[0].replace(/(^\s|\s*?$)*?/gmi, "");
						tmp[1] = tmp[1].replace(/(^\s|\s*?$)*?/gmi, "");
						for (var ii = 0; ii < this.length; ii++) {
							this[ii].style[tmp[0]] = tmp[1];
						}
					} 
				}
			} else if (typeof selector == "object") {
				for (var key in selector) {
					for (var i = 0; i < this.length; i++) {
						this[i].style[key] = selector[key];
					}
				}
			}
			return this;
		},
		attr:function (selector, value) {
			if (typeof selector == "string" && typeof value == "string" && arguments.length >= 2) {
				for (var i = 0; i < arguments.length - 1; i += 2) {
					for (var ii = 0; ii < this.length; ii++) {
						this[ii].setAttribute(arguments[i], arguments[i + 1]);
					}
				}
			} else if (typeof selector == "string" && typeof value == "undefined") {
				if (selector.indexOf("]") == -1) {
					return this[0].getAttribute(selector);
				} else {
					var arr = selector.split("]");
					for (var i = 0; i < arr.length; i++) {
						var tmp = arr[i].split("=");
						tmp[0] = tmp[0].replace(/(^\s|^\[|\s*?$)*?/gmi, "");
						tmp[1] = tmp[1].replace(/(^\s|\s*?$)*?/gmi, "").replace(/\"/gmi, "");
						for (var ii = 0; ii < this.length; ii++) {
							this[ii].setAttribute(tmp[0],tmp[1]);
						}
					} 
				}
			} else if (typeof selector == "object") {
				for (var key in selector) {
					for (var i = 0; i < this.length; i++) {
						this[i].setAttribute(key,selector[key]);
					}
				}
			}
			return this;
		},
		prop:function (name, value) {
			if (typeof name == "string" && typeof value !== "undefined" && arguments.length >= 2) {
				for (var i = 0; i < arguments.length - 1; i += 2) {
					for (var ii = 0; ii < this.length; ii++) {
						this[ii][arguments[i]] = arguments[i + 1];
					}
				}
			} else if (typeof name == "string" && typeof value == "undefined") {
				return this[0][name];
			} else if (typeof name == "object") {
				for (var key in name) {
					for (var i = 0; i < this.length; i++) {
						this[i][key] = name[key];
					}
				}
			}
			return this;
		},
		html:function (html) {
			if (typeof html == "string") {
				for (var i = 0; i < this.length; i++) {
					this[i].innerHTML = html;
				}
				return this;
			} else if (typeof html == "undefined") {
				return this[0].innerHTML;
			}
			return this;
		},
		text:function (text) {
			if (typeof text == "string") {
				for (var i = 0; i < this.length; i++) {
					this[i].innerText = text;
				}
				return this;
			} else if (typeof text == "undefined") {
				return this[0].innerText;
			}
			return this;
		},
		value:function (value) {
			if (typeof value == "string") {
				for (var i = 0; i < this.length; i++) {
					this[i].value = value;
				}
				return this;
			} else if (typeof value == "undefined") {
				return this[0].value;
			}
			return this;
		},
		on:function (str, obj) {
			if (typeof str == "string" && typeof obj == "function") {
				for (var i = 0; i < this.length; i++) {
					var nm = (str.toLowerCase().substring(0,2) == "on" ? str.toLowerCase() : "on" + str.toLowerCase());
					this[i][nm] = obj;
				}
			} else if (typeof str == "object") {
				for (var i = 0; i < this.length; i++) {
					for (var key in str) {
						var nm = (key.toLowerCase().substring(0,2) == "on" ? key.toLowerCase() : "on" + key.toLowerCase());
						this[i][nm] = str[key];
					}
				}
			} else {
				throw "invalid parameters.";
			}
			return this;
		},
		trigger:function (type, options) {
			type = type.replace(/^(on)/, "");
			switch (type) {
				case 'click':
					for (var i = 0; i < this.length; i++) {
						var args = {"button":0, "relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var clickEvent = new MouseEvent('click', args);
						this[i].dispatchEvent(clickEvent);
					}
					break;
				case 'contextmenu':
					for (var i = 0; i < this.length; i++) {
						var args = {"button":2, "relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var mEvent = new MouseEvent('contextmenu', args);
						this[i].dispatchEvent(mEvent);
					}
					break;
				case 'mousedown':
					for (var i = 0; i < this.length; i++) {
						var args = {"button":0, "relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var downEvent = new MouseEvent('mousedown', args);
						this[i].dispatchEvent(downEvent);
					}
					break;
				case 'mouseup':
					for (var i = 0; i < this.length; i++) {
						var args = {"button":0, "relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var upEvent = new MouseEvent('mouseup', args);
						this[i].dispatchEvent(upEvent);
					}
					break;
				case 'mouseenter':
					for (var i = 0; i < this.length; i++) {
						var args = {"relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var mEvent = new MouseEvent('mouseenter', args);
						this[i].dispatchEvent(mEvent);
					}
					break;
				case 'mouseleave':
					for (var i = 0; i < this.length; i++) {
						var args = {"relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var mEvent = new MouseEvent('mouseleave', args);
						this[i].dispatchEvent(mEvent);
					}
					break;
				case 'mouseover':
					for (var i = 0; i < this.length; i++) {
						var args = {"relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var mEvent = new MouseEvent('mouseover', args);
						this[i].dispatchEvent(mEvent);
					}
					break;
				case 'mouseout':
					for (var i = 0; i < this.length; i++) {
						var args = {"relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var mEvent = new MouseEvent('mouseout', args);
						this[i].dispatchEvent(mEvent);
					}
					break;
				case 'keydown':
					for (var i = 0; i < this.length; i++) {
						var args = {"relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var kEvent = new KeyboardEvent('keydown', args);
						this[i].dispatchEvent(kEvent);
					}
					break;
				case 'keyup':
					for (var i = 0; i < this.length; i++) {
						var args = {"relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var kEvent = new KeyboardEvent('keyup', args);
						this[i].dispatchEvent(kEvent);
					}
					break;
				case 'keypress':
					for (var i = 0; i < this.length; i++) {
						var args = {"relatedTarget":this[i]};
						if (typeof options == "object") {
							for (var key in options) args[key] = options[key];
						}
						var kEvent = new KeyboardEvent('keypress', args);
						this[i].dispatchEvent(kEvent);
					}
					break;
				default:
					break;
			}
			return this;
		},
		remove:function () {
			for (var i = 0; i < this.length; i++) {
				this[i].parentNode.removeChild(this[i]);
			}
		},
		parent:function () {
			this[0] = this[0].parentNode;
			this.length = 1;
			return this;
		},
		forEach:function (func) {
			for (var i = 0; i < this.length; i++) {
				func(_(this[i]));
			}
			return this;
		}
	};
	window._.xhr = function (type, url, callback, data) {
			var ajax = new XMLHttpRequest();
			if (typeof type == "object") {
				ajax.open(type.type, type.url, true);
				ajax.onreadystatechange = (function () {
					if (ajax.readyState == 4 && ajax.status == 200) {
						this.cb(ajax.responseText);
					}
				}).bind(ajax);
				ajax.cb = type.callback;
				ajax.send((type.data || ""));
			} else {
				ajax.open(type, url, true);
				ajax.onreadystatechange = (function () {
					if (ajax.readyState == 4 && ajax.status == 200) {
						this.cb(ajax.responseText);
					}
				}).bind(ajax);
				ajax.cb = callback;
				ajax.send((data || ""));
			}
	};
	window._.cors = function (type, url, callback, credentials, data) {
			var ajax = ("withCredentials" in new XMLHttpRequest() ? new XMLHttpRequest() : (null));
			if (ajax == null) throw "CORS not supported.";
			if (typeof type == "object") {
				ajax.open(type.type, type.url, true);
				ajax.withCredentials = type.credentials;
				ajax.cb = type.callback;
				ajax.onload = (function () { this.cb(ajax.responseText); }).bind(ajax);
				ajax.send((type.data || ""));
			} else {
				ajax.open(type, url, true);
				ajax.withCredentials = credentials;
				ajax.cb = callback;
				ajax.onload = (function () { this.cb(ajax.responseText); }).bind(ajax);
				ajax.send((data || ""));
			}
	};
	window._.jsnop = function (url, callback) {
			var scrpt = document.createElement("script");
			var salt = (Math.floor(Math.random() * 100) + 1);
			if (typeof url == "object") {
				window["fnctn" + salt] = url.callback;
				scrpt.src = url.url + "fnctn" + salt;
				_("head").append(scrpt);
				scrpt.onload = function () {_(this).remove();}
			} else {
				window["fnctn" + salt] = callback;
				scrpt.src = url + "fnctn" + salt;
				_("head").append(scrpt);
				scrpt.onload = function () {_(this).remove();}
			}
	};
	window._.math = {
		vectors:{
			add:function (va, vb) {
				if (va.constructor !== Array || vb.constructor !== Array) throw "Error: Paramaters must be arrays";
				var result = []; 
				for (var i = 0; i < (va.length > vb.length ? va.length : vb.length); i++) {
					result.push((va[i] || 0) + (vb[i] || 0));
				}
				return result;
			},
			subtract:function (va, vb) {
				if (va.constructor !== Array || vb.constructor !== Array) throw "Error: Paramaters must be arrays";
				var result = []; 
				for (var i = 0; i < (va.length > vb.length ? va.length : vb.length); i++) {
					result.push((va[i] || 0) - (vb[i] || 0));
				}
				return result;
			},
			crossProduct:function (va, vb) {
				if (va.constructor !== Array || vb.constructor !== Array) throw "Error: Paramaters must be arrays";
				var a = [], b = [];
				for (var i = 0; i < 3; i++) {
					a[i] = (va[i] || 0);
					b[i] = (vb[i] || 0);
				}
				return [
					(a[1]*b[2])-(a[2]*b[1]),
					(a[2]*b[0])-(a[0]*b[2]),
					(a[0]*b[1])-(a[1]*b[0])
				];
			},
			dotProduct:function (va, vb) {
				if (va.constructor !== Array || vb.constructor !== Array) throw "Error: Paramaters must be arrays";
				var result = 0;
				for (var i = 0; i < (va.length > vb.length ? va.length : vb.length); i++) {
					result += (va[i] || 0) * (vb[i] || 0);
				}
				return result;
			}
		},
		calculus:{
			integrate:function (expression, upper, lower, sections) {
				if (typeof expression !== "function") throw "Error: Expression must be a function";
				sections = sections || 1500000;
				var y = 0, x = 0, result = 0, dx = (Math.abs(upper - lower) / sections), prev = 0;
				if (lower > upper) {
					var t = upper;
					upper = (lower);
					lower = (t);
				} else if (lower == upper) {
					result = 0;
					return result;
				}
				for (x = lower; x <= upper; x += dx) {
					try {
						y = expression(x) || 0;
					} catch (e) {
						y = 0;
					}
					result += ((dx / 2) * (prev + y)) || 0;
					prev = y;
				}
				return result;
			},
			derive:function (expression, point, section) {
				if (typeof expression !== "function") throw "Error: Expression must be a function";
				section = section || 1500000;
				var y = 0, dx = (1 / section), upper = 0, lower = 0, r = 0;
				try {
					upper = expression(point + dx);
					lower = expression(point - dx);
					r = expression(point);
				} catch(e) {
					throw "Error: Your expression did not evaluate properly";
				}
				return (((upper - r) * section) + ((r - lower) * section)) / 2;
			}
		}
	}
})(window);