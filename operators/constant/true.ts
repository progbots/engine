import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function trueOp (): void {}

setOperatorAttributes(trueOp, {
  name: 'true',
  constant: {
    type: ValueType.boolean,
    data: true
  }
})
