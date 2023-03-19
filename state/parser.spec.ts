import { parse } from './parser'
import { Value, ValueType } from '..'

describe('state/parser', () => {
  const values: Record<string, Value> = {
    1: {
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
})
