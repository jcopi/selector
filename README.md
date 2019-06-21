# Selector Library
This library allows for the selection and manipulation of multiple element. The library requires the `querySelectorAll` Web API to select elements by CSS selector string. The library has two flavors;
* verbose:  a fully commented version [lib-verbose.js](https://github.com/jcopi/Selector_Library/blob/master/lib-verbose.js)
* minified: a fully minified version [lib.min.js](https://github.com/jcopi/Selector_Library/blob/master/lib.min.js). Minified versions are updated per release, not continuously.

## Constructor
The library constructor is accessed through `$` function. The `$` function accepts css selector strings and has methods for more performant targeted selection. These are enumerate below

| Method Definition                             | Behavior    |
| ---                                           | ---         |
| `$.css     (selector: string)   => Selector`  | Returns a `Selector` instance of elements that match the supplied css selector. This is the same as calling `$(selector)`. |
| `$.id      (id: string)         => Selector`  | |
| `$.tag     (tagName: string)    => Selector`  | |
| `$.name    (name: string)       => Selector`  | |
| `$.class   (name: string)       => Selector`  | |
| `$.element (el: HTMLElement)    => Selector`  | |
| `$.list    (els: HTMLElement[]) => Selector`  | |
| `$.build   (str: string)        => Selector`  | |
| `$.compile (str: string) => (() => Selector)` | |

## Selector Class Methods

| Name                                                  | Description |
| ---                                                   | ---         |
| `has       (el: HTMLElement): boolean`                | Indicates whether the `el` appears in the current selection. |
| `map<T>    (fn: (HTMLElement) => T): T[]`             | Calls the user provided function `fn` on each element and stores, and returns, the results of these calls in an array |
| `filter    (fn: (HTMLElement) => boolean): Selector`  | |
| `forEach   (fn: (HTMLElement) => void): this`         | |
| `reduce<T> (fn: (T, HTMLElement) => T, init?:T): T`   | |
| `concat    (sels: Selector): this`                    | |
| `append    (sel: Selector): this`                     | |
| `prepend   (sel: Selector): this`                     | |
| `insert    (sel: Selector, child: HTMLElement): this` | |


