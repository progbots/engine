import { State } from './state'
import { ValueType } from './types'
import { parse } from './parser'

describe('parser', () => {
  it('generates a value', () => {
    const state = new State()
    const value = [...parse('1', state)]
    expect(value).toStrictEqual([{
      type: ValueType.integer,
      data: 1
    }])
  })

  it('generates a block of values', () => {
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
