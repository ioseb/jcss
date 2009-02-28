/**
 * jCSS - Library Agnostic CSS Selector Engine - v0.2
 *
 * Copyright (c) 2009 Ioseb Dzmanashvili (http://www.code.ge)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
*/
(function() {
	
	var jCSS = function(query, context) {
		
		if (typeof query == 'string') {
			
			var regexs = [
				/\[(?!.*\])/g,
				/\((?!.*\))/g,
				/<|{|}|<.*?>|\(\s*\)/
			];
		
			for (var i = 0, regex; regex = regexs[i++];) {
				if (regex.test(query)) {
					 throw 'Syntax error. Invalid Query: ' + query; 
				}
			}
			
		}
			
		if (typeof context == 'string') {
			context = jCSS(context);
		} else {
			context = context || document;
		}
		
		if (context.nodeType && context.nodeType != 1 && context.nodeType != 9) {
			return [];
		}
		
		query = query.replace(/^\s*|\s*$/g, '');
			
		var inArray = function(arr, el) {
			if (arr.indexOf) {
				return arr.indexOf(el);
			} else {
				for (var i = 0, item; item = arr[i++];) {
					if (item === el) return i - 1;
				}
			}
			return -1;
		};
		
		function contains(a, b){
			return a.contains ? a !== b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
		};
		
		var pseudo = function() {
			
			var each = function(list, fn) {
				for (var i = 0, nodes = [], node; node = list[i++];) {
					if (fn.call(node)) nodes.push(node);
				}
				return nodes;
			};
			
			var input = function(list, type) {
				return each(list, function() { return this.type === type; });
			};
			
			return {		
				':only-child': function(list) {
					for (var i = 0, nodes = [], temp = [], node; node = list[i++];) {
						for (var o = node.parentNode.firstChild, skip = true; o; o = o.nextSibling) {
							if (skip = (o.nodeType == 1 && o !== node)) break;
						}
						if (!skip) nodes.push(node);
					}
					return nodes;
				},			
				':last-child': function(list) {
					for (var i = 0, nodes = [], node; node = list[i++];) {
						for (var o = node.nextSibling, skip = o; o; o = o.nextSibling) {
							if (skip = (o.nodeType == 1)) break;
						}
						if (!skip) nodes.push(node);
					}
					return nodes;
				},			
				':first-child': function(list) {
					for (var i = 0, nodes = [], node; node = list[i++];) {
						for (var o = node.previousSibling, skip = o; o; o = o.previousSibling) {
							if (skip = (o.nodeType == 1)) break;
						}
						if (!skip) nodes.push(node);
					}
					return nodes;
				},
				
				/**
				 * @TODO rewrite "nt-child" completely, it's very slow
				 */
				':nth-child': function(list, value) {
					
					function filter(arr, step, nodes) {
						var start = 0, temp = [], result = [], el;
						while (el = arr[start]) {
							for (var i = 0, len = nodes.length; i < len; i++) {
								if (el === nodes[i]) {
									result.push(el);
									nodes.splice(0, i);
									break;
								}
							}
							start += step;
						}
						return result;
					}
					
					value = value.replace(/\s+/g, '')
								 .replace('odd', '2n+1')
								 .replace('even', '2n+2')
								 .replace(/^(\d+)n$/, '$1n+$1')
								 .replace(/^0n\+(\d+)$/, '$1')
								 .replace(/^(\d+)n\-(\1)$/, '$1n+$1')
								 .replace(/^(1)?n(\+0)?$/, 'n');
					
					if (value == 'n') {
						return list;
					}
					
					var parents = [], groups = {};
					
					for (var i = 0, index, parent, node; node = list[i++];) {
						if ((index = inArray(parents, (parent = node.parentNode))) == -1) {
							index = parents.push(parent) - 1;
						}
						if (!groups[index]) {
							groups[index] = [];
						}
						groups[index].push(node);
					}
					
					var nodes = [], start = 0, chunk = 0;
					
					if (/(\d+)n(\+|-)(\d+)/.test(value)) {
						start = parseInt(RegExp.$3);
						chunk = parseInt(RegExp.$1);
						if (RegExp.$2 == '+') {						
							start = start > 0 ? start - 1 : chunk - 1;
						} else if (RegExp.$2 == '-') {
							start = chunk - start - 1;
						}
					}
					
					if (chunk > 0) {
						for (i in groups) {
							for (var node = parents[i].firstChild, children = []; node; node = node.nextSibling) {
								if (node.nodeType == 1) children.push(node);
							}
							Array.prototype.push.apply(nodes, filter(children.slice(start), chunk, groups[i]));
						}
						return nodes;
					}
					
					if (!isNaN(value)) {
						value = parseInt(value) - 1;
						for (i in groups) {
							if (groups[i][value]) {
								nodes.push(groups[i][value]); 
							}
						}
						return nodes;
					}
					
					return [];
					
				},
				':nth': function(list, value) {
					return this[':eq'](list, value);
				},
				':first': function(list) {
					return list.length ? [list[0]] : [];
				},
				':last': function(list) {
					return list.length ? [list[list.length - 1]] : [];
				},
				':even': function(list) {
					for (var i = 0, nodes = [], node; node = list[i]; i+=2) { 
						nodes.push(node); 
					}
					return nodes;
				},
				':odd': function(list) {
					for (var i = 1, nodes = [], node; node = list[i]; i+=2) { 
						nodes.push(node); 
					}
					return nodes;
				},
				':not': function(list, value) {
					var tokens = value.split(/\s*,\s*/);
					for (var i = 0, token; token = tokens[i++];) {
						list = getTag(token.replace(/\.(.+)/, '[class~=$1]').replace(/#(.+)/, '[id=$1]')).not(list);
					}
					return list;
				},
				':selected': function(list, value) {
					return each(list, function() {
						//Safari fix, trick from jQuery
						this.parentNode.selectedIndex;
						return this.selected == true; 
					});
				},
				':checked': function(list, value) {
					return each(list, function() { 
						return this.checked === true; 
					});
				},
				':empty': function(list, value) {
					return each(list, function() {
						return this.childNodes.length == 0;
					});
				},
				':disabled': function(list, value) {
					return each(list, function() { 
						return this.disabled == true; 
					});
				},
				':enabled': function(list, value) {
					return each(list, function() { 
						return this.disabled == false; 
					});
				},
				':visible': function(list, value) {
					return each(list, function() {
						return (this.offsetWidth | this.offsetHeight) > 0;
					});
				},
				':hidden': function(list, value) {
					return each(list, function() { 
						return this.offsetWidth == 0 || this.offsetHeight == 0;
					});
				},
				':contains': function(list, value) {
					return each(list, function() { 
						return inArray((this.innerText || this.textContent || ''), value) > -1; 
					});
				},
				':header': function(list, value) {
					return each(list, function() { 
						return /h[1-6]/i.test(this.nodeName); 
					});
				},
				':eq': function(list, value) {
					return !isNaN(value) && list[value] ? [list[value]] : [];
				},
				':gt': function(list, value) {
					var nodes = [];
					if (!isNaN(value) && list.length > value) {
						for (var i = parseInt(value) + 1, node; node = list[i++];) { nodes.push(node); }
					}
					return nodes;
				},
				':lt': function(list, value) {
					var nodes = [];
					if (!isNaN(value) && list.length >= value) {
						for (var i = 0, node; i < value && (node = list[i++]);) { nodes.push(node); }
					}
					return nodes;
				},
				':has': function(list, value) {
					return each(list, function() { 
						return jCSS(value, this).length > 0; 
					});
				},
				':input': function(list) {
					return each(list, function() { 
						return /^input|button|textarea|select$/i.test(this.nodeName); 
					});
				},
				':radio': function(list) { 
					return input(list, 'radio'); 
				},
				':checkbox': function(list) { 
					return input(list, 'checkbox'); 
				},
				':text': function(list) { 
					return input(list, 'text'); 
				},
				':image': function(list) {
					return input(list, 'image'); 
				},
				':submit': function(list) {
					return input(list, 'submit'); 
				},
				':lang': function(list, value) { 
					return each(list, function() { 
						return (this.getAttribute('lang') || this.lang) == value; 
					}); 
				},
				':root': function() {
					return [document.documentElement];
				}
			};
			
		}();
		
		var attfn = function() {
			
			var attName = function(att) {
				return {'class': 'className', 'for': 'htmlFor'}[att] || att;
			};
			
			var attVal = function(el, att) {
				return el.getAttribute(att, 2) || el[attName(att)] || '';
			};
			
			return {
				'=': function(att, value) {
					return function() {	
						return value ? attVal(this, att) == value : !attVal(this, att); 
					};
				},
				'*=': function(att, value) {
					return function() { 
						return inArray(attVal(this, att), value) > -1; 
					};
				},
				'!=': function(att, value) {
					return function() { 
						return value ? attVal(this, att) != value : !!attVal(this, att); 
					};
				},
				'^=': function(att, value) {
					return function() { 
						return inArray(attVal(this, att), value) == 0; 
					};
				},
				'$=': function(att, value) {
					return function() { 
						var val = attVal(this, att);
						return val.substr(val.length - value.length) == value; 
					};
				},
				'~=': function(att, value) {
					return function() {
						return new RegExp('(^|\\s)' + value + '(\\s|$)').test(attVal(this, att)); 
					};
				},
				'|=': function(att, value) {
					return function() { 
						return new RegExp('(^|-)' + value + '(-|$)').test(attVal(this, att)); 
					};
				},
				'': function(att, value) {
					return function() { 
						return !!attVal(this, att); 
					};
				}
			};
			
		}();
		
		function getTag(token) {
	
			var regex1   = /^(>|~|<|\+|)(\w+|\*)?(?:(#|\.)(.+))?(.*)/,	    //match whole token
                regex2   = /(?:\[\w+(?:(?:(?:!|\*|\^|\$|~|\||)=.*))?\])+$/, //match attribute selectors at the end of the string
                regex3   = /(\:[-\w]+)(?:\((.*?)\))?$/,					    //match pseudo classes at the end of the string
                matches  = regex1.exec(token);
			
			token = (matches[4] || '') + (matches[5] || ''); 
			
			var relation = matches[1] || '',
                name     = (matches[2] || '*').toUpperCase(),
                isID     = matches[3] == '#',
                ID       = null,
                isClass  = matches[3] == '.',
                CLASS    = null,
                filters  = [],
                pseudos  = [];
			
			while (matches = regex2.exec(token)) {
				token = RegExp.leftContext || '';
				var regex = /\[\s*(\w+)\s*(?:(!|\*|\^|\$|~|\||)(=)\s*(.*?\]?))?\s*\]/,
					att   = matches[0];
				while(matches = regex.exec(att)) {
					att = RegExp.rightContext;
					if (matches.length == 5) {
						var fn = (matches[2] || '') + (matches[3] || '');	
						if (fn !== null && (fn = attfn[fn])) {
							filters.push(fn(matches[1], matches[4] || ''));
						}
					}
				}
			}
			
			var temp = [];
			
			while (matches = regex3.exec(token)) {
				token = RegExp.leftContext || '';
				if (matches.length == 3) {
					if (!pseudo[matches[1]]) {
						temp.push(matches[1]);
					} else {
						pseudos.push(matches);
					}
				}
			}
			
			if (isID) ID = token.replace(/\\/g, '') + temp.join('');
			if (isClass) CLASS = token + temp.join('');
			
			if (relation == '>') {
				filters.push(function(context) {
					return this.parentNode === context;
				});
			}
			
			function filter(el, context) {
				var i = filters.length;
				if (i > 0) {
					while (i--) {
						if (!filters[i].call(el, context)) return false;
					}
				}
				return true;
			};
			
			var getNodes = function(context) {
				
				var el, nodes = [];
				
				if (isID) {
					if (el = document.getElementById(ID)) {
						if (document.all && el.attributes['id'].value != ID) {
							for (var i = 0, found = false, node; node = document.all[ID][i++];) {
								if (found = (node.attributes['id'].value == ID)) {
									el = node;
									break;
	 							}
							}
							if (found) return nodes;
						}
						if ((name == '*' || name == el.nodeName) && filter(el, context) && (context !== document && context !== el ? contains(context, el) : true)) {
							nodes.push(el);
						}
					}
				} else if (!relation || relation == '>') {
					
					if (isClass && !window.opera && document.documentElement.getElementsByClassName) {
						
						CLASS = CLASS.replace(/(\w+)\.(\w+)/g, '$1 $2');
						
						for (i = 0, items = context.getElementsByClassName(CLASS.replace(/\\/g, '')), node; node = items[i++];) {
							if (name == '*' || node.nodeName == name && filter(node, context)) {
								nodes.push(node);							
							}
						}
						
					} else {
						
						if (isClass) {
							filters.push(attfn['~=']('class', CLASS));
						}
						
						var all = name === '*';
						
						for (var i = 0, items = context.getElementsByTagName(name), node; node = items[i++];) {
							if (all) {
								if (isClass) {
									if (node.className && filter(node, context)) {
										nodes.push(node);
									}
								} else {
									if (node.nodeType == 1 && filter(node, context)) nodes.push(node);
								}
							} else {
								if (filter(node, context)) nodes.push(node);
							}
						}
						
					}
				}
				return nodes;
			};
			
			return {
				name: name,
				relation: relation,
				pseudo: function(list) {
					if (pseudos.length) {
						pseudos = pseudos.reverse();
						temp = [];
						for (var i = 0, v; v = pseudos[i++];) {
							temp.push(v);
						}
						for (i = 0, v; v = temp[i++];) {
							list = pseudo['' + v[1]](list, '' + (v[2] || null));
						}
					}				
					return list;
				},
				not: function(list) {
					for (var i = 0, nodes = [], node; node = list[i++];) {
						if (name == '*' && (!filters.length || !filter(node))) {
							nodes.push(node);
						} else if (name != '*' && filters.length && node.nodeName == name && !filter(node)) {
							nodes.push(node);
						} else if (name != '*' && !filters.length && node.nodeName != name) {
							nodes.push(node);
						} else if (name != '*' && node.nodeName != name) {
							nodes.push(node);
						}
					}
					var result = this.pseudo(nodes);
					if (pseudos.length) {
						for (var i = 0, idx; node = result[i++];) {
							if ((idx = inArray(nodes, node)) > -1) {
								nodes.splice(idx, 1);
							}
						}
					}				
					return nodes;
				},
				elements: function(context) {
					var result = [];
					if (!relation || relation == '>') {
						result = getNodes(context);
					} else if (relation == '+' || relation == '~') {
						for (var o = context.nextSibling; o; o = o.nextSibling) {
							if (o.nodeType == 1) {
							 	if (o.nodeName == name && filter(o)) {
									result.push(o);
								}
								if (relation == '+') break;
							}
						}
					}
					return result;
				}
			};
			
		};
		
		var getQuery = function(query) {
			
			query = query.replace(new RegExp('&gt;', 'g'), '>')
						 .replace(/[\'\"]/g, '')
						 .replace(/((\[)\s*|\s*(\]))/g, '$2$3')
						 .replace(/\s*(=|\$|\^|!|\*=)\s*/g, '$1')
						 .replace(/table\s+tr\s+td/g, 'td')
						 .replace(/tr\s+td/g, 'td');
	
			var expr = [];
			
			while (query != (query = query.replace(/\([^\(\)]*\)/g, function(match) {
				return '#__' + (expr.push(match.replace(/\s*,\s*/g, ',')) - 1); 
			})));
	
			query = query.replace(/\s*,\s*/g, ':::')
		 				 .replace(/\s+/g, '@@@')
						 .replace(/@*(>|~|\+)@*([^\d=])/g, '@@@$1$2');
	
			for (var i = expr.length - 1, token; token = expr[i--];) {
				query = query.replace(new RegExp('#__' + (i + 1), 'g'), token);
			}
			
			return query;
			
		},
		
		getQueries = function(query) {		
			for (var i = 0, queries = getQuery(query).split(':::'), result = []; i < queries.length; i++) {
				if (inArray(result, queries[i]) == -1) {
					result.push(queries[i].replace(/^@+/, ''));
				}
			}		
			return result;		
		},
		
		duplicates = false,
		
		unique = function(nodes) {			
			if (duplicates) {
				for (var i = 1; i < nodes.length; i++) {
					if (nodes[i] === nodes[i-1]) {
						nodes.splice(i--, 1);
					}
				}
				duplicates = false;
			}		
			return nodes;
		},
		
		/**
		 * Comparator function is used to sort elements in document order,
		 * solution is adapted version of the code found at Google's doctype project:
		 * http://code.google.com/p/doctype/wiki/ArticleNodeCompareDocumentOrder
		 */
		comparator = function(a, b) {
			
			if (a === b) {
				duplicates = true;
				return 0;
			}
			
			if (a.compareDocumentPosition) {
				return a.compareDocumentPosition(b) & 2 ? 1 : -1;
			}
			
			if ('sourceIndex' in a) {
				return a.sourceIndex - b.sourceIndex;
			}
			
			var doc = a.ownerDocument, r1 = doc.createRange(), r2 = doc.createRange();
			r1.selectNode(a);
			r1.collapse(true);
			r2.selectNode(b);
			r2.collapse(true);
	
			return r1.compareBoundaryPoints(Range.START_TO_END, r2);
	
		},
		
		querySelectorAll = function(query) {

			var result = [], queries = getQueries(query);
			
			for (var i = 0; query = queries[i++];) {
	
				var tokens, contexts = context && context.length ? context : [context];
	
				tokens = query.split('@@@');
	
				if (tokens.length == 1 && tokens[0] == 'body') {
					return [document.body];
				}
	
				if (tokens[1] && tokens[0] == 'body') {
					tokens.shift();
				}
	
				for (var j = 0, token; token = tokens[j++];) {
					
					var temp = [], current = getTag(token), next;

					for (var k = 0, parent; parent = contexts[k++];) {
						Array.prototype.push.apply(temp, current.elements(parent));
					}
					
					if (temp.length > 1 && tokens.length > 1 && j < tokens.length) {
						if (tokens[j]) {
							if (!(next = getTag(tokens[j])).relation) {
								for (k = 1; k < temp.length; k++) {
									if (contains(temp[k - 1], temp[k])) {
										temp.splice(k--, 1);
									}
								}
							} else if (next.relation == '~') {
								var node, nodes = [], parents = [];
								for (i = 0; node = temp[i++];) {
									if (inArray(parents, (parent = node.parentNode)) == -1) {
										parents.push(parent);
										nodes.push(node);
									}								
								}
								temp = nodes;
							}
						}
					}
					
					contexts = current.pseudo(temp.slice());
					
				}
	
				Array.prototype.push.apply(result, contexts);
	
			}
	
			if (queries.length > 1 || context.length > 1) {
				result.sort(comparator);
				result = unique(result);
			}
			
			return result;
			
		};
		
		var result = [];
		
		/**
		 * @TODO remove "param" checking
		 */
		if (document.querySelectorAll && !/\bparam\b/.test(query)) {
			try {
				var contexts = context.length ? context : [context];
				for (var j = 0, scope; scope = contexts[j++];) {
					var nodes = scope.querySelectorAll(query);
					try {
						nodes = Array.prototype.slice.call(nodes);
						Array.prototype.push.apply(result, nodes);
					} catch(ex) {
						for (var i = 0, len = nodes.length; i < len;) {
							result.push(nodes[i++]);
						}
					}
				}
				if (contexts.length > 1) {
					result.sort(comparator);
					result = unique(result);
				}
			} catch(ex1) {
				result = querySelectorAll(query);
			}
		} else {
			result = querySelectorAll(query);
		}
		
		return result;
		
	};
	
	window.jCSS = jCSS;
	
})();