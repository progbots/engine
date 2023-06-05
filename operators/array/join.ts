import { ValueType } from '../../index'
import { TypeCheck } from '../../errors/index'
import { State } from '../../state/index'
import { ArrayLike } from '../../objects/Array'

export function * join (state: State): Generator {
  const { operands } = state
  const [array] = operands.check(ValueType.array)
  const arrayImpl = array.data as ArrayLike
  if (arrayImpl.some(value => value.type !== ValueType.string)) {
    throw new TypeCheck()
  }
  const strings = arrayImpl.ref.map(value => value.data as string)
  operands.splice(1, {
    type: ValueType.string,
    data: strings.join('')
  })
}
