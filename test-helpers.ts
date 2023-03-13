import { Value } from './types'
import { cycles, State } from './state'

interface TestDescription {
  src: string
  cycles?: number // default to 1
  error?: Function // Subclass of BaseError
  expect?: Value[] | string // top of the stack
}

function executeTest (test: TestDescription): void {
  const {
    src,
    cycles: expectedCycles,
    error: expectedError,
    expect: expectedStack
  } = test
  const state = new State()
  try {
    const cyclesCount = cycles(state.eval(src))
    if (expectedCycles !== undefined) {
      expect(cyclesCount).toStrictEqual(expectedCycles)
    }
    if (expectedStack !== undefined) {
      let expectedStackItems
      if (typeof expectedStack === 'string') {
        const expectedState = new State()
        cycles(expectedState.eval(expectedStack))
        expectedStackItems = expectedState.stack()
      } else {
        expectedStackItems = expectedStack
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
