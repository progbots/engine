import { State } from '../../state/index'
import { ValueType } from '../../index'

export function * falseOp ({ operands }: State): Generator {
  operands.push({
    type: ValueType.boolean,
    data: false
  })
}

Object.defineProperty(falseOp, 'name', {
  value: 'false',
  writable: false
})
