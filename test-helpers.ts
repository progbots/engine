import { Value, IState } from './types'
import { cycles, State } from './state'

interface TestDescription {
  src: string
  cycles?: number // default to 1
  error?: Function // Subclass of BaseError
  expect?: Value[] | string | ((state: IState) => void)
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
    const cyclesCount = cycles(state.eval(src))
    if (expectedCycles !== undefined) {
      expect(cyclesCount).toStrictEqual(expectedCycles)
    }
    if (typeof expectedResult === 'function') {
      expectedResult(state)
    } else if (expectedResult !== undefined) {
      let expectedStackItems
      if (typeof expectedResult === 'string') {
        const expectedState = new State()
        cycles(expectedState.eval(expectedResult))
        expectedStackItems = expectedState.stack()
      } else {
        expectedStackItems = expectedResult
      }
      const stack = state.stack()
      expect(stack.length).toBeGreaterThanOrEqual(expectedStackItems.length)
      expect(stack.slice(0, expectedStackItems.length)).toStrictEqual(expectedStackItems)
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
    } else {
      it(label, executeTest.bind(null, test))
    }
  })
}
