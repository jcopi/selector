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

class Selector {
    constructor (elements, parent) {
        if (window === this)
            return new Selector(elements);

        this.elements = elements;
        this.first = [...elements][0];
        this.parent = parent;
    }

    get classList () {
        return new SelectorClass(this);
    }

    get length () {
        return this.elements.size;
    }

    has (el) {
        return this.elements.has(el);
    }

    map (fn) {
        let elements = [];
        for (let el of this.elements) {
            elements.push(fn(el));
        }

        return elements;
    }

    filter (fn) {
        let elements = new Set();
        for (let el of this.elements) {
            fn(el) && elements.add(el);
        }

        return new Selector(elements, this.parent);
    }

    forEach (fn) {
        this.elements.forEach(fn);
        return this;
    }

    reduce (fn, init) {
        for (let el of this.elements) {
            init = fn(init, el);
        }

        return init;
    }

    concat (sels) {
        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).");

        for (let el of sels.elements) {
            this.elements.add(el);
        }
        return this;
    }

    parents (css) {
        let elements = new Set();
        this.elements.forEach((v) => {
            if (typeof css !== "string" || v.parentNode.matches(css)) {
                elements.add(v.parentNode);
            }
        });
        return new Selector(elements, document);
    }

    siblings (css) {
        let elements = new Set();
        this.elements.forEach((v) => {
            for (var i = 0; i < v.parentNode.children.length; i++) {
                if (v.parentNode.children[i] !== v && (typeof css !== "string" || v.parentNode.children[i].matches(css))) {
                    elements.add(v.parentNode.children[i]);
                }
            }
        });
        return new Selector(elements, document);
    }

    children (css) {
        let elements = new Set();
        this.elements.forEach((v) => {
            for (let i = 0; i < v.children.length; i++) {
                if (typeof css !== "string" || v.children[i].matches(css)) {
                    elements.add(v.children[i]);
                }
            }
        });
        return new Selector(elements, document);
    }

    append (sel) {
        sel.elements.forEach((el) => {
            this.first.appendChild(sel);
        });
        return this;
    }

    prepend (sel) {
        sel.elements.forEach(function (el) {
            this.first.insertBefore(el, this.first.childNodes[0]);
        });
        return this;
    }

    insert (sel, child) {
        sel.elements.forEach(function (el) {
            this.first.insertBefore(el, child);
        });
        return this;
    }

    appendTo (sel) {
        this.elements.forEach(function (el) {
            sel.first.appendChild(el);
        });
        return this;
    }

    prependTo (sel) {
        this.elements.forEach(function (el) {
            sel.first.insertBefore(el, sel.first.childNodes[0]);
        });
        return this;
    }

    insertInto (sel, child) {
        this.elements.forEach(function (el) {
            sel.first.insertBefore(el, child);
        });
        return this;
    }

    remove () {
        this.elements.forEach(function (el) {
            el.parentNode.removeChild(el);
        });
        return this;
    }

    event (name, fn) {
        if (name.startsWith("on")) name = name.substring(2);

        this.elements.forEach(function (v) {
            v.addEventListener(name, fn);
        });
        return this;
    }

    trigger (name, args) {
        if (name.startsWith("on")) name = name.substring(2);
        if (!args) args = {};

        switch (true) {
        case (name.startsWith("key") == 0):
            /* if the event begins with 'key', dispatch a KeyboardEvent */
            this.elements.forEach(function (v) {
                args.relatedTarget = v;
                var ev = new KeyboardEvent(name, opts);
                v.dispatchEvent(ev);
            });
            break;
            /*  All other event will be dispatched as MouseEvents
                Some events require a specific button index  */
        case (name == "click" || name == "mouseup" || name == "mousedown"):
            this.elements.forEach(function (v) {
                args.button = 0;
                args.relatedTarget = v;
                var ev = new MouseEvent(name, args);
                v.dispatchEvent(ev);
            });
            break;
        case (name == "contextmenu"):
            this.elements.forEach(function (v) {
                args.button = 2;
                args.relatedTarget = v;
                var ev = new MouseEvent(name, args);
                v.dispatchEvent(ev);
            });
            break;
        default:
            this.elements.forEach(function (v) {
                args.relatedTarget = v;
                var ev = new MouseEvent(name, args);
                v.dispatchEvent(ev);
            });
            break;
        }

        return this;
    }

    styles (styleObj) {
        this.elements.forEach(function (v) {
            Object.assign(v.style, styleObj);
        });

        return this;
    }

    get value () {
        return this.first.value;
    }

    get text () {
        return this.first.innerText;
    }

    get html () {
        return this.first.innerHTML;
    }

    set value (val) {
        this.elements.forEach((v) => {
            v.value = val;
        });
    }

    set text (txt) {
        this.elements.forEach((v) => {
            v.innerText = txt;
        });
    }

    set html (html) {
        this.elements.forEach((v) => {
            v.innerHTML = html;
        });
    }

    getAttr (name) {
        return this.first.getAttribute(name);
    }

    getProp (name, value) {
        return this.first[name];
    }

    setAttr (name, value) {
        this.elements.forEach((v) => {
            v.setAttribute(name, value);
        });

        return this;
    }

    setProp (name, value) {
        this.elements.forEach((v) => {
            v[name] = value;
        });

        return this;
    }

    and (sel) {
        // Create a list of elements in both this and sel

        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).");
        
        let elements = new Set();
        for (let el of this.elements) {
            if (sel.elements.has(el)) {
                elements.add(el);
            }
        }
        return new Selector(elements, this.parent);
    }

    or (sel) {
        // Create a list of elements in either this or sel
        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).");

        let elements = new Set();
        for (let el of this.elements) {
            elements.add(el);
        }

        for (let el of sel.elements) {
            elements.add(el);
        }

        return new Selector(elements, this.parent);
    }

    xor (sel) {
        // Create a set of elements in either this or sel, but not both
        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).");

        let elements = new Set();
        for (let el of this.elements) {
            if (!sel.elements.has(el)) {
                elements.add(el);
            }
        }

        for (let el of sel.elements) {
            if (!this.elements.has(el)) {
                elements.add(el);
            }
        }

        return new Selector(elements, this.parent);
    }

    not (sel) {
        // Create a set of elements not in 'sel'
        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).");

        let elements = new Set();
        for (let el of this.elements) {
            if (!sel.elements.has(el)) {
                elements.add(el);
            }
        }

        return new Selector(elements, this.parent);
    }
}

class SelectorClass {
    constructor (sel) {
        this.s = sel;
    }

    add (cname) {
        this.s.elements.forEach((v) => {
            v.classList.add(cname);
        });
        return this;
    }
    remove (cname) {
        this.s.elements.forEach((v) => {
            v.classList.remove(cname);
        });
        return this;
    }
    toggle (cname, force) {
        this.s.elements.forEach((v) => {
            v.classList.toggle(cname, force);
        });
        return this;
    }
    replace (oldc, newc) {
        this.s.elements.forEach((v) => {
            v.classList.replace(oldc, newc);
        });
        return this;
    }
    item (n) {
        return this.s.first.classList.item(n);
    }
    contains (n) {
        return this.s.first.classList.contains(n);
    }
}

$.id = function (id, parent) {
    // Ensure inputs are of the correct type
    if (!(parent && "getElementById" in parent)) parent = document;
    if (id.startsWith("#")) id = id.substring(1);

    let element = new Set(parent.getElementById(id));
    return new Selector(element, parent);
}

$.css = function (selector, parent) {
    if (!(parent && "querySelectorAll" in parent)) parent = document;

    let elements = new Set(parent.querySelectorAll(selector));
    return new Selector(elements, parent);
};

$.tag = function (tname, parent) {
    if (!(parent && "getElementsByTagName" in parent)) parent = document;

    let elements = new Set(parent.getElementsByClassName(tname));
    return new Selector(elements, parent);
};

$.name = function (name, parent) {
    if (!(parent && "getElementsByName" in parent)) parent = document;

    let elements = new Set(parent.getElementsByName(name));
    return new Selector(elements, parent);
};

$.class = function (cname, parent) {
    if (!(parent && "getElementsByClassName" in parent)) parent = document;
    if (cname.startsWith(".")) cname = cname.substring(1);

    let elements = new Set(parent.getElementsByClassName(cname));
    return new Selector(elements, parent);
};

$.element = function (el, parent) {
    if (!parent) parent = document;
    
    let elements = new Set([el]);
    return new Selector(elements, parent);
};

$.list = function (els, parent) {
    if (!parent) parent = document;
    
    let elements = new Set(els);
    return new Selector(elements, parent);
};

$.compile = function (selector) {
    // O(n)
    if (!selector.startsWith('<') || !selector.endsWith('>')) {
        console.error("Invalid element creation string.");
    }
    // Create an element based on the creation string
    let master = null;
    // Prepare string for processing
    selector = selector.substring(1, selector.length - 1);
    selector += '\0';
    // list of key characters to influence processing
    let chkArray = ['.','#','$','[',']','\0'];
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
                master = document.createElement(tmp);
                break;
            case 1:
                master.classList.add(tmp);
                break;
            case 2:
                master.id = tmp;
                break;
            case 3:
                master.name = tmp;
                break;
            case 4:
                if (chk !== 4)
                    continue;

                let vals = tmp.split('=', 2);
                master.setAttribute(vals[0], vals[1]);
                break;
            }
            
            state = chk + 1;
            tmp = "";
        } else {
            tmp += selector[i];
        }
    }

    return function (master) {
        let el = master.cloneNode(true);
        let elements = new Set([el]);
        return new Selector(elements, document);
    }
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
