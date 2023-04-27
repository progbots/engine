import { State } from './index'
import { Value, ValueType } from '../index'
import { InvalidBreak, StackUnderflow, Undefined } from '../errors/index'
import { InternalError } from '../errors/InternalError'
import { waitForCycles } from '../test-helpers'
import { add } from '../operators'

describe('state/State', () => {
  describe('protection against concurrent execution', () => {
    it('maintains a parsing flag', () => {
      const state = new State()
      expect(state.parsing).toStrictEqual(false)
      const generator = state.parse('1 2 3')
      expect(state.parsing).toStrictEqual(true)
      waitForCycles(generator)
      expect(state.parsing).toStrictEqual(false)
    })

    it('fails with BusyParsing if an execution is in progress', () => {
      const state = new State()
      state.parse('1 2 3')
      let exceptionCaught: Error | undefined
      try {
        state.parse('4 5 6')
      } catch (e) {
        exceptionCaught = e as Error
      }
      expect(exceptionCaught).not.toBeUndefined()
      if (exceptionCaught !== undefined) {
        expect(exceptionCaught).toBeInstanceOf(Error)
        expect(exceptionCaught.name).toStrictEqual('BusyParsing')
      }
    })
  })

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
        waitForCycles(state.parse('test'))
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
      expect(waitForCycles(state.parse('1'))).toStrictEqual(3)
      expect(state.operandsRef).toStrictEqual([{
        type: ValueType.integer,
        data: 1
      }])
    })

    it('considers the first item as the last pushed', () => {
      const state = new State()
      expect(waitForCycles(state.parse('1 2'))).toStrictEqual(5)
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
      expect(waitForCycles(state.parse('1 2 add'))).toStrictEqual(8)
      expect(state.operandsRef).toStrictEqual([{
        type: ValueType.integer,
        data: 3
      }])
    })

    it('allows proc definition and execution', () => {
      const state = new State()
      expect(waitForCycles(state.parse('"test" { 2 3 add } def test'))).toStrictEqual(25)
      expect(state.operandsRef).toStrictEqual([{
        type: ValueType.integer,
        data: 5
      }])
    })

    it('controls call execution', () => {
      const state = new State()
      waitForCycles(state.parse('"test" { { 1 } } def test'))
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

  describe('exception handling', () => {
    it('does not expose internal error type', () => {
      const state = new State()
      let exceptionCaught: Error | undefined
      try {
        waitForCycles(state.parse('typecheck'))
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e).not.toBeInstanceOf(InternalError)
        exceptionCaught = e as Error
        expect((e as Error).name).toStrictEqual('TypeCheck')
      }
      expect(exceptionCaught).not.toBeUndefined()
    })

    it('adds the call stack to the exception', () => {
      const state = new State()
      let exceptionCaught: Error | undefined
      try {
        waitForCycles(state.parse('typecheck'))
      } catch (e) {
        exceptionCaught = e as Error
      }
      if (exceptionCaught === undefined) {
        throw new Error('No exception thrown')
      }
      expect(exceptionCaught.stack).toStrictEqual('-typecheck-\ntypecheck\n"»typecheck«"')
    })
  })

  describe('break and invalid break', () => {
    it('signals an invalid use of break (eval)', () => {
      const state = new State()
      expect(() => waitForCycles(state.eval({
        type: ValueType.call,
        data: 'break'
      }))).toThrowError(InvalidBreak)
    })

    it('signals an invalid use of break (parse)', () => {
      const state = new State()
      let exceptionCaught: Error | undefined
      try {
        waitForCycles(state.parse('break'))
      } catch (e) {
        exceptionCaught = e as Error
        expect(exceptionCaught.name).toStrictEqual('InvalidBreak')
      }
      expect(exceptionCaught).not.toBeUndefined()
    })
  })

  describe('debug information', () => {
    it('drops debug information when off', () => {
      const state = new State()
      waitForCycles(state.parse('1', 'test'))
      const value = state.operandsRef[0]
      expect(value.source).toBeUndefined()
      expect(value.sourceFile).toBeUndefined()
      expect(value.sourcePos).toBeUndefined()
    })

    it('keeps debug information when on', () => {
      const state = new State({
        keepDebugInfo: true
      })
      waitForCycles(state.parse('1', 'test'))
      const value = state.operandsRef[0]
      expect(value.source).toStrictEqual('1')
      expect(value.sourceFile).toStrictEqual('test')
      expect(value.sourcePos).toStrictEqual(0)
    })
  })
})
