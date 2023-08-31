import { CycleResult, IInternalState } from '@sdk'
import { CallStack, DictionaryStack, OperandStack } from '@objects/stacks'
import { MemoryTracker } from '@state/MemoryTracker'
import { RUN_STEP_END, RunSteps } from '@state/run/RunSteps'
import { IRunTest } from './IRunTest'
import { execute } from '../execute'
import { IDictionary } from '@api'
import { toIDictionary } from '@test/toIDictionary'

jest.mock('@operators', () => ({
  add: () => {}
}))

function executeRunTest (steps: RunSteps, test: IRunTest): void {
  const tracker = new MemoryTracker()
  const operands = new OperandStack(tracker)
  const calls = new CallStack(tracker)
  const { host, callStack, step, index, parameters } = test.before
  let hostDictionary: IDictionary | undefined
  if (host !== undefined) {
    hostDictionary = toIDictionary(host)
  }
  const dictionaries = new DictionaryStack(tracker, hostDictionary)
  const reveresedCallStack = [...callStack].reverse()
  reveresedCallStack.forEach(value => calls.push(value))
  if (step !== undefined) {
    calls.step = step
  }
  if (index !== undefined) {
    calls.index = index
  }
  if (parameters !== undefined) {
    calls.parameters = parameters
  }
  const mockState: IInternalState = {
    memory: tracker,
    operands,
    calls,
    dictionaries,
    flags: Object.assign({
      call: true,
      parsing: false
    }, test.before.flags ?? {}),
    parse: function * () {}
  }
  const runOneStep = (): CycleResult => {
    const { top, index } = mockState.calls
    const step = steps[calls.step]
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
    expect(calls.step).toStrictEqual(expectedStep)
    expect(result).toStrictEqual(expectedResult ?? null)
    if (expectedStep !== RUN_STEP_END) {
      expect(calls.index).toStrictEqual(expectedIndex ?? CallStack.NO_INDEX)
      expect(calls.parameters).toStrictEqual(expectedParameters ?? [])
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
