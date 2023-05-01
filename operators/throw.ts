import { State } from '../state/index'
import { ValueType, IDictionary } from '../index'
import { checkOperands } from './operands'
import { ShareableObject } from '../objects/ShareableObject'
import { TypeCheck } from '../errors/index'
import { checkIWritableDictionary } from '../objects/dictionaries/index'
import { Custom } from '../errors/Custom'
import { InternalError } from '../errors/InternalError'

export function * throwOp (state: State): Generator {
  const [dictValue] = checkOperands(state, ValueType.dict)
  const dict = dictValue.data as IDictionary
  if (dict instanceof InternalError) {
    throw dict
  }
  try {
    checkIWritableDictionary(dict)
  } catch (e) {
    throw new TypeCheck()
  }
  const customError = new Custom(dict) // may throw TypeCheck
  ShareableObject.addRef(dictValue)
  state.pop()
  throw customError
}

Object.defineProperty(throwOp, 'name', {
  value: 'throw',
  writable: false
})
