import { State } from '../state/index'
import { ValueType } from '../index'
import { checkOperands } from './operands'
import { TypeCheck } from '../errors/index'
import { ArrayLike } from '../objects/Array'

export function * aload (state: State): Generator {
  const [{ type, data }] = checkOperands(state, null)
  if (![ValueType.array, ValueType.proc].includes(type)) {
    throw new TypeCheck()
  }
  const array = data as unknown as ArrayLike
  const { length } = array
  array.addRef()
  try {
    state.pop()
    for (let index = 0; index < length; ++index) {
      const value = array.at(index)
      state.push(value)
    }
  } finally {
    array.release()
  }
}
