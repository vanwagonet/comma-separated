/* eslint-env mocha */
'use strict'
const assert = require('assert')
const CSV = require('../csv')

describe('CSV', () => {
  describe('parse', () => {
    it('parses `,` as the field separator', () => {
      assert.deepStrictEqual(
        CSV.parse('a,b,c'),
        [ [ 'a', 'b', 'c' ] ]
      )
    })

    it('makes an empty field for leading and trailing `,`', () => {
      assert.deepStrictEqual(
        CSV.parse(',a,b,,c,'),
        [ [ '', 'a', 'b', '', 'c', '' ] ]
      )
    })

    it('parses quoted fields', () => {
      assert.deepStrictEqual(
        CSV.parse('"a","b","c"'),
        [ [ 'a', 'b', 'c' ] ]
      )
    })

    it('ignores trailing field text after closing quote', () => {
      assert.deepStrictEqual(
        CSV.parse('"a" garbage,"b" goes,"c"here'),
        [ [ 'a', 'b', 'c' ] ]
      )
    })

    it('handles special characters in quoted fields', () => {
      assert.deepStrictEqual(
        CSV.parse('"a","b\r\n,""","c"'),
        [ [ 'a', 'b\r\n,"', 'c' ] ]
      )
    })

    it('parses `\\r\\n` as a record separator', () => {
      assert.deepStrictEqual(
        CSV.parse('a,b,c\r\nc,d,e'),
        [
          [ 'a', 'b', 'c' ],
          [ 'c', 'd', 'e' ]
        ]
      )
    })

    it('parses `\\n` as a record separator', () => {
      assert.deepStrictEqual(
        CSV.parse('a,b,c\nc,d,e'),
        [
          [ 'a', 'b', 'c' ],
          [ 'c', 'd', 'e' ]
        ]
      )
    })

    it('parses `\\r` as a record separator', () => {
      assert.deepStrictEqual(
        CSV.parse('a,b,c\rc,d,e'),
        [
          [ 'a', 'b', 'c' ],
          [ 'c', 'd', 'e' ]
        ]
      )
    })

    it('ignores trailing `\\r\\n`', () => {
      assert.deepStrictEqual(
        CSV.parse('a,b,c\r\nc,d,e\r\n'),
        [
          [ 'a', 'b', 'c' ],
          [ 'c', 'd', 'e' ]
        ]
      )
    })

    it('ignores trailing `\\n`', () => {
      assert.deepStrictEqual(
        CSV.parse('a,b,c\nc,d,e\n'),
        [
          [ 'a', 'b', 'c' ],
          [ 'c', 'd', 'e' ]
        ]
      )
    })

    it('ignores trailing `\\r`', () => {
      assert.deepStrictEqual(
        CSV.parse('a,b,c\rc,d,e\r'),
        [
          [ 'a', 'b', 'c' ],
          [ 'c', 'd', 'e' ]
        ]
      )
    })

    it('calls reviver for each cell', () => {
      const calls = []
      const reviver = (row, column, value) => {
        calls.push([ row, column, value ])
        return 'f'
      }
      assert.deepStrictEqual(
        CSV.parse('a,b,c\r\nc,d,e', reviver),
        [
          [ 'f', 'f', 'f' ],
          [ 'f', 'f', 'f' ]
        ]
      )
      assert.deepStrictEqual(
        calls,
        [
          [ 0, 0, 'a' ],
          [ 0, 1, 'b' ],
          [ 0, 2, 'c' ],
          [ 1, 0, 'c' ],
          [ 1, 1, 'd' ],
          [ 1, 2, 'e' ]
        ]
      )
    })

    it('parses an empty string as a single row with no fields', () => {
      assert.deepStrictEqual(
        CSV.parse(''),
        []
      )
    })
  })

  describe('stringify', () => {
    it('uses `,` to separate fields', () => {
      assert.strictEqual(
        CSV.stringify([ [ 'a', 'b', 'c' ] ]),
        'a,b,c'
      )
    })

    it('quotes fields containing `\\n`', () => {
      assert.strictEqual(
        CSV.stringify([ [ 'a', 'b\nc', 'c' ] ]),
        'a,"b\nc",c'
      )
    })

    it('quotes fields containing `\\r`', () => {
      assert.strictEqual(
        CSV.stringify([ [ 'a', 'b\rc', 'c' ] ]),
        'a,"b\rc",c'
      )
    })

    it('quotes fields containing `,`', () => {
      assert.strictEqual(
        CSV.stringify([ [ 'a', 'b,c', 'c' ] ]),
        'a,"b,c",c'
      )
    })

    it('quotes fields containing `"`', () => {
      assert.strictEqual(
        CSV.stringify([ [ 'a', 'b"c', 'c' ] ]),
        'a,"b""c",c'
      )
    })

    it('converts fields to strings', () => {
      assert.strictEqual(
        CSV.stringify([
          [ 0, null, undefined ],
          [ -1, Infinity, 5e2, 34.5 ],
          [ {}, { toString () { return 'foo' } } ]
        ]),
        '0,null,undefined\r\n-1,Infinity,500,34.5\r\n[object Object],foo'
      )
    })

    it('uses `\\r\\n` to separate records', () => {
      assert.strictEqual(
        CSV.stringify([
          [ 'a', 'b', 'c' ],
          [ 'c', 'd', 'e' ]
        ]),
        'a,b,c\r\nc,d,e'
      )
    })

    it('calls replacer for each cell', () => {
      const calls = []
      const replacer = (row, column, value) => {
        calls.push([ row, column, value ])
        return 'f'
      }
      assert.strictEqual(
        CSV.stringify([
          [ 'a', 'b', 'c' ],
          [ 'c', 'd', 'e' ]
        ], replacer),
        'f,f,f\r\nf,f,f'
      )
      assert.deepStrictEqual(
        calls,
        [
          [ 0, 0, 'a' ],
          [ 0, 1, 'b' ],
          [ 0, 2, 'c' ],
          [ 1, 0, 'c' ],
          [ 1, 1, 'd' ],
          [ 1, 2, 'e' ]
        ]
      )
    })
  })
})
