import { State } from '../../state/index'
import { ValueType } from '../../index'

export function * trueOp ({ operands }: State): Generator {
  operands.push({
    type: ValueType.boolean,
    data: true
  })
}

Object.defineProperty(trueOp, 'name', {
  value: 'true',
  writable: false
})
