import { RUN_STEP_END, RunSteps } from '@state/run/index'
import { MemoryTracker } from '@state/MemoryTracker'
import { CallStack, DictionaryStack, OperandStack } from '@objects/stacks'
import { SystemDictionary } from '@objects/dictionaries/System'
import { CycleResult, IInternalState } from '@sdk'
import { IRunTest } from './IRunTest'
import { execute } from '../execute'

jest.mock('@operators', () => ({
  add: () => {}
}))

function executeRunTest (steps: RunSteps, test: IRunTest): void {
  const tracker = new MemoryTracker()
  const operands = new OperandStack(tracker)
  const callStack = new CallStack(tracker)
  const dictionaries = new DictionaryStack(tracker)
  dictionaries.begin(new SystemDictionary())
  test.before.callStack.forEach(value => callStack.push(value))
  if (test.before.step !== undefined) {
    callStack.step = test.before.step
  }
  if (test.before.index !== undefined) {
    callStack.index = test.before.index
  }
  if (test.before.parameters !== undefined) {
    callStack.parameters = test.before.parameters
  }
  const mockState: IInternalState = {
    memory: tracker,
    operands,
    calls: callStack,
    dictionaries,
    flags: Object.assign({
      call: true,
      parsing: false
    }, test.before.flags ?? {}),
    parse: function * () {}
  }
  const runOneStep = (): CycleResult => {
    const { top, index } = mockState.calls
    const step = steps[callStack.step]
    if (step === undefined) {
      throw new Error('Invalid step leads to undefined handler')
    }
    return step.call(mockState, top, index)
  }
  let exceptionCaught: Error | undefined
  let result: CycleResult = null
  try {
    result = runOneStep()
  } catch (e) {
    if (typeof e === 'object' && e instanceof Error) {
      exceptionCaught = e
    } else {
      throw e
    }
  }
  if (test.error !== undefined) {
    expect(exceptionCaught).toBeInstanceOf(test.error)
  } else if (test.after !== undefined) {
    expect(exceptionCaught).toBeUndefined()
    if (test.after.result !== undefined) {
      expect(result).toStrictEqual(test.after.result)
    } else {
      expect(result).toBeNull()
    }
    if (test.after.index !== undefined) {
      expect(callStack.index).toStrictEqual(test.after.index)
    } else if (callStack.step !== RUN_STEP_END) {
      expect(callStack.index).toStrictEqual(CallStack.NO_INDEX)
    }
    if (test.after.parameters !== undefined) {
      expect(callStack.parameters).toStrictEqual(test.after.parameters)
    } else {
      expect(callStack.parameters).toStrictEqual([])
    }
  }
}

export function executeRunTests (steps: RunSteps, descriptions: Record<string, IRunTest | IRunTest[]>): void {
  execute(descriptions, (test: IRunTest) => {
    executeRunTest(steps, test)
  })
}
