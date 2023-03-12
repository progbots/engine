import { cycles, State } from './state'
import { ValueType } from './types'
import { StackUnderflow, Undefined } from './errors'
import { add } from './operators'
import { RootContext } from './contexts'

describe('state', () => {
  describe('State', () => {
    describe('stack management', () => {
      describe('happy path', () => {
        it('starts with an empty stack', () => {
          const state = new State()
          expect(state.stack().length).toStrictEqual(0)
        })

        it('allows stack initialization', () => {
          const state = new State([{
            type: ValueType.integer,
            data: 1
          }])
          expect(state.stack().length).toStrictEqual(1)
        })

        it('enables getting stack items', () => {
          const state = new State([{
            type: ValueType.integer,
            data: 1
          }])
          const value = state.stack()[0]
          expect(value).toStrictEqual({
            type: ValueType.integer,
            data: 1
          })
        })

        it('enables pushing stack items', () => {
          const state = new State()
          state.push({
            type: ValueType.integer,
            data: 1
          })
          expect(state.stack().length).toStrictEqual(1)
        })

        it('enables popping stack items', () => {
          const state = new State([{
            type: ValueType.integer,
            data: 1
          }])
          state.pop()
          expect(state.stack().length).toStrictEqual(0)
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

    describe('context management', () => {
      it('fails on unknown name', () => {
        const state = new State()
        expect(() => state.lookup('unknown_name')).toThrowError(Undefined)
      })

      it('returns the list of contexts', () => {
        const state = new State()
        const contexts = state.contexts()
        expect(contexts.length).toStrictEqual(1)
        expect(contexts[0]).toBeInstanceOf(RootContext)
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
        const count = cycles(state.eval({
          type: ValueType.integer,
          data: 1
        }))
        expect(count).toStrictEqual(1)
        expect(state.stack()).toStrictEqual([{
          type: ValueType.integer,
          data: 1
        }])
      })

      it('resolves and call an operator (Values version)', () => {
        const state = new State()
        expect(cycles(state.eval({
          type: ValueType.integer,
          data: 1
        }))).toStrictEqual(1)
        expect(cycles(state.eval({
          type: ValueType.integer,
          data: 2
        }))).toStrictEqual(1)
        expect(cycles(state.eval({
          type: ValueType.name,
          data: 'add'
        }))).toStrictEqual(1)
        expect(state.stack()).toStrictEqual([{
          type: ValueType.integer,
          data: 3
        }])
      })
    })

    it('resolves and call an operator (string version)', () => {
      const state = new State()
      expect(cycles(state.eval('1 2 add'))).toStrictEqual(6) // 3 + 3x parsing cycles
      expect(state.stack()).toStrictEqual([{
        type: ValueType.integer,
        data: 3
      }])
    })
  })
})
