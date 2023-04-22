import { parse } from './parser'
import { Value, ValueType } from '../index'

describe('state/parser', () => {
  const values: Record<string, Value> = {
    1: {
      type: ValueType.integer,
      data: 1
    },
    '+1': {
      type: ValueType.integer,
      data: 1
    },
    '-1': {
      type: ValueType.integer,
      data: -1
    },
    add: {
      type: ValueType.call,
      data: 'add'
    },
    '"a"': {
      type: ValueType.string,
      data: 'a'
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
      const values = [...parse(src)]
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
    const block = [...parse(source)]
    expect(block).toStrictEqual([{
      type: ValueType.integer,
      data: 1,
      source,
      sourcePos: 0
    }, {
      type: ValueType.integer,
      data: 2,
      source,
      sourcePos: 2
    }, {
      type: ValueType.call,
      data: 'add',
      source,
      sourcePos: 4
    }])
  })

  describe('array and proc', () => {
    it('separates array and proc symbols', () => {
      const block = [...parse('[][[]]]{{}{}}')].map(value => value.data as string)
      expect(block).toStrictEqual([
        '[', ']', '[', '[', ']', ']', ']', '{', '{', '}', '{', '}', '}'
      ])
    })

    it('separates array symbols from the names', () => {
      const block = [...parse('[abc] abc[')].map(value => value.data as string)
      expect(block).toStrictEqual([
        '[', 'abc', ']', 'abc', '['
      ])
    })

    it('separates proc symbols from the names', () => {
      const block = [...parse('{abc} abc{')].map(value => value.data as string)
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
    const sourceFile = 'test.ps'
    const block = [...parse(source, sourceFile)]
    expect(block).toStrictEqual([{
      type: ValueType.integer,
      data: 1,
      source,
      sourcePos: 21,
      sourceFile
    }, {
      type: ValueType.integer,
      data: 2,
      source,
      sourcePos: 24,
      sourceFile
    }, {
      type: ValueType.call,
      data: 'add',
      source,
      sourcePos: 27,
      sourceFile
    }])
  })
})
