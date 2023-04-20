import { State } from '../state/index'
import { ValueType } from '../index'
import { checkOperands } from './operands'
import { ShareableObject } from '../objects/ShareableObject'
import { TypeCheck } from '../errors'
import { IWritableDictionary } from '../objects/dictionaries'
import { Custom } from '../errors/Custom'
import { BaseError } from '../errors/BaseError'

export function * throwOp (state: State): Generator {
  const [dictValue] = checkOperands(state, ValueType.dict)
  const dict = dictValue.data as IWritableDictionary
  const { names } = dict
  if (!names.includes('name') || !names.includes('message')) {
    throw new TypeCheck()
  }
  ShareableObject.addRef(dictValue)
  state.pop()
  if (dict instanceof BaseError) {
    throw dict
  }
  throw new Custom(dict)
}

Object.defineProperty(throwOp, 'name', {
  value: 'throw',
  writable: false
})
