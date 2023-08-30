import { CycleResult, IInternalState } from '@sdk'
import { CallStack, DictionaryStack, OperandStack } from '@objects/stacks'
import { SystemDictionary } from '@objects/dictionaries/System'
import { MemoryTracker } from '@state/MemoryTracker'
import { RUN_STEP_END, RunSteps } from '@state/run/RunSteps'
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
    const {
      step: resultStep,
      result: expectedResult,
      index: expectedIndex,
      parameters: expectedParameters,
      operands: expectedOperands
    } = test.after
    const expectedStep = resultStep ?? RUN_STEP_END
    expect(callStack.step).toStrictEqual(expectedStep)
    expect(result).toStrictEqual(expectedResult ?? null)
    if (expectedStep !== RUN_STEP_END) {
      expect(callStack.index).toStrictEqual(expectedIndex ?? CallStack.NO_INDEX)
      expect(callStack.parameters).toStrictEqual(expectedParameters ?? [])
    }
    expect(operands.ref).toStrictEqual(expectedOperands ?? [])
  }
}

export function executeRunTests (steps: RunSteps, tests: IRunTest[]): void {
  execute(tests.reduce((descriptions: Record<string, IRunTest[]>, test: IRunTest) => {
    const fromStep = steps[test.before.step ?? 0]
    if (fromStep === undefined) {
      throw new Error('Invalid before step')
    }
    const fromState = fromStep.name
    let toState: string
    if (test.after !== undefined) {
      const afterStep = test.after.step
      if (afterStep === undefined || afterStep === RUN_STEP_END) {
        toState = '∅'
      } else {
        const toStep = steps[afterStep]
        if (toStep === undefined) {
          throw new Error('Invalid to step')
        }
        toState = toStep.name
      }
    } else if (test.error != null) {
      toState = 'error'
    } else {
      throw new Error('Invalid after step')
    }
    const key = `${fromState} -> ${toState}`
    let keyTests = descriptions[key]
    if (keyTests === undefined) {
      keyTests = []
      descriptions[key] = keyTests
    }
    keyTests.push(test)
    return descriptions
  }, {}), (test: IRunTest) => {
    executeRunTest(steps, test)
  })
}
