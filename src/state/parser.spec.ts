import { ValueType, checkCallValue } from '@api'
import { InternalValue, scanGenericValue } from '@sdk'
import { parse } from './parser'
import { getKeys } from '@typescript'

const FILENAME = 'parser.spec'

function * parseAll (source: string): Generator<InternalValue> {
  let pos = 0
  while (true) {
    const result = parse(source, FILENAME, pos)
    if (result === undefined) {
      break
    }
    if (result.debug === undefined) {
      throw new Error('Unexpected undefined debug')
    }
    yield result
    pos += result.debug.length
  }
}

describe('state/parser', () => {
  const values = {
    '1 ': {
      type: ValueType.integer,
      number: 1
    },
    '123 ': {
      type: ValueType.integer,
      number: 123
    },
    '+1': {
      type: ValueType.integer,
      number: 1
    },
    '+123': {
      type: ValueType.integer,
      number: 123
    },
    '-1': {
      type: ValueType.integer,
      number: -1
    },
    '-123': {
      type: ValueType.integer,
      number: -123
    },
    add: {
      type: ValueType.call,
      call: 'add'
    },
    '"a"': {
      type: ValueType.string,
      string: 'a'
    },
    '"abc"': {
      type: ValueType.string,
      string: 'abc'
    },
    '[': {
      type: ValueType.call,
      call: '['
    },
    ']': {
      type: ValueType.call,
      call: ']'
    },
    '{': {
      type: ValueType.call,
      call: '{'
    },
    '}': {
      type: ValueType.call,
      call: '}'
    },
    '\'123': {
      type: ValueType.call,
      call: '\'123'
    },
    ',': {
      type: ValueType.call,
      call: ','
    }
  }

  getKeys(values).forEach(src => {
    const expected = values[src]
    it(`generates ${JSON.stringify(expected)}`, () => {
      const values = [...parseAll(src)]
      expect(values.length).toStrictEqual(1)
      const [value] = values
      scanGenericValue(value)
      const { debug } = value
      if (debug === undefined) {
        throw new Error('Missing debug information')
      }
      expect(debug.source).toStrictEqual(src)
      expect(debug.pos).toStrictEqual(0)
      const { type } = value
      if (![ValueType.integer, ValueType.string, ValueType.call].includes(type)) {
        throw new Error(`Unexpected value type '${type}`)
      }
      expect(value).toMatchObject(expected)
    })
  })

  it('generates values', () => {
    const source = '1 2 add'
    const block = [...parseAll(source)]
    expect(block).toStrictEqual<InternalValue[]>([{
      type: ValueType.integer,
      number: 1,
      debug: {
        source,
        filename: FILENAME,
        pos: 0,
        length: 1
      }
    }, {
      type: ValueType.integer,
      number: 2,
      debug: {
        source,
        filename: FILENAME,
        pos: 2,
        length: 1
      }
    }, {
      type: ValueType.call,
      call: 'add',
      debug: {
        source,
        filename: FILENAME,
        pos: 4,
        length: 3
      }
    }])
  })

  describe('array and block', () => {
    it('separates array and block symbols', () => {
      const block = [...parseAll('[][[]]]{{}{}}')].map(value => {
        checkCallValue(value)
        return value.call
      })
      expect(block).toStrictEqual([
        '[', ']', '[', '[', ']', ']', ']', '{', '{', '}', '{', '}', '}'
      ])
    })

    it('separates array symbols from the names', () => {
      const block = [...parseAll('[abc] abc[')].map(value => {
        checkCallValue(value)
        return value.call
      })
      expect(block).toStrictEqual([
        '[', 'abc', ']', 'abc', '['
      ])
    })

    it('separates block symbols from the names', () => {
      const block = [...parseAll('{abc} abc{')].map(value => {
        checkCallValue(value)
        return value.call
      })
      expect(block).toStrictEqual([
        '{', 'abc', '}', 'abc', '{'
      ])
    })
  })

  it('ignores comments and formatting, includes filename', () => {
    const source = `
% This is a comment
1
\t2

add`
    const block = [...parseAll(source)]
    expect(block).toStrictEqual<InternalValue[]>([{
      type: ValueType.integer,
      number: 1,
      debug: {
        source,
        filename: FILENAME,
        pos: 21,
        length: 1
      }
    }, {
      type: ValueType.integer,
      number: 2,
      debug: {
        source,
        filename: FILENAME,
        pos: 24,
        length: 1
      }
    }, {
      type: ValueType.call,
      call: 'add',
      debug: {
        source,
        filename: FILENAME,
        pos: 27,
        length: 3
      }
    }])
  })
})
