import { ValueType } from '../types'
import { Add } from './Add'
import { createState } from '../test-helpers'

describe('operators/Add', () => {
  const addOperator = new Add()

  it('adds two numbers', () => {
    const state = createState()
    state.stack.push({
      type: ValueType.number,
      data: 1
    }, {
      type: ValueType.number,
      data: 2
    })
    addOperator.evaluate(state)
    expect(state.stack[0]).toStrictEqual({
      type: ValueType.number,
      data: 3
    })
  })
})
