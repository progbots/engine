import { State } from './state'
import { ValueType } from '../types'
import { StackUnderflow, Undefined } from '../errors'
import { length as itLength } from '../iterators'
import { add } from '../operators'
import { SystemDictionary } from '../dictionaries'

describe('state', () => {
  describe('State', () => {
    describe('stack management', () => {
      describe('happy path', () => {
        it('starts with an empty stack', () => {
          const state = new State()
          expect(state.stackRef().length).toStrictEqual(0)
        })

        it('enables pushing stack items', () => {
          const state = new State()
          state.push({
            type: ValueType.integer,
            data: 1
          })
          expect(state.stackRef().length).toStrictEqual(1)
        })

        it('enables getting stack items', () => {
          const state = new State()
          state.push({
            type: ValueType.integer,
            data: 1
          })
          const value = state.stackRef()[0]
          expect(value).toStrictEqual({
            type: ValueType.integer,
            data: 1
          })
        })

        it('enables popping stack items', () => {
          const state = new State()
          state.push({
            type: ValueType.integer,
            data: 1
          })
          state.pop()
          expect(state.stackRef().length).toStrictEqual(0)
        })

        describe('stack order', () => {
          it('considers the first item as the last pushed', () => {
            const state = new State()
            state.push({
              type: ValueType.integer,
              data: 1
            })
            state.push({
              type: ValueType.integer,
              data: 2
            })
            const [first, second] = state.stackRef()
            expect(first).toStrictEqual({
              type: ValueType.integer,
              data: 2
            })
            expect(second).toStrictEqual({
              type: ValueType.integer,
              data: 1
            })
          })
        })
      })

      describe('errors', () => {
        describe('StackUnderflow', () => {
          it('fails on popping an empty stack', () => {
            const state = new State()
            expect(() => state.pop()).toThrowError(StackUnderflow)
          })
        })
      })
    })

    describe('dictionaries management', () => {
      it('fails on unknown name', () => {
        const state = new State()
        expect(() => state.lookup('unknown_name')).toThrowError(Undefined)
      })

      it('returns the list of contexts', () => {
        const state = new State()
        expect(itLength(state.dictionaries())).toStrictEqual(1)
        const [topDictionary] = state.dictionaries()
        expect(topDictionary).toBeInstanceOf(SystemDictionary)
      })

      it('returns add operator', () => {
        const state = new State()
        const value = state.lookup('add')
        expect(value).toStrictEqual({
          type: ValueType.operator,
          data: add
        })
      })
    })

    describe('execution management', () => {
      it('stacks integer value', () => {
        const state = new State()
        const count = itLength(state.eval({
          type: ValueType.integer,
          data: 1
        }))
        expect(count).toStrictEqual(1)
        expect(state.stackRef()).toStrictEqual([{
          type: ValueType.integer,
          data: 1
        }])
      })

      it('considers the first item as the last pushed', () => {
        const state = new State()
        expect(itLength(state.eval('1 2'))).toStrictEqual(4)
        const [first, second] = state.stackRef()
        expect(first).toStrictEqual({
          type: ValueType.integer,
          data: 2
        })
        expect(second).toStrictEqual({
          type: ValueType.integer,
          data: 1
        })
      })

      it('resolves and call an operator (Values version)', () => {
        const state = new State()
        expect(itLength(state.eval({
          type: ValueType.integer,
          data: 1
        }))).toStrictEqual(1)
        expect(itLength(state.eval({
          type: ValueType.integer,
          data: 2
        }))).toStrictEqual(1)
        expect(itLength(state.eval({
          type: ValueType.name,
          data: 'add'
        }))).toStrictEqual(1)
        expect(state.stackRef()).toStrictEqual([{
          type: ValueType.integer,
          data: 3
        }])
      })

      it('resolves and call an operator (string version)', () => {
        const state = new State()
        expect(itLength(state.eval('1 2 add'))).toStrictEqual(6) // 3 + 3x parsing itLength
        expect(state.stackRef()).toStrictEqual([{
          type: ValueType.integer,
          data: 3
        }])
      })
    })

    describe('memory monitoring', () => {
      let initialMemoryUsed: number

      beforeAll(() => {
        const state = new State()
        const { used } = state.memory()
        initialMemoryUsed = used
      })

      it('starts with initial memory used', () => {
        expect(initialMemoryUsed).not.toStrictEqual(0)
      })

      it('grows by filling the stack', () => {
        const state = new State()
        state.push({
          type: ValueType.integer,
          data: 1
        })
        const { used } = state.memory()
        expect(used).toBeGreaterThan(initialMemoryUsed)
      })

      it('gets back to initial after clearing the stack', () => {
        const state = new State()
        state.push({
          type: ValueType.integer,
          data: 1
        })
        state.pop()
        const { used } = state.memory()
        expect(used).toStrictEqual(initialMemoryUsed)
      })
    })
  })
})