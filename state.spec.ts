import { State } from './state'
import { ValueType } from './types'
import { RangeCheck, StackUnderflow } from './errors'

describe('state', () => {
  describe('State', () => {
    describe('stack management', () => {
      describe('happy path', () => {
        it('starts with an empty stack', () => {
          const state = new State()
          expect(state.count()).toStrictEqual(0)
        })

        it('allows stack initialization', () => {
          const state = new State([{
            type: ValueType.number,
            data: 1
          }])
          expect(state.count()).toStrictEqual(1)
        })

        it('enables getting stack items', () => {
          const state = new State([{
            type: ValueType.number,
            data: 1
          }])
          const value = state.index(0)
          expect(value).toStrictEqual({
            type: ValueType.number,
            data: 1
          })
        })

        it('enables pushing stack items', () => {
          const state = new State()
          state.push({
            type: ValueType.number,
            data: 1
          })
          expect(state.count()).toStrictEqual(1)
        })

        it('enables popping stack items', () => {
          const state = new State([{
            type: ValueType.number,
            data: 1
          }])
          state.pop()
          expect(state.count()).toStrictEqual(0)
        })
      })

      describe('errors', () => {
        describe('StackUnderflow', () => {
          it('fails on popping an empty stack', () => {
            const state = new State()
            expect(() => state.pop()).toThrowError(StackUnderflow)
          })

          it('fails on indexing beyond the stack', () => {
            const state = new State([{
              type: ValueType.number,
              data: 1
            }])
            expect(() => state.index(1)).toThrowError(StackUnderflow)
          })
        })

        describe('RangeCheck', () => {
          it('fails on indexing with negative number', () => {
            const state = new State([{
              type: ValueType.number,
              data: 1
            }])
            expect(() => state.index(-1)).toThrowError(RangeCheck)
          })
        })
      })
    })
  })
})
