# Selector Library

***INCOMPLETE***

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

| Name                                                  | Description |
| ---                                                   | ---         |
| `has       (el: HTMLElement): boolean`                | Indicates whether the `el` appears in the current selection. |
| `map<T>    (fn: (HTMLElement) => T): T[]`             | Calls the user provided function `fn` on each element and stores, and returns, the results of these calls in an array. |
| `filter    (fn: (HTMLElement) => boolean): Selector`  | Filters the selected elements using the user provided function `fn`. `fn` is called on each element and only those for which `fn` returns `true` are kept. `this` is returned for chaining. |
| `forEach   (fn: (HTMLElement) => void): this`         | Calls the user provided function `fn` on each element and returns `this` for chaining. |
| `reduce<T> (fn: (T, HTMLElement) => T, init?:T): T`   | Executes a reducer function, `fn` on each element resulting in a single value. ||
| `concat    (sels: Selector): this`                    | Adds the contents of one Selection, `sels` instance to to the calling instance. |
| `append    (sel: Selector): this`                     | Appends the selected elements of `sel` to the first element of the calling instance. This is equivalent to calling `appendChild` with each child element. |
| `prepend   (sel: Selector): this`                     | Inserts the selected elements of `sel` as the as the first child elements of the first element of the calling instance. |
| `insert    (sel: Selector, child: HTMLElement): this` | Inserts the selected elements of `sel` as before the provided child element. This is equivalent to `insertBefore`. |


