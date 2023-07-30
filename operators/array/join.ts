import { ValueType } from '../../index'
import { TypeCheck } from '../../errors/index'
import { AtomicResult, State } from '../../state/index'
import { ArrayLike } from '../../objects/Array'

export function join (state: State): AtomicResult {
  const { operands } = state
  const [{ data }] = operands.check(ValueType.array)
  const array = data as unknown as ArrayLike
  if (array.some(value => value.type !== ValueType.string)) {
    throw new TypeCheck()
  }
  const strings = array.ref.map(value => value.data as string)
  operands.splice(1, {
    type: ValueType.string,
    data: strings.join('')
  })
  return null
}
