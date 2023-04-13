import { State } from './index'
import { Value, ValueType } from '../index'
import { InvalidBreak, StackUnderflow, Undefined } from '../errors/index'
import { BaseError } from '../errors/BaseError'
import { length as itLength } from '../iterators'
import { add } from '../operators'

describe('state/state/index', () => {
  describe('stack management', () => {
    describe('happy path', () => {
      it('starts with an empty stack', () => {
        const state = new State()
        expect(state.operandsRef.length).toStrictEqual(0)
      })

      it('enables pushing stack items', () => {
        const state = new State()
        state.push({
          type: ValueType.integer,
          data: 1
        })
        expect(state.operandsRef.length).toStrictEqual(1)
      })

      it('enables getting stack items', () => {
        const state = new State()
        state.push({
          type: ValueType.integer,
          data: 1
        })
        const value = state.operandsRef[0]
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
        expect(state.operandsRef.length).toStrictEqual(0)
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
          const [first, second] = state.operandsRef
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
      expect(state.dictionaries.length).toStrictEqual(2)
      const { data: dict0 } = state.dictionaries.at(0)
      expect(dict0).toStrictEqual(state.globaldict)
      const { data: dict1 } = state.dictionaries.at(1)
      expect(dict1).toStrictEqual(state.systemdict)
    })

    it('returns add operator', () => {
      const state = new State()
      const value = state.lookup('add')
      expect(value).toStrictEqual({
        type: ValueType.operator,
        data: add
      })
    })

    describe('host dictionary', () => {
      it('augments the list of known symbols', () => {
        const hostDictionary = {
          names: ['test'],
          lookup: (name: string): Value | null => {
            if (name === 'test') {
              return {
                type: ValueType.integer,
                data: 42
              }
            }
            return null
          }
        }
        const state = new State({
          hostDictionary
        })
        itLength(state.parse('test'))
        expect(state.operandsRef).toStrictEqual([{
          type: ValueType.integer,
          data: 42
        }])
      })
    })
  })

  describe('execution (and cycles) management', () => {
    it('stacks integer value', () => {
      const state = new State()
      expect(itLength(state.parse('1'))).toStrictEqual(3)
      expect(state.operandsRef).toStrictEqual([{
        type: ValueType.integer,
        data: 1
      }])
    })

    it('considers the first item as the last pushed', () => {
      const state = new State()
      expect(itLength(state.parse('1 2'))).toStrictEqual(5)
      const [first, second] = state.operandsRef
      expect(first).toStrictEqual({
        type: ValueType.integer,
        data: 2
      })
      expect(second).toStrictEqual({
        type: ValueType.integer,
        data: 1
      })
    })

    it('resolves and call an operator', () => {
      const state = new State()
      expect(itLength(state.parse('1 2 add'))).toStrictEqual(8)
      expect(state.operandsRef).toStrictEqual([{
        type: ValueType.integer,
        data: 3
      }])
    })

    it('allows proc definition and execution', () => {
      const state = new State()
      expect(itLength(state.parse('/test { 2 3 add } def test'))).toStrictEqual(25)
      expect(state.operandsRef).toStrictEqual([{
        type: ValueType.integer,
        data: 5
      }])
    })

    it('controls call execution', () => {
      const state = new State()
      itLength(state.parse('/test { { 1 } } def test'))
      expect(state.operandsRef.length).toStrictEqual(1)
      expect(state.operandsRef[0].type).toStrictEqual(ValueType.proc)
    })
  })

  describe('memory monitoring', () => {
    let initialMemoryUsed: number

    beforeAll(() => {
      const state = new State()
      const used = state.usedMemory
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
      const used = state.usedMemory
      expect(used).toBeGreaterThan(initialMemoryUsed)
    })

    it('gets back to initial after clearing the stack', () => {
      const state = new State()
      state.push({
        type: ValueType.integer,
        data: 1
      })
      state.pop()
      const used = state.usedMemory
      expect(used).toStrictEqual(initialMemoryUsed)
    })
  })

  describe('break and invalid break', () => {
    it('signals an invalid use of break (eval)', () => {
      const state = new State()
      expect(() => itLength(state.eval({
        type: ValueType.call,
        data: 'break'
      }))).toThrowError(InvalidBreak)
    })

    it('signals an invalid use of break (parse)', () => {
      const state = new State()
      expect(() => itLength(state.parse('break'))).toThrowError(InvalidBreak)
    })
  })

  describe('exception handling', () => {
    it('adds the call stack to the exception', () => {
      const state = new State()
      let exceptionCaught: BaseError | undefined
      try {
        itLength(state.parse('typecheck'))
      } catch (e) {
        expect(e).toBeInstanceOf(BaseError)
        exceptionCaught = e as BaseError
      }
      if (exceptionCaught === undefined) {
        throw new Error('No exception thrown')
      }
      expect(exceptionCaught.callstack).toStrictEqual('-typecheck-\ntypecheck\n"»typecheck«"')
    })
  })
})
