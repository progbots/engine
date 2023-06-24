import { IDictionary, Value, ValueType } from './index'
import { OperatorFunction, State } from './state/index'
import { InternalError } from './errors/InternalError'

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

export function waitForCycles (iterator: Generator): number {
  let count = 0
  let { done } = iterator.next()
  while (done === false) {
    ++count
    if (count > 1000) {
      throw new Error('Too many cycles (infinite loop ?)')
    }
    done = iterator.next().done
  }
  return count
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
    cyclesCount = waitForCycles(state.parse(src, SOURCE_FILE))
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
