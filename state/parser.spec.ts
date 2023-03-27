import { parse } from './parser'
import { Value, ValueType } from '..'

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
    '/add': {
      type: ValueType.name,
      data: 'add'
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
    '/\'123': {
      type: ValueType.name,
      data: '\'123'
    },
    ',': {
      type: ValueType.call,
      data: ','
    },
    '/,': {
      type: ValueType.name,
      data: ','
    }
  }

  Object.keys(values).forEach(src => {
    const expected = values[src]
    it(`generates ${expected.type} ${JSON.stringify(expected.data)}`, () => {
      const value = [...parse(src)]
      expect(value).toStrictEqual([expected])
    })
  })

  it('generates values', () => {
    const block = [...parse('1 2 add')]
    expect(block).toStrictEqual([{
      type: ValueType.integer,
      data: 1
    }, {
      type: ValueType.integer,
      data: 2
    }, {
      type: ValueType.call,
      data: 'add'
    }])
  })

  it('splits array and proc calls', () => {
    const block = [...parse('[][[]]]{{}{}}')].map(value => value.data as string)
    expect(block).toStrictEqual([
      '[', ']', '[', '[', ']', ']', ']', '{', '{', '}', '{', '}', '}'
    ])
  })

  it('ignores comments and formatting', () => {
    const block = [...parse(`
% This is a comment
1
\t2

add
`)]
    expect(block).toStrictEqual([{
      type: ValueType.integer,
      data: 1
    }, {
      type: ValueType.integer,
      data: 2
    }, {
      type: ValueType.call,
      data: 'add'
    }])
  })
})
