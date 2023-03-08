import { ValueType } from '../types'
import { StackUnderflow, TypeCheck } from '../errors'
import { add } from './add'
import { createState } from '../test-helpers'

describe('operators/add', () => {
  it('adds two numbers', () => {
    const state = createState({
      stack: [1, 2]
    })
    add(state)
    expect(state.index(0)).toStrictEqual({
      type: ValueType.number,
      data: 3
    })
  })

  describe('errors', () => {
    describe('StackUnderflow: it requires 2 stack items', () => {
      it('fails on empty stack', () => {
        const state = createState()
        expect(() => add(state)).toThrowError(StackUnderflow)
      })

      it('fails with only one stack item', () => {
        const state = createState({
          stack: [1]
        })
        expect(() => add(state)).toThrowError(StackUnderflow)
      })
    })

    describe('TypeCheck: it requires only numbers', () => {
      it('fails on strings', () => {
        const state = createState({
          stack: ['a', 'b']
        })
        expect(() => add(state)).toThrowError(TypeCheck)
      })

      it('fails on mixed parameters (number, string)', () => {
        const state = createState({
          stack: [1, 'b']
        })
        expect(() => add(state)).toThrowError(TypeCheck)
      })

      it('fails on mixed parameters (string, number)', () => {
        const state = createState({
          stack: ['a', 2]
        })
        expect(() => add(state)).toThrowError(TypeCheck)
      })
    })
  })
})
