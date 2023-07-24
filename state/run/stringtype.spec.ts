import { EngineSignal, EngineSignalType, ValueType } from '../../index'
import { CallStack } from '../../objects/stacks/index'
import { MemoryTracker } from '../MemoryTracker'
import { State } from '../index'
import { stringtype } from './stringtype'
import { RunStepResult } from './types'

const steps = stringtype.reduce((names: Record<string, number>, stepHandler: Function, index: number): Record<string, number> => {
  names[stepHandler.name] = index
  return names
}, {})

type MockState = State & {
  runOneStep: () => RunStepResult
}

function asState (callStack: CallStack): MockState {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {
    calls: callStack,
    flags: {
      keepDebugInfo: true
    },
    runOneStep (): RunStepResult {
      return stringtype[callStack.step].call(this)
    }
  } as MockState
}

describe('state/run/parse', () => {
  let tracker: MemoryTracker
  let callStack: CallStack
  let mockState: MockState
  const source = '1 2 add'
  const sourceFile = 'test.ps'

  beforeEach(() => {
    tracker = new MemoryTracker()
    callStack = new CallStack(tracker)
    mockState = asState(callStack)
  })

  describe('0: init', () => {
    beforeEach(() => {
      callStack.push({
        type: ValueType.string,
        data: source,
        sourceFile
      })
    })

    it('signals beforeParse and moves to start', () => {
      const result = mockState.runOneStep()
      const beforeParse: EngineSignal = {
        type: EngineSignalType.beforeParse,
        debug: true,
        source,
        sourceFile
      }
      expect(result).toStrictEqual(beforeParse)
      expect(callStack.step).toStrictEqual(steps.start)
    })
  })

  describe('1: start', () => {
    beforeEach(() => {
      callStack.push({
        type: ValueType.string,
        data: source,
        sourceFile
      })
      callStack.step = steps.start
    })

    it('stacks initial index, calls extract, signals tokenParsed and moves to submit', () => {
      const result = mockState.runOneStep()
      const tokenParsed: EngineSignal = {
        type: EngineSignalType.tokenParsed,
        debug: true,
        source,
        sourceFile,
        sourcePos: 0,
        token: '1'
      }
      expect(result).toStrictEqual(tokenParsed)
      expect(callStack.step).toStrictEqual(steps.submit)
      expect(callStack.parameters).toStrictEqual([{
        type: ValueType.integer,
        data: 1,
        source,
        sourceFile,
        sourcePos: 0
      }, {
        type: ValueType.integer,
        data: 1
      }])
    })
  })

  // describe('2: next', () => {
  //   beforeEach(() => {
  //     callStack.step = steps.next
  //     callStack.parameters = [{
  //       type: ValueType.integer,
  //       data: 1,
  //       source,
  //       sourceFile,
  //       sourcePos: 0
  //     }, {
  //       type: ValueType.integer,
  //       data: 1
  //     }]
  //   })

  //   it('stacks index and calls extract', () => {
  //     const result = mockState.runOneStep()
  //     expect(result).toStrictEqual({
  //       type: EngineSignalType.tokenParsed,
  //       debug: true,
  //       source,
  //       sourceFile,
  //       sourcePos: 0,
  //       token: '1'
  //     })
  //     expect(callStack.step).toStrictEqual(steps.submit)
  //     expect(callStack.parameters).toStrictEqual([{
  //       type: ValueType.integer,
  //       data: 1,
  //       source,
  //       sourceFile,
  //       sourcePos: 0,
  //       nextPos: 1
  //     }])
  //   })
  // })
})
