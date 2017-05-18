'use strict'

module.exports = {
  parse: function (csv, reviver) {
    reviver = reviver || function (r, c, v) { return v }
    var chars = csv.split('')
    var c = 0
    var cc = chars.length
    var table = []
    while (c < cc) {
      var row = []
      table.push(row)
      while (c < cc && chars[c] !== '\r' && chars[c] !== '\n') {
        if (row.length > 0 && chars[c] === ',') ++c
        var start = c
        var end = c
        if (chars[c] === '"') {
          start = end = ++c
          while (c < cc) {
            if (chars[c] === '"') {
              if (chars[c + 1] !== '"') break
              else chars[++c] = '' // unescape ""
            }
            end = ++c
          }
          if (chars[c] === '"') { ++c }
          while (c < cc && chars[c] !== '\r' && chars[c] !== '\n' && chars[c] !== ',') ++c
        } else {
          while (c < cc && chars[c] !== '\r' && chars[c] !== '\n' && chars[c] !== ',') end = ++c
        }
        row.push(reviver(table.length - 1, row.length, chars.slice(start, end).join('')))
      }
      if (chars[c] === '\r') ++c
      if (chars[c] === '\n') ++c
    }
    return table
  },

  stringify: function (table, replacer) {
    replacer = replacer || function (r, c, v) { return v }
    var csv = ''
    for (var r = 0, rr = table.length; r < rr; ++r) {
      if (r) { csv += '\r\n' }
      for (var c = 0, cc = table[r].length; c < cc; ++c) {
        if (c) { csv += ',' }
        var cell = '' + replacer(r, c, table[r][c])
        if (/[,\r\n"]/.test(cell)) {
          cell = '"' + cell.replace(/"/g, '""') + '"'
        }
        csv += cell
      }
    }
    return csv
  }
}
