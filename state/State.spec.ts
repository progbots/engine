import { InternalValue, State } from './index'
import { EngineSignalType, ValueType } from '../index'
import { InternalError } from '../errors/InternalError'
import { waitForCycles } from '../test-helpers'
import { renderCallStack } from './callstack'

describe('state/State', () => {
  describe('protection against concurrent execution', () => {
    it('maintains a parsing flag', () => {
      const state = new State()
      expect(state.flags.parsing).toStrictEqual(false)
      const generator = state.parse('1 2 3')
      expect(state.flags.parsing).toStrictEqual(true)
      waitForCycles(generator)
      expect(state.flags.parsing).toStrictEqual(false)
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
    describe.only('general', () => {
      let state: State

      beforeEach(() => {
        state = new State()
      })

      afterEach(() => {
        expect(state.calls.length).toStrictEqual(0)
      })

      it('stacks integer value', () => {
        expect(waitForCycles(state.parse('1')).length).toStrictEqual(6)
        expect(state.operands.ref).toStrictEqual([{
          type: ValueType.integer,
          data: 1
        }])
      })

      it('considers the first item as the last pushed', () => {
        expect(waitForCycles(state.parse('1 2')).length).toStrictEqual(7)
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
        expect(waitForCycles(state.parse('1 2 add')).length).toStrictEqual(18)
        expect(state.operands.ref).toStrictEqual([{
          type: ValueType.integer,
          data: 3
        }])
      })

      it.only('allows proc definition and execution', () => {
        state = new State({
          keepDebugInfo: true,
          yieldDebugSignals: true
        })
        const signals = waitForCycles(state.parse('"test" { 2 3 add } def test'))
        console.log(signals)
        expect(signals.length).toStrictEqual(50)
        expect(state.operands.ref).toStrictEqual([{
          type: ValueType.integer,
          data: 5
        }])
      })

      it('controls call execution (defining)', () => {
        waitForCycles(state.parse('"test" { { 1 } } def test', 'test.ps'))
        expect(state.operands.ref.length).toStrictEqual(1)
        expect(state.operands.ref[0].type).toStrictEqual(ValueType.block)
      })

      it('controls call execution (call on proc)', () => {
        waitForCycles(state.parse('"one" { 1 } def "test" { one } def test', 'test.ps'))
        expect(state.operands.ref).toStrictEqual([{
          type: ValueType.integer,
          data: 1
        }])
      })

      it('controls call execution (call on bound proc)', () => {
        waitForCycles(state.parse('"one" { 1 } def "test" { one } bind def test', 'test.ps'))
        expect(state.operands.ref).toStrictEqual([{
          type: ValueType.integer,
          data: 1
        }])
      })
    })

    describe('flags.call', () => {
      it('starts with call being enabled', () => {
        const state = new State()
        expect(state.flags.call).toStrictEqual(true)
      })

      it('switches to false when entering a block', () => {
        const state = new State()
        waitForCycles(state.parse('{'))
        expect(state.flags.call).toStrictEqual(false)
      })

      it('switches back to true when exiting a block', () => {
        const state = new State()
        waitForCycles(state.parse('{ }'))
        expect(state.flags.call).toStrictEqual(true)
      })

      it('cumulates blocks definition', () => {
        const state = new State()
        waitForCycles(state.parse('{ { }'))
        expect(state.flags.call).toStrictEqual(false)
        waitForCycles(state.parse('}'))
        expect(state.flags.call).toStrictEqual(true)
      })
    })

    describe('step by step debugging', () => {
      interface DebugStep {
        label: string
        signal?: string
        operands?: InternalValue[]
        callstack?: string
      }

      interface DebugScenario {
        label: string
        src: string
        steps: DebugStep[]
      }

      function test (scenario: DebugScenario): void {
        describe(scenario.label, () => {
          let state: State
          let run: Generator
          let value: any
          let done: boolean = false

          beforeAll(() => {
            state = new State()
            run = state.parse(scenario.src)
          })

          afterEach(() => {
            const result = run.next()
            value = result.value
            done = result.done ?? false
          })

          it('starts empty', () => {
            expect(done).toStrictEqual(false)
            expect(state.operands.ref).toStrictEqual([])
            expect(renderCallStack(state.calls)).toStrictEqual('')
          })

          scenario.steps.forEach(step => {
            it(`goes to step: ${step.label}`, () => {
              expect(done).toStrictEqual(false)
              if (step.signal !== undefined) {
                expect(value).toStrictEqual(step.signal)
              }
              if (step.operands !== undefined) {
                expect(state.operands.ref).toStrictEqual(step.operands)
              }
              if (step.callstack !== undefined) {
                expect(renderCallStack(state.calls)).toStrictEqual(step.callstack)
              }
            })
          })

          it('ends', () => {
            expect(done).toStrictEqual(true)
          })
        })
      }

      test({
        label: 'operand push',
        src: '1',
        steps: [{
          label: 'start parsing',
          signal: EngineSignalType.beforeParse,
          operands: [],
          callstack: '"1"'
        }, {
          label: 'parsed 1',
          signal: EngineSignalType.tokenParsed,
          operands: [],
          callstack: '"»1«"'
        }, {
          label: 'before pushing 1',
          signal: EngineSignalType.beforeOperand,
          operands: [],
          callstack: '"»1«"'
        }, {
          label: 'after pushing 1',
          signal: EngineSignalType.afterOperand,
          operands: [{
            type: ValueType.integer,
            data: 1
          }],
          callstack: '"»1«"'
        }, {
          label: 'end parsing',
          signal: EngineSignalType.afterParse,
          operands: [{
            type: ValueType.integer,
            data: 1
          }],
          callstack: '"1"'
        }]
      })

      test({
        label: 'operator call',
        src: '1 2 add',
        steps: [{
          label: 'start parsing',
          signal: EngineSignalType.beforeParse,
          operands: [],
          callstack: '"1 2 add"'
        }, {
          label: 'parsed 1',
          signal: EngineSignalType.tokenParsed,
          operands: [],
          callstack: '"»1« 2 add"'
        }, {
          label: 'before pushing 1',
          signal: EngineSignalType.beforeOperand,
          operands: [],
          callstack: '"»1« 2 add"'
        }, {
          label: 'after pushin 1',
          signal: EngineSignalType.afterOperand,
          operands: [{
            type: ValueType.integer,
            data: 1
          }],
          callstack: '"»1« 2 add"'
        }, {
          label: 'parsed 2',
          signal: EngineSignalType.tokenParsed,
          callstack: '"1 »2« add"'
        }, {
          label: 'before pushing 2',
          signal: EngineSignalType.beforeOperand,
          operands: [{
            type: ValueType.integer,
            data: 1
          }],
          callstack: '"1 »2« add"'
        }, {
          label: 'after pushing 2',
          signal: EngineSignalType.afterOperand,
          operands: [{
            type: ValueType.integer,
            data: 2
          }, {
            type: ValueType.integer,
            data: 1
          }],
          callstack: '"1 »2« add"'
        }, {
          label: 'parsed add',
          signal: EngineSignalType.tokenParsed,
          callstack: '"1 2 »add«"'
        }, {
          label: 'before lookup for add',
          signal: EngineSignalType.beforeCall,
          callstack: 'add\n"1 2 »add«"'
        }, {
          label: 'before calling the -add- operator',
          signal: EngineSignalType.beforeOperator,
          callstack: '-add-\nadd\n"1 2 »add«"'
        }, {
          label: 'evaluated -add-',
          signal: EngineSignalType.afterOperator,
          operands: [{
            type: ValueType.integer,
            data: 3
          }],
          callstack: '-add-\nadd\n"1 2 »add«"'
        }, {
          label: 'after lookup for add',
          signal: EngineSignalType.afterCall,
          callstack: 'add\n"1 2 »add«"'
        }, {
          label: 'end parsing',
          signal: EngineSignalType.afterParse,
          operands: [{
            type: ValueType.integer,
            data: 3
          }],
          callstack: '"1 2 add"'
        }]
      })
    })
  })

  describe('memory monitoring', () => {
    let initialMemoryUsed: number

    beforeAll(() => {
      const state = new State()
      const used = state.memory.used
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
      const used = state.memory.used
      expect(used).toBeGreaterThan(initialMemoryUsed)
    })

    it('gets back to initial after clearing the stack', () => {
      const state = new State()
      state.operands.push({
        type: ValueType.integer,
        data: 1
      })
      state.operands.pop()
      const used = state.memory.used
      expect(used).toStrictEqual(initialMemoryUsed)
    })

    it('does not include parsed source size', () => {
      const state = new State({
        maxMemoryBytes: 256
      })
      waitForCycles(state.parse(`
% ${''.padStart(1024, 'abc')}
1 2 add
      `))
      expect(state.operands.ref[0]).toStrictEqual({
        type: ValueType.integer,
        data: 3
      })
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
    beforeAll(() => {
      // Securing loop test against infinite loops
      const state = new State()
      waitForCycles(state.parse('true { 42 } if'))
      expect(state.operands.at(0)).toStrictEqual({
        type: ValueType.integer,
        data: 42
      })
    })

    it('breaks a loop', () => {
      const state = new State()
      waitForCycles(state.parse('{ break } loop'))
    })

    it('signals an invalid use of break', () => {
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

    it('signals an invalid use of break (inside if)', () => {
      const state = new State()
      let exceptionCaught: Error | undefined
      try {
        waitForCycles(state.parse('true { break } if'))
      } catch (e) {
        exceptionCaught = e as Error
        expect(exceptionCaught.name).toStrictEqual('InvalidBreak')
      }
      expect(exceptionCaught).not.toBeUndefined()
    })
  })

  describe('debug information', () => {
    describe('when off', () => {
      it('drops debug information', () => {
        const state = new State()
        expect(state.flags.keepDebugInfo).toStrictEqual(false)
        waitForCycles(state.parse('1', 'test.ps'))
        const value = state.operands.ref[0]
        expect(value.source).toBeUndefined()
        expect(value.sourceFile).toBeUndefined()
        expect(value.sourcePos).toBeUndefined()
      })
    })

    describe('when on', () => {
      it('keeps debug information', () => {
        const state = new State({
          keepDebugInfo: true
        })
        expect(state.flags.keepDebugInfo).toStrictEqual(true)
        waitForCycles(state.parse('1', 'test.ps'))
        const value = state.operands.ref[0]
        expect(value.source).toStrictEqual('1')
        expect(value.sourceFile).toStrictEqual('test.ps')
        expect(value.sourcePos).toStrictEqual(0)
      })
    })
  })
})
