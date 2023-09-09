import { IDictionary } from '@api'
import { BaseError } from '@errors'
import { State } from '@state/State'
import { IStateTest } from './IStateTest'
import { execute } from '../execute'
import { waitForCycles } from '../wait-for-cycles'
import { toIDictionary } from '../toIDictionary'

export const SOURCE_FILE = 'test-src.ps'

function executeStateTest (test: IStateTest): void {
  const {
    src,
    cycles: expectedCycles,
    error: expectedErrorClass,
    expect: expectedResult,
    host,
    cleanBeforeCheckingForLeaks
  } = test
  let hostDictionary: IDictionary | undefined
  if (host !== undefined) {
    hostDictionary = toIDictionary(host)
  }
  const state = new State({
    hostDictionary
  })
  const initialMemory = state.memory.used
  let exceptionCaught: Error | undefined
  let cyclesCount = 0
  try {
    cyclesCount = waitForCycles(state.parse(src, SOURCE_FILE)).length
  } catch (e) {
    if (typeof e === 'object' && e instanceof Error) {
      exceptionCaught = e
    } else {
      throw e
    }
  }
  if (typeof expectedResult !== 'function' || expectedResult.length !== 2) {
    if (expectedErrorClass === undefined) {
      expect(exceptionCaught).toBeUndefined()
    } else if (exceptionCaught === undefined) {
      expect(exceptionCaught).not.toBeUndefined()
    } else if (expectedErrorClass.prototype instanceof BaseError) {
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
        hostDictionary
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

export function executeStateTests (descriptions: Record<string, IStateTest | IStateTest[]>): void {
  execute(descriptions, (test: IStateTest) => {
    executeStateTest(test)
  })
}
