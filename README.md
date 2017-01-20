# Selector Library
This library allows for the selection and manipulation of multiple element. The library requires the `querySelectorAll` Web API to select elements by CSS selector string. The library has two flavors;
* verbose:  a fully commented version [lib-verbose.js](https://github.com/jcopi/Selector_Library/blob/master/lib-verbose.js)
* minified: a fully minified version [lib-min.js](https://github.com/jcopi/Selector_Library/blob/master/lib-min.js)

## Constructor
The library constructor is accessed through `_` object. The constructor accepts input of multiple different types and handles them as follows

Data Type | Behavior
----------|---------
String (Element Creation String) | The constructor allows for an element to be created using a css selection string. Element Creation Strings are always bordered by angle brackets `<...>`. The opening bracket must be followed by the tag name `<div...>`. after the tag name attributes can be applied as they would in CSS, classes as `.classname`, IDs as `#id`, attributes as `[name="value"]`, and unlike CSS form names as `$name`. Created elements are not automatically added to the document.
String (CSS Selector) | A valid CSS Selector can be used to select any number of element utilizing the `querySelectorAll` Web API.
HTMLElement Object | The object is returned as a library object.
Number | Previous selections of elements can be indexed and selected later with a single number. `_(".class_name").index(4); _(4);`
Iterable Object | The elements of iterable objects are all parsed and the selections aggregated.
Undefined | an undefined input is equivalent to `_(document);`

## Prototype Methods
The library object has many prototype methods. Unless otherwise indicated all prototype return the library object so that methods can be chained together as such, `_("div.class").css("color":"red").toggleClass(".other_class");`

Name | Arguments | Behavior
-----|-----------|---------
index | `(Number desired_index)` | Sets the current selection to `desired_index`
include | `(Generic selector)` | Adds a new selection to the current selection. `selector` functions in the same way as the constructor
exclude | `(Generic selector)` | Removes any elements from the current selection that match `selector` which functions in the same way as the constructor
get | `(Number index)` | Returns the raw HTMLElement of the selection at `index`
remove | `(void)` | Removes all selected elements from the document
each | `(Function func)` | Calls `func` on each selected element
filter | `(Function func)` | Calls `func` on each selected element if it returns `false` the current element is removed from the selection
child | 
parent |
appendTo |
append |
toggleClass |
hasClass |
addClass |
dropClass |
css |
attr |
prop |
text |
html |
value |
height |
width |
on |
trigger |
