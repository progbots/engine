import { State } from '../../state/index'
import { ValueType } from '../../index'

export function falseOp ({ operands }: State): void {
  operands.push({
    type: ValueType.boolean,
    data: false
  })
}

Object.defineProperty(falseOp, 'name', {
  value: 'false',
  writable: false
})
