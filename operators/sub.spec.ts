import { ValueType } from '../types'
import { StackUnderflow, TypeCheck } from '../errors'
import { sub } from './sub'
import { createState } from '../test-helpers'

describe('operators/sub', () => {
  it('substracts two numbers', () => {
    const state = createState({
      stack: [3, 2]
    })
    sub(state)
    expect(state.stack()[0]).toStrictEqual({
      type: ValueType.integer,
      data: 1
    })
  })

  describe('errors', () => {
    describe('StackUnderflow: it requires 2 stack items', () => {
      it('fails on empty stack', () => {
        const state = createState()
        expect(() => sub(state)).toThrowError(StackUnderflow)
      })

      it('fails with only one stack item', () => {
        const state = createState({
          stack: [1]
        })
        expect(() => sub(state)).toThrowError(StackUnderflow)
      })
    })

    describe('TypeCheck: it requires only numbers', () => {
      it('fails on strings', () => {
        const state = createState({
          stack: ['a', 'b']
        })
        expect(() => sub(state)).toThrowError(TypeCheck)
      })

      it('fails on mixed parameters (number, string)', () => {
        const state = createState({
          stack: [1, 'b']
        })
        expect(() => sub(state)).toThrowError(TypeCheck)
      })

      it('fails on mixed parameters (string, number)', () => {
        const state = createState({
          stack: ['a', 2]
        })
        expect(() => sub(state)).toThrowError(TypeCheck)
      })
    })
  })
})
