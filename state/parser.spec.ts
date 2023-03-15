import { State } from '../state'
import { Value, ValueType } from '../types'
import { parse } from './parser'

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
      type: ValueType.name,
      data: 'add'
    },
    '"a"': {
      type: ValueType.string,
      data: 'a'
    }
  }

  Object.keys(values).forEach(src => {
    const expected = values[src]
    it(`generates ${expected.type} ${JSON.stringify(expected.data)}`, () => {
      const state = new State()
      const value = [...parse(src, state)]
      expect(value).toStrictEqual([expected])
    })
  })

  it('generates values', () => {
    const state = new State()
    const block = [...parse('1 2 add', state)]
    expect(block).toStrictEqual([{
      type: ValueType.integer,
      data: 1
    }, {
      type: ValueType.integer,
      data: 2
    }, {
      type: ValueType.name,
      data: 'add'
    }])
  })
})
