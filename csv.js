'use strict'

module.exports = {
  parse: function (csv, reviver) {
    reviver = reviver || function (r, c, v) { return isNaN(v) ? v : +v }
    var chars = csv.split('')
    var c = 0
    var cc = chars.length
    var start
    var end
    var table = []
    var row
    while (c < cc) {
      table.push(row = [])
      while (c < cc && chars[c] !== '\r' && chars[c] !== '\n') {
        start = end = c
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
        if (chars[c] === ',') ++c
      }
      if (chars[c] === '\r') ++c
      if (chars[c] === '\n') ++c
    }
    return table
  },

  stringify: function (table, replacer) {
    replacer = replacer || function (r, c, v) { return '' + v }
    var csv = ''
    var c
    var cc
    var r
    var rr = table.length
    var cell
    for (r = 0; r < rr; ++r) {
      if (r) { csv += '\r\n' }
      for (c = 0, cc = table[r].length; c < cc; ++c) {
        if (c) { csv += ',' }
        cell = replacer(r, c, table[r][c])
        if (/[,\r\n"]/.test(cell)) {
          cell = '"' + cell.replace(/"/g, '""') + '"'
        }
        csv += (cell || cell === 0) ? cell : ''
      }
    }
    return csv
  }
}
