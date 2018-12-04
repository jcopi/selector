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
    return new Selector([element], parent);
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
$.build = function (str) {

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
    map: function (value, index, array) {},
    filter: function (value, index, array) {},
    forEach: function (value, index, array) {},
    reduce: function (value, index, array) {},
    concat: function (sels) {},

    append: function (els) {},
    prepend: function (els) {},
    insert: function (els, child) {},
    appendTo: function (el) {},
    prependTo: function (el) {},
    insertInto: function (el, child) {},
    remove: function () {},

    and: function (sel) {
        // O(n*m)
        if (!(sel instanceof Selector))
            return console.error("Argument not instance of Selector ($).")
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