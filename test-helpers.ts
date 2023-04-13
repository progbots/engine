import { Value } from './index'
import { State } from './state/index'
import { length as itLength } from './iterators'

interface TestDescription {
  skip?: boolean
  only?: boolean
  src: string
  cycles?: number // default to 1
  error?: Function // Subclass of BaseError
  expect?: Value[] | string | ((state: State) => void)
}

function executeTest (test: TestDescription): void {
  const {
    src,
    cycles: expectedCycles,
    error: expectedError,
    expect: expectedResult
  } = test
  const state = new State()
  try {
    const cyclesCount = itLength(state.parse(src))
    if (expectedCycles !== undefined) {
      expect(cyclesCount).toStrictEqual(expectedCycles)
    }
    expect(expectedError).toBeUndefined()
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
  } catch (e) {
    if (expectedError !== undefined) {
      expect(e).toBeInstanceOf(expectedError)
      return
    }
    throw e
  }
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
