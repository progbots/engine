import { ValueType } from '../types'
import { RangeCheck, StackUnderflow, TypeCheck } from '../errors'
import { index } from './index-op'
import { createState } from '../test-helpers'

describe('operators/index', () => {
  it('picks a value in the stack by position', () => {
    const state = createState({
      stack: [1, 'a', 'b']
    })
    index(state)
    expect(state.stack()[0]).toStrictEqual({
      type: ValueType.string,
      data: 'b'
    })
  })

  describe('errors', () => {
    describe('StackUnderflow', () => {
      it('fails if going beyond the stack size', () => {
        const state = createState({
          stack: [2, 'a', 'b']
        })
        expect(() => index(state)).toThrowError(StackUnderflow)
      })
    })

    describe('RangeError', () => {
      it('fails if negative position', () => {
        const state = createState({
          stack: [-1, 'a', 'b']
        })
        expect(() => index(state)).toThrowError(RangeCheck)
      })
    })

    describe('TypeCheck', () => {
      it('fails on strings', () => {
        const state = createState({
          stack: ['a', 'b']
        })
        expect(() => index(state)).toThrowError(TypeCheck)
      })
    })
  })
})
