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

  describe('execution (and cycles) management', () => {
    it('stacks integer value', () => {
      const state = new State()
      expect(waitForCycles(state.parse('1'))).toStrictEqual(3)
      expect(state.operands.ref).toStrictEqual([{
        type: ValueType.integer,
        data: 1
      }])
    })

    it('considers the first item as the last pushed', () => {
      const state = new State()
      expect(waitForCycles(state.parse('1 2'))).toStrictEqual(5)
      const [first, second] = state.operands.ref
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
      expect(state.operands.ref).toStrictEqual([{
        type: ValueType.integer,
        data: 3
      }])
    })

    it('allows proc definition and execution', () => {
      const state = new State()
      expect(waitForCycles(state.parse('"test" { 2 3 add } def test'))).toStrictEqual(25)
      expect(state.operands.ref).toStrictEqual([{
        type: ValueType.integer,
        data: 5
      }])
    })

    it('controls call execution', () => {
      const state = new State()
      waitForCycles(state.parse('"test" { { 1 } } def test'))
      expect(state.operands.ref.length).toStrictEqual(1)
      expect(state.operands.ref[0].type).toStrictEqual(ValueType.proc)
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
      state.operands.push({
        type: ValueType.integer,
        data: 1
      })
      const used = state.usedMemory
      expect(used).toBeGreaterThan(initialMemoryUsed)
    })

    it('gets back to initial after clearing the stack', () => {
      const state = new State()
      state.operands.push({
        type: ValueType.integer,
        data: 1
      })
      state.operands.pop()
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
      const value = state.operands.ref[0]
      expect(value.source).toBeUndefined()
      expect(value.sourceFile).toBeUndefined()
      expect(value.sourcePos).toBeUndefined()
    })

    it('keeps debug information when on', () => {
      const state = new State({
        keepDebugInfo: true
      })
      waitForCycles(state.parse('1', 'test'))
      const value = state.operands.ref[0]
      expect(value.source).toStrictEqual('1')
      expect(value.sourceFile).toStrictEqual('test')
      expect(value.sourcePos).toStrictEqual(0)
    })
  })
})
