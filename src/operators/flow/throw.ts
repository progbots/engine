import { CycleResult, IInternalState, Internal, scanIWritableDictionary } from '@sdk'
import { DictionaryValue, ValueType } from '@api'
import { ShareableObject } from '@objects/ShareableObject'
import { TypeCheck, BaseError, Custom } from '@errors'
import { setOperatorAttributes } from '@operators/attributes'

export function throwOp ({ operands }: IInternalState, { dictionary }: Internal<DictionaryValue>): CycleResult {
  if (dictionary instanceof BaseError) {
    throw dictionary
  }
  try {
    scanIWritableDictionary(dictionary)
  } catch (e) {
    throw new TypeCheck()
  }
  const customError = new Custom(dictionary) // may throw TypeCheck
  ShareableObject.addRef({
    type: ValueType.dictionary,
    dictionary
  })
  operands.pop()
  throw customError
}

setOperatorAttributes(throwOp, {
  name: 'throw'
}, ValueType.dictionary)
