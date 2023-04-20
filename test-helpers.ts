import { IDictionary, Value, ValueType } from './index'
import { OperatorFunction, State } from './state/index'
import { length as itLength } from './iterators'
import { BaseError } from './errors/BaseError'

interface TestDescription {
  skip?: boolean
  only?: boolean
  src: string
  cycles?: number // default to 1
  error?: Function // Subclass of BaseError
  expect?: Value[] | string | ((state: State) => void)
  host?: Record<string, OperatorFunction>
  cleanBeforeCheckingForLeaks?: string
}

function executeTest (test: TestDescription): void {
  const {
    src,
    cycles: expectedCycles,
    error: expectedError,
    expect: expectedResult,
    host,
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
    hostDictionary
  })
  const initialMemory = state.usedMemory
  let exceptionCaught: Error | undefined
  let cyclesCount = 0
  try {
    cyclesCount = itLength(state.parse(src))
  } catch (e) {
    exceptionCaught = e as Error
  }
  if (expectedCycles !== undefined) {
    expect(cyclesCount).toStrictEqual(expectedCycles)
  }
  if (typeof expectedResult === 'function') {
    expectedResult(state)
  } else if (expectedResult !== undefined) {
    let expectedOperands
    if (typeof expectedResult === 'string') {
      const expectedState = new State()
      itLength(expectedState.parse(expectedResult))
      expectedOperands = expectedState.operandsRef
    } else {
      expectedOperands = expectedResult
    }
    const operands = state.operandsRef
    expect(operands.length).toBeGreaterThanOrEqual(expectedOperands.length)
    expect(operands.slice(0, expectedOperands.length)).toStrictEqual(expectedOperands)
  }
  if (expectedError === undefined) {
    expect(exceptionCaught).toBeUndefined()
  } else {
    expect(exceptionCaught).toBeInstanceOf(expectedError)
  }
  if (exceptionCaught !== undefined && exceptionCaught instanceof BaseError) {
    exceptionCaught.release()
  }
  if (cleanBeforeCheckingForLeaks !== undefined) {
    itLength(state.parse(cleanBeforeCheckingForLeaks))
  }
  itLength(state.parse('clear'))
  const finalMemory = state.usedMemory
  expect(finalMemory).toStrictEqual(initialMemory)
}

export function executeTests (tests: Record<string, TestDescription | TestDescription[]>): void {
  Object.keys(tests).forEach((label: string) => {
    const test = tests[label]
    if (Array.isArray(test)) {
      test.forEach((item, index) => {
        it(`${label} (${index + 1})`, executeTest.bind(null, item))
      })
    } else if (test.skip === true) {
      it.skip(label, executeTest.bind(null, test))
    } else if (test.only === true) {
      it.only(label, executeTest.bind(null, test))
    } else {
      it(label, executeTest.bind(null, test))
    }
  })
}
