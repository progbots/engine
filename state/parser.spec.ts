import { parse, ParsedValue } from './parser'
import { Value, ValueType } from '../index'
import { checkCallValue } from './types'

function * parseAll (source: string): Generator<ParsedValue> {
  let pos = 0
  while (true) {
    const result = parse(source, pos)
    if (result === undefined) {
      break
    }
    yield result
    pos = result.nextPos
  }
}

describe('state/parser', () => {
  const values: Record<string, Value> = {
    1: {
      type: ValueType.integer,
      data: 1
    },
    123: {
      type: ValueType.integer,
      data: 123
    },
    '+1': {
      type: ValueType.integer,
      data: 1
    },
    '+123': {
      type: ValueType.integer,
      data: 123
    },
    '-1': {
      type: ValueType.integer,
      data: -1
    },
    '-123': {
      type: ValueType.integer,
      data: -123
    },
    add: {
      type: ValueType.call,
      data: 'add'
    },
    '"a"': {
      type: ValueType.string,
      data: 'a'
    },
    '"abc"': {
      type: ValueType.string,
      data: 'abc'
    },
    '[': {
      type: ValueType.call,
      data: '['
    },
    ']': {
      type: ValueType.call,
      data: ']'
    },
    '{': {
      type: ValueType.call,
      data: '{'
    },
    '}': {
      type: ValueType.call,
      data: '}'
    },
    '\'123': {
      type: ValueType.call,
      data: '\'123'
    },
    ',': {
      type: ValueType.call,
      data: ','
    }
  }

  Object.keys(values).forEach(src => {
    const expected = values[src]
    it(`generates ${expected.type} ${JSON.stringify(expected.data)}`, () => {
      const values = [...parseAll(src)]
      expect(values.length).toStrictEqual(1)
      const [value] = values
      expect(value.source).toStrictEqual(src)
      expect(value.sourcePos).toStrictEqual(0)
      const { type, data } = value
      expect({ type, data }).toStrictEqual(expected)
    })
  })

  it('generates values', () => {
    const source = '1 2 add'
    const block = [...parseAll(source)]
    expect(block).toStrictEqual([{
      type: ValueType.integer,
      data: 1,
      source,
      sourcePos: 0,
      nextPos: 1
    }, {
      type: ValueType.integer,
      data: 2,
      source,
      sourcePos: 2,
      nextPos: 3
    }, {
      type: ValueType.call,
      data: 'add',
      source,
      sourcePos: 4,
      nextPos: 7
    }])
  })

  describe('array and block', () => {
    it('separates array and block symbols', () => {
      const block = [...parseAll('[][[]]]{{}{}}')].map(value => {
        checkCallValue(value)
        return value.data
      })
      expect(block).toStrictEqual([
        '[', ']', '[', '[', ']', ']', ']', '{', '{', '}', '{', '}', '}'
      ])
    })

    it('separates array symbols from the names', () => {
      const block = [...parseAll('[abc] abc[')].map(value => {
        checkCallValue(value)
        return value.data
      })
      expect(block).toStrictEqual([
        '[', 'abc', ']', 'abc', '['
      ])
    })

    it('separates block symbols from the names', () => {
      const block = [...parseAll('{abc} abc{')].map(value => {
        checkCallValue(value)
        return value.data
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
    expect(block).toStrictEqual([{
      type: ValueType.integer,
      data: 1,
      source,
      sourcePos: 21,
      nextPos: 22
    }, {
      type: ValueType.integer,
      data: 2,
      source,
      sourcePos: 24,
      nextPos: 25
    }, {
      type: ValueType.call,
      data: 'add',
      source,
      sourcePos: 27,
      nextPos: 30
    }])
  })
})
