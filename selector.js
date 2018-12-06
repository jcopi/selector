if (!Object.assign) {
    Object.assign = function (target) {
        for (var i = 1; i < arguments.length; ++i) {
            for (var key in arguments[i]) {
                if (Object.prototype.hasOwnProperty(arguments[i], key)) {
                    target[key] = arguments[i][key];
                }
            }
        }
        return target;
    }
}

function $ (selector, parent) {
    if (window === this)
        return new $(selector, parent);

    return $.css(selector, parent);
}

function Selector (elements, parent) {
    if (window === this)
        return new Selector(elements);

    this.elements = elements;
    this.parent = parent;
}

$.id = function (id, parent) {
    parent = (parent && "getElementById" in parent) ? parent : document;
    var element = parent.getElementById(id[0] == '#' ? id.substring(1) : id);
    element = element ? [element] : [];
    return new Selector(element, parent);
};
$.css = function (selector, parent) {
    parent = (parent && "querySelectorAll" in parent) ? parent : document;
    var elements;
    try { elements = [].slice.call(parent.querySelectorAll(selector)); } catch (e) { console.error("No elements found."); }
    return new Selector(elements, parent);
};
$.tag = function (tname, parent) {
    parent = (parent && "getElementsByTagName" in parent) ? parent : document;
    var elements;
    try { elements = [].slice.call(parent.getElementsByTagName(tname)); } catch (e) { console.error("No elements found."); }
    return new Selector(elements, parent);
};
$.name = function (name, parent) {
    parent = (parent && "getElementsByName" in parent) ? parent : document;
    var elements;
    try { elements = [].slice.call(parent.getElementsByName(tname)); } catch (e) { console.error("No elements found."); }
    return new Selector(elements, parent);
};
$.class = function (cname, parent) {
    parent = (parent && "getElementsByClassName" in parent) ? parent : document;
    var elements;
    try { elements = [].slice.call(parent.getElementsByClassName(cname[0] == '.' ? cname.substring(1) : cname)); } catch (e) { console.error("No elements found."); }
    return new Selector(elements, parent);
};
$.element = function (el, parent) {
    parent = parent || document;
    return new Selector([el], parent);
};
$.slist = function (els, parent) {
    parent = parent || document;
    var elements;
    try { elements = [].slice.call(els); } catch (e) { console.error("No elements found."); }
    return new Selector(elements, parent);
};
$.list = function (els, parent) {
    parent = parent || document;
    var elements = els;
    try {
        if (!Array.isArray(elements))
            elements = [].slice.call(els);
        $.utils.array.removeDuplicates(elements);
    } catch (e) { console.error("No elements found."); }
    return new Selector(elements, parent);
};
$.compile = function (selector) {
    // O(n)
    if (!selector.startsWith('<') || !selector.endsWith('>')) {
        console.error("Invalid element creation string.");
    }
    selector = selector.substring(1, selector.length - 1);
    selector += '\0';
    let chkArray = ['.','#','$','[',']','\0'];
    //let element = null;
    let creator = null;
    let fqueue = [];
    for (let i = 0, state = 0, ptr = 0, esc = false, strStart = -1, tmp = ""; i < selector.length; ++i) {
        if (esc) {
            tmp += selector[i];
            esc = false;
            continue;
        } else if (selector[i] == "\\") {
            esc = true;
            continue;
        } else if (strStart >=  0) {
            if (selector[i] == selector[strStart]) {
                tmp += selector.slice(strStart + 1, i);
                strStart = -1;
            }
            continue;
        } else if (selector[i] == "'" || selector == '"') {
            strStart = i;
            continue;
        }

        let chk = chkArray.indexOf(selector[i]);
        if (chk >= 0) {
            switch (state) {
            case 0:
                creator = document.createElement.bind(document, tmp);
                //element = document.createElement(tmp);
                break;
            case 1:
                fqueue.push(function (a, b) {
                    b.classList.add(a);
                }.bind(null, tmp));
                //element.classList.add(tmp);
                break;
            case 2:
                fqueue.push(function (a, b) {
                    b.id = a;
                }.bind(null, tmp));
                //element.id = tmp;
                break;
            case 3:
                fqueue.push(function (a, b) {
                    b.name = a;
                }.bind(null, tmp));
                //element.name = tmp;
                break;
            case 4:
                if (chk !== 4)
                    continue;

                let vals = tmp.split('=', 2);
                fqueue.push(function (a, b, c) {
                    c.setAttribute(a,b);
                }.bind(null, vals[0], vals[1]));
                //element.setAttribute(vals[0], vals[1]);
                break;
            }
            
            state = chk + 1;
            tmp = "";
        } else {
            tmp += selector[i];
        }
    }

    return function (create, fnQueue) {
        var x = create.call(document);
        fnQueue.forEach(function (v) {
            v.call(null, x);
        });
        return new Selector([x], document);
    }.bind(null, creator, fqueue);
};
$.build = function (str) {
    return $.compile(str)();
};

$.utils = {
    array: {
        backSwap: function (arr, i) {
            var tmp = arr[i];
            arr[i] = arr[arr.length - 1];
            arr[arr.length - 1] = tmp;
        },
        unorderedRemove: function (arr, i) {
            arr[i] = arr[arr.length - 1];
            arr.pop();
        },
        removeDuplicates: function (arr) {
            for (var i = 0; i < arr.length; ++i) {
                for (var j = i + 1; j < arr.length; ++j) {
                    if (arr[i] === arr[j]) {
                        $.utils.array.unorderedRemove(arr, i--);
                        break;
                    }
                }
            }
        }
    }
}

Selector.prototype = {
    constructor: Selector,
    map: function (fn) {
        return this.elements.map(fn);
    },
    filter: function (fn) {
        return new Selector(this.elements.filter(fn), this.parent);
    },
    forEach: function (fn) {
        this.elements.forEach(fn);
        return this;
    },
    reduce: function (fn, init) {
        return this.elements.reduce(fn, init);
    },
    concat: function (sels) {
        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).");
        this.elements.concat(sels.elements);
        return this;
    },

    append: function (sel) {
        sel.elements.forEach(function (el) {
            this.elements[0].appendChild(sel);
        });
        return this;
    },
    prepend: function (sel) {
        sel.elements.forEach(function (el) {
            this.elements[0].insertBefore(el, this.elements[0].childNodes[0]);
        });
        return this;
    },
    insert: function (sel, child) {
        sel.elements.forEach(function (el) {
            this.elements[0].insertBefore(el, child);
        });
        return this;
    },
    appendTo: function (sel) {
        this.elements.forEach(function (el) {
            sel.elements[0].appendChild(el);
        });
        return this;
    },
    prependTo: function (sel) {
        this.elements.forEach(function (el) {
            sel.elements[0].insertBefore(el, sel.elements[0].childNodes[0]);
        });
        return this;
    },
    insertInto: function (sel, child) {
        this.elements.forEach(function (el) {
            sel.elements[0].insertBefore(el, child);
        });
        return this;
    },
    remove: function () {
        this.elements.forEach(function (el) {
            el.parentNode.removeChild(el);
        });
        return this;
    },

    event: function (name, callbackFn) {
        if (name[0] == 'o' && name[1] == 'n')
            name = name.substring(2);
        this.elements.forEach(function (v) {
            v.addEventListener(name, callbackFn);
        });
        return this;
    },
    trigger: function (str, args) {
        if (str[0] == 'o' && str[1] == 'n')
            str = str.substring(2);
        args = args || {};
        switch (true) {
        case (str.indexOf("key") == 0):
            /* if the event begins with 'key', dispatch a KeyboardEvent */
            this.elements.forEach(function (v) {
                args.relatedTarget = v;
                var ev = new KeyboardEvent(str, opts);
                v.dispatchEvent(ev)
            });
            break;
            /*  All other event will be dispatched as MouseEvents
                Some events require a specific button index  */
        case (str == "click" || str == "mouseup" || str == "mousedown"):
            this.elements.forEach(function (v) {
                args.button = 0;
                args.relatedTarget = v;
                var ev = new MouseEvent(str, args);
                v.dispatchEvent(ev);
            });
            break;
        case (str == "contextmenu"):
            this.elements.forEach(function (v) {
                args.button = 2;
                args.relatedTarget = v;
                var ev = new MouseEvent(str, args);
                v.dispatchEvent(ev);
            });
            break;
        default:
            this.elements.forEach(function (v) {
                args.relatedTarget = v;
                var ev = new MouseEvent(str, args);
                v.dispatchEvent(ev);
            });
            break;
        }

        return this;
    },
    styles: function (styleObj) {
        this.elements.forEach(function (v) {
            Object.assign(v.style, styleObj);
        });

        return this;
    },

    and: function (sel) {
        // O(n*m)
        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).");
        var elements = [];
        for (var i = 0; i < this.elements.length; ++i) {
            for (var j = 0; j < sel.elements.length; ++j) {
                if (sel.elements[j] === this.elements[i]) {
                    elements.push(this.elements[i]);
                    break;
                }
            }
        }
        return new Selector(elements, this.parent);
    },
    or: function (sel) {
        // O(n*m)
        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).");
        var a = this.elements.slice(), b = sel.elements.slice();
        for (var i = 0; i < a.length; ++i) {
            for (var j = 0; j < b.length; ++j) {
                if (a[i] === b[j]) {
                    $.utils.array.unorderedRemove(b, j);
                    break;
                }
            }
        }

        return new Selector(a.concat(b), this.parent);
    },
    xor: function (sel) {
        // O(n*m)
        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).");
        var a = this.elements.slice(), b = this.elements.slice();
        for (var i = 0; i < a.length; ++i) {
            for (var j = 0; j < b.length; ++j) {
                if (a[i] === b[j]) {
                    $.utils.array.unorderedRemove(a, i--);
                    $.utils.array.unorderedRemove(b, j--);
                    break;
                }
            }
        }
        return new Selector(a.concat(b), this.parent);
    },
    not: function (sel) {
        // O(n*m)
        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).");
        var elements = this.elements.slice();
        for (var i = 0; i < elements.length; ++i) {
            for (var j = 0; j < sel.elements.length; ++j) {
                if (elements[i] === sel.elements[j]) {
                    $.utils.array.unorderedRemove(elements, i--);
                    break;
                }
            }
        }

        return new Selector(elements, this.parent);
    },
    removeDuplicates: function () {
        $.utils.array.removeDuplicates(this.elements);
        return this;
    }
}