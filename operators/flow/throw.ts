import { CycleResult, State, checkIDictionary } from '../../state/index'
import { ValueType } from '../../index'
import { ShareableObject } from '../../objects/ShareableObject'
import { TypeCheck } from '../../errors/index'
import { checkIWritableDictionary } from '../../objects/dictionaries/index'
import { Custom } from '../../errors/Custom'
import { InternalError } from '../../errors/InternalError'

/* eslint-disable no-labels */

export function throwOp ({ operands }: State): CycleResult {
  const [dict] = operands.check(ValueType.dict)
  assert: checkIDictionary(dict.data)
  if (dict.data instanceof InternalError) {
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
