import { State } from '../state/index'
import { ValueType } from '../index'
import { TypeCheck } from '../errors/index'
import { ArrayLike } from '../objects/Array'

export function * aload ({ operands }: State): Generator {
  const [{ type, data }] = operands.check(null)
  if (![ValueType.array, ValueType.proc].includes(type)) {
    throw new TypeCheck()
  }
  const array = data as unknown as ArrayLike
  const { length } = array
  array.addRef()
  try {
    operands.pop()
    for (let index = 0; index < length; ++index) {
      const value = array.at(index)
      operands.push(value)
    }
  } finally {
    array.release()
  }
}
