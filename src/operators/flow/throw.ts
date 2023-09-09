import { CycleResult, State, checkIDictionary } from '../../state/index'
import { ValueType } from '../../index'
import { ShareableObject } from '../../objects/ShareableObject'
import { TypeCheck } from '../../src/errors/index'
import { checkIWritableDictionary } from '../../objects/dictionaries/index'
import { Custom } from '../../src/errors/Custom'
import { BaseError } from '../../src/errors/BaseError'

/* eslint-disable no-labels */

export function throwOp ({ operands }: State): CycleResult {
  const [dict] = operands.check(ValueType.dict)
  assert: checkIDictionary(dict.data)
  if (dict.data instanceof BaseError) {
    throw dict.data
  }
  try {
    checkIWritableDictionary(dict.data)
  } catch (e) {
    throw new TypeCheck()
  }
  const customError = new Custom(dict.data) // may throw TypeCheck
  ShareableObject.addRef(dict)
  operands.pop()
  throw customError
}

Object.defineProperty(throwOp, 'name', {
  value: 'throw',
  writable: false
})
