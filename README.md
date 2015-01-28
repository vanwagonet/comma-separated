# Comma Separated

Simple CSV serialization mirroring JSON.parse and stringify. This follows
[RFC 4180](http://tools.ietf.org/html/rfc4180) rules, and only handles commas
as delimiters. This is not a general parser for any character-delimited format.

The api is very similar to the native JSONobject in JavaScript.

`CSV.parse(csvString [, reviver ])`

`csvString` is a well-formated string of csv data.
`reviver` is an optional function that takes the row index, column index, and
cell string value. The function should return the desired value for that cell.

The `reviver` is an opportunity to to do extra parsing from a cell's string
format. For example if the string matches an iso date format, you may want to
have a Date object instead of the raw string in the final array.

The default `reviver` checks if the string is a valid number, and if so returns
the value as a number. Otherwise the original string value is passed through.

`CSV.stringify(tableArray [, replacer])`

`tableArray` is a 2 dimensional array of values to stringify.
`replacer` is an optional function that takes the row index, column index, and
cell string value. The function should return a string value for that cell.

The `replacer` is an opportunity to do a custom string format for particular
cells. This is useful if you have objects for cell values that do not have a
desirable `toString` function.

The default `replacer` simply converts to a string. (ie: `'' + value`)
