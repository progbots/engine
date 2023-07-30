import { IDictionary, IStateFlags, Value, ValueType } from './index'
import { InternalValue, AtomicResult, OperatorFunction, State } from './state/index'
import { InternalError } from './errors/InternalError'
import { RUN_STEP_END, RunSteps } from './state/run/types'
import { MemoryTracker } from './state/MemoryTracker'
import { CallStack, DictionaryStack } from './objects/stacks/index'
import { SystemDictionary } from './objects/dictionaries'

interface TestDescription {
  skip?: boolean
  only?: boolean
  src: string
  cycles?: number // default to 1
  error?: Function // Subclass of InternalError
  expect?: Value[] | string | ((state: State, exceptionCaught?: Error) => void)
  host?: Record<string, OperatorFunction>
  keepDebugInfo?: boolean
  cleanBeforeCheckingForLeaks?: string
}

export const SOURCE_FILE = 'test-src.ps'

export function waitForCycles (iterator: Generator): any[] {
  const result = []
  while (true) {
    const { value, done } = iterator.next()
    result.push(value)
    if (result.length > 1000) {
      throw new Error('Too many cycles (infinite loop ?)')
    }
    if (done === true) {
      break
    }
  }
  return result
}

function executeTest (test: TestDescription): void {
  const {
    src,
    cycles: expectedCycles,
    error: expectedErrorClass,
    expect: expectedResult,
    host,
    keepDebugInfo,
    cleanBeforeCheckingForLeaks
  } = test
  let hostDictionary: IDictionary | undefined
  if (host !== undefined) {
    hostDictionary = {
      get names () {
        return Object.keys(host)
      },

      lookup (name: string): Value | null {
        const operator = host[name]
        if (operator === undefined) {
          return null
        }
        return {
          type: ValueType.operator,
          data: operator
        }
      }
    }
  }
  const state = new State({
    hostDictionary,
    keepDebugInfo
  })
  const initialMemory = state.memory.used
  let exceptionCaught: Error | undefined
  let cyclesCount = 0
  try {
    cyclesCount = waitForCycles(state.parse(src, SOURCE_FILE)).length
  } catch (e) {
    exceptionCaught = e as Error
  }
  if (typeof expectedResult !== 'function' || expectedResult.length !== 2) {
    if (expectedErrorClass === undefined) {
      expect(exceptionCaught).toBeUndefined()
    } else if (exceptionCaught === undefined) {
      expect(exceptionCaught).not.toBeUndefined()
    } else if (expectedErrorClass.prototype instanceof InternalError) {
      expect(exceptionCaught).toBeInstanceOf(Error)
      const { name } = expectedErrorClass
      expect(exceptionCaught.name).toStrictEqual(name)
    } else {
      expect(exceptionCaught).toBeInstanceOf(expectedErrorClass)
    }
  }
  if (expectedCycles !== undefined) {
    expect(cyclesCount).toStrictEqual(expectedCycles)
  }
  if (typeof expectedResult === 'function') {
    expectedResult(state, exceptionCaught)
  } else if (expectedResult !== undefined) {
    let expectedOperands
    if (typeof expectedResult === 'string') {
      const expectedState = new State({
        hostDictionary,
        keepDebugInfo
      })
      waitForCycles(expectedState.parse(expectedResult, 'test-expect.ps'))
      expectedOperands = expectedState.operands.ref
    } else {
      expectedOperands = expectedResult
    }
    const operands = state.operands.ref
    expect(operands.length).toBeGreaterThanOrEqual(expectedOperands.length)
    expect(operands.slice(0, expectedOperands.length)).toStrictEqual(expectedOperands)
  }
  if (cleanBeforeCheckingForLeaks !== undefined) {
    waitForCycles(state.parse(cleanBeforeCheckingForLeaks))
  }
  waitForCycles(state.parse('clear'))
  const finalMemory = state.memory.used
  expect(finalMemory).toStrictEqual(initialMemory)
}

export function executeTests (descriptions: Record<string, TestDescription | TestDescription[]>): void {
  Object.keys(descriptions).forEach((label: string) => {
    const description = descriptions[label]
    let tests: TestDescription[]
    if (Array.isArray(description)) {
      tests = description
    } else {
      tests = [description]
    }
    tests.forEach((test, index) => {
      let testLabel
      if (index > 0) {
        testLabel = `${label} (${index + 1})`
      } else {
        testLabel = label
      }
      if (test.skip === true) {
        it.skip(testLabel, executeTest.bind(null, test))
      } else if (test.only === true) {
        it.only(testLabel, executeTest.bind(null, test))
      } else {
        it(testLabel, executeTest.bind(null, test))
      }
    })
  })
}

interface RunTestDescription {
  skip?: boolean
  only?: boolean
  before: {
    flags?: Partial<IStateFlags>
    callStack: InternalValue[]
    step?: number
    index?: number
    parameters?: InternalValue[]
  }
  error?: Function
  after?: {
    result?: AtomicResult
    step: number
    index?: number
    parameters?: InternalValue[]
  }
}

type MockState = State & {
  runOneStep: () => AtomicResult
}

function executeRunTest (steps: RunSteps, test: RunTestDescription): void {
  const tracker = new MemoryTracker()
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
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const mockState = {
    calls: callStack,
    dictionaries,
    flags: Object.assign({
      call: true,
      parsing: false,
      yieldDebugSignals: false,
      keepDebugInfo: false
    }, test.before.flags ?? {}),
    runOneStep (): AtomicResult {
      const { top, index } = this.calls
      return steps[callStack.step].call(this, top, index)
    }
  } as MockState
  let exceptionCaught: Error | undefined
  let result: AtomicResult = null
  try {
    result = mockState.runOneStep()
  } catch (e) {
    exceptionCaught = e as Error
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

export function executeRunTests (steps: RunSteps, descriptions: Record<string, RunTestDescription | RunTestDescription[]>): void {
  Object.keys(descriptions).forEach((label: string) => {
    const description = descriptions[label]
    let tests: RunTestDescription[]
    if (Array.isArray(description)) {
      tests = description
    } else {
      tests = [description]
    }
    tests.forEach((test, index) => {
      let testLabel
      if (index > 0) {
        testLabel = `${label} (${index + 1})`
      } else {
        testLabel = label
      }
      if (test.skip === true) {
        it.skip(testLabel, executeRunTest.bind(null, steps, test))
      } else if (test.only === true) {
        it.only(testLabel, executeRunTest.bind(null, steps, test))
      } else {
        it(testLabel, executeRunTest.bind(null, steps, test))
      }
    })
  })
}

export function extractRunSteps (steps: RunSteps): Record<string, number> {
  return steps.reduce((names: Record<string, number>, stepHandler: Function, index: number): Record<string, number> => {
    names[stepHandler.name] = index
    return names
  }, {})
}
