# Selector Library

This library allows for the selection and manipulation of multiple element. The library requires the `querySelectorAll` Web API to select elements by CSS selector string. 
Elements that are selected are stored internally in a `Set`. Class member functions operate on one or more elements in the set as described below.

## Constructor
The library constructor is accessed through `$` function. The `$` function accepts css selector strings and has methods for more performant targeted selection. These are enumerate below

| Method Definition                             | Behavior    |
| ---                                           | ---         |
| `$.css     (selector: string)   => Selector`  | Returns a `Selector` instance of elements that match the supplied css selector. This is the same as calling `$(selector)`. |
| `$.id      (id: string)         => Selector`  | Returns a `Selector` instance of the element that matches the supplied id. |
| `$.tag     (tagName: string)    => Selector`  | Returns a `Selector` instance of elements that match the supplied tag name. |
| `$.name    (name: string)       => Selector`  | Returns a `Selector` instance of elements that match the supplied name.|
| `$.class   (name: string)       => Selector`  | Returns a `Selector` instance of elements that match the supplied class definition.|
| `$.element (el: HTMLElement)    => Selector`  | Returns a `Selector` of the supplied elements. |
| `$.list    (els: HTMLElement[]) => Selector`  | Returns a `Selector` of the supplied iterable list of elements. |
| `$.build   (str: string)        => Selector`  | Builds an element based on the provided element creation string and returns a `Selector` instance containing it. |
| `$.compile (str: string) => (() => Selector)` | Returns a function which will have the same functionality as `$.build` with the supplied element creation string, but without having to parse a string on every call. |

## Selector Class Methods

### Set Interation/Manipulation
| Name                                                 | Description |
| ---                                                  | ---         |
| `has       (el: HTMLElement): boolean`               | Indicates whether the `el` appears in the current selection. |
| `map<T>    (fn: (HTMLElement) => T): T[]`            | Calls the user provided function `fn` on each element and stores, and returns, the results of these calls in an array. |
| `filter    (fn: (HTMLElement) => boolean): Selector` | Filters the selected elements using the user provided function `fn`. `fn` is called on each element and only those for which `fn` returns `true` are kept. `this` is returned for chaining. |
| `forEach   (fn: (HTMLElement) => void): this`        | Calls the user provided function `fn` on each element and returns `this` for chaining. |
| `reduce<T> (fn: (T, HTMLElement) => T, init?:T): T`  | Executes a reducer function, `fn` on each element resulting in a single value. |
| `concat    (sels: Selector): this`                   | Adds the contents of one Selection, `sels` instance to to the calling instance. |

### DOM Tree Manipulation/Element Moving
| Name                                                  | Description |
| ---                                                   | ---         |
| `append    (sel: Selector): this`                     | Appends the selected elements of `sel` to the first element of the calling instance. This is equivalent to calling `appendChild` with each child element. |
| `prepend   (sel: Selector): this`                     | Inserts the selected elements of `sel` as the as the first child elements of the first element of the calling instance. |
| `insert    (sel: Selector, child: HTMLElement): this` | Inserts the selected elements of `sel` before the provided child element of the calling `Selection`. This is equivalent to `insertBefore`. |
| `appendTo  (sel: Selector): this`                     | Appends the elements of the calling `Selection` to the first element of `sel`. |
| `prependTo (sel: Selector): this`                     | Inserts the elements of the calling `Selection` as the as the first child elements of `sel`.` |
| `insertInto(sel: Selector, child: HTMLElement): this` | Inserts the elements of the calling `Selection` before the provided child element of `sel`. |
| `remove    (void): this`                              | Removes all elements contained in the calling `Selection` from the DOM tree. |
| `children  (css: string): this`                       | Changes the selection to be all child elements of all currently selected elements which match the CSS selector string `css`, if provided, without duplication. |
| `parents   (css: string): this`                       | Changes the selection to be the parents of all currently selected elements that match the CSS selecte string `css`, if provided, without duplication |
| `siblings  (css: string): this`                       | CHanges the selection to be all of the siblings of all currently selected elements that match the CSS selector string `css`, if provided, without duplicates. |

### DOM Element Manipulation
| Name                                                | Description |
| ---                                                 | ---         |
| `event   (name: string, fn: (Event) => void): this` | Adds the function `fn` as the callback for the event with name `name` for each selected element. |
| `trigger (name: string, args: EventInit): this`     | Triggers an event named `name` with the provided EventInfo dictionary, `args` on each selected element. |
| `styles  (styleObj: Object): this`                  | Assigns the style key-value pairs in `styleObj` to the `.style` object of each selected element. |
| `getAttr (name: string): string`                    | Returns the the value of the attribute named `name` of the first selected element. |
| `getProp (name: string): any`                       | Returns the the value of the property named `name` of the first selected element. |
| `setAttr (name: string, value: any): this`          | Sets the attribute named `name` of each selected element to `value`. |
| `setProp (name: string, value: any): this`          | Sets the property named `name` of each selected element to `value`. |
| ---                                                 | ---         |
| `get value (): string`           | Returns the `value` of the first selected element. |
| `get text  (): string`           | Returns the `innerText` of the first selected element. |
| `get html  (): string`           | Returns the `innerHTML` of the first selected element. |
| `set value (val: string): void`  | Sets the `value` of all selected elements to `val`. |
| `set text  (txt: string): void`  | Sets the `innerText` of all selected elements to `txt`. |
| `set html  (html: string): void` | Sets the `innerHTML` of all selected elements to `html`. |

### Selection Joining/Merging
| Name                        | Description |
| ---                         | ---         |
| `and (sel: Selector): this` | Removes all elements in the calling `Selection` that are not also present in `sel`. |
| `or  (sel: Selector): this` | Add all elements of `sel` to the calling `Selection` removing duplicates. |
| `xor (sel: Selector): this` | Removes and adds elements to the calling `Selection` such that the resultant selection contains the elements that are uniquely contained between the calling `Selection` and `sel`. |
| `not (sel: Selector): this` | Removes all elements from the calling `Selection` that exist in `sel`. |

