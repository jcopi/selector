class _ {
    static __concat () {
        if (arguments.length === 0)
            return null;

        let length = 0;
        for (let i = 0; i < arguments.length; ++i) {
            for (let j = 0; j < arguments[i].length; ++j) {
                this[length++] = arguments[i][j];
            }
        }

        this.length = length;
    }

    constructor (selector, parent) {
        if (parent === undefined)
            parent = document;
        this.length = 0;

        if (selector instanceof HTMLElement || selector instanceof DocumentFragment || selector instanceof Element) {
            this[this.length++] = selector;
        } else if (selector instanceof _) {
            _.__concat.call(this, this, selector);
        } else if (typeof selector === "string" || selector instanceof String) {
            selector = selector.trim();
            if (selector.startsWith('<') && selector.endsWith('>')) {
                selector = selector.substring(1, selector.length - 1);
                selector += '\0';
                let chkArray = ['.','#','$','[',']','\0'];
                let element = null;
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
                            element = document.createElement(tmp);
                            break;
                        case 1:
                            element.classList.add(tmp);
                            break;
                        case 2:
                            element.id = tmp;
                            break;
                        case 3:
                            element.name = tmp;
                            break;
                        case 4:
                            if (chk !== 4)
                                continue;
                            let [key, value] = tmp.split('=', 2);
                            element.setAttribute(key, value);
                            break;
                        }
                        
                        state = chk + 1;
                        tmp = "";
                    } else {
                        tmp += selector[i];
                    }
                }
                this[this.length++] = element;
            } else {
                if (!("querySelectorAll" in parent))
                    throw "parent must implement 'querySelectorAll'";
                let elements = parent.querySelectorAll(selector);
                elements.forEach((el) => this[this.length++] = el);
            }
        } else if (typeof selector === "number" || selector instanceof Number) {
            // Possibly get rid of "indexing" as it likely has no real benefit
        } else if (Array.isArray(selector)) {
            selector.forEach((el) => _.__concat.call(this, this, _(el)));
        } else if (typeof selector == "object" || selector instanceof Object) {
            if ("length" in selector && typeof selector.length == "number") {
                _.__concat.call(this, this, _(Array.prototype.slice.call(selector)));
            } else {
                _.__concat.call(this, this, _(undefined));
            }
        } else {
            this[this.length++] = document;
        }

        return this;
    }

    include (selector) {
        _.__concat.call(this, this, _(selector));
        return this;
    }

    exclude (selector) {
        let exclusion = _(selector);
        let i = this.length, j;
        let result = [];
        while (i--) {
            j = exclusion.length;
            while (j--) {
                if (this[i] !== exclusion[j])
                    result.unshift(this[i]);
            }
        }

        return new _(result);
    }

    get (num) {
        if (!(num instanceof Number || typeof num == "number")) 
            throw "Method get only accepts an argument of type Number";
        return new _(this[num])
    }
    raw (num) {
        if (!(num instanceof Number || typeof num == "number"))
            throw "Method get only accepts an argument of type Number";
        return this[num];
    }
    remove () {
        for (let i = this.length; i--; this[i].parentNode.removeChild(this[i]));

        return this;
    }
    forEach (func) {
        if (!(func instanceof Function || typeof func == "function"))
            throw "Method each only accepts an argument of type Function";
        for (let i = this.length; i--; func(new _(this[i])));

        return this;
    }
    filter (func) {
        if (!(func instanceof Function || typeof func == "function"))
            throw "Method each only accepts an argument of type Function";
        let result = [];
        for (let i = 0; i < this.length; ++i)
            if (func(new _(this[i])))
                result.push(this[i]);

        return new _(result);
    }
    child (selector) {
        let result = Array(this.length);
        for (let i = this.length; i--; result[i] = new _(selector, this[i]));

        return new _(result);
    }
    parent () {
        let result = [];
        for (let i = 0, isRepeat = false; i < this.length; ++i) {
            isRepeat = false;
            for (let j = result.length; !isRepeat && j--; isRepeat = this[i].parentNode === result[j]);
            if (!isRepeat)
                result.push(this[i].parentNode);
        }

        return new _(result);
    }
    sibling () {}
    appendTo () {}
    append () {}
    prependTo () {}
    prepend () {}
    toggleClass () {}
    addClass () {}
    hasClass () {}
    removeClass () {}
    css () {}
    attr () {}
    prop () {}
    text () {}
    html () {}
    value () {}
    height () {}
    width () {}
    on () {}
    trigger () {}
}