import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function falseOp (): void {}

setOperatorAttributes(falseOp, {
  name: 'false',
  constant: {
    type: ValueType.boolean,
    data: false
  }
})
