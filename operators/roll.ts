import { ValueType } from '../index'
import { State } from '../state/index'
import { checkOperands, spliceOperands } from './operands'
import { ShareableObject } from '../objects/ShareableObject'

export function * roll (state: State): Generator {
  const [steps, size] = checkOperands(state, ValueType.integer, ValueType.integer).map(value => value.data as number)
  const values = state.operandsRef.slice(2, 2 + size).reverse()
  ShareableObject.addRef(values)
  try {
    spliceOperands(state, 2 + size)
    for (let index = 0; index < size; ++index) {
      state.push(values[(size + index - steps) % size])
    }
  } finally {
    ShareableObject.release(values)
  }
}
