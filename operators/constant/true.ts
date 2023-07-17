import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function trueOp (): undefined {}

setOperatorAttributes(trueOp, {
  name: 'true',
  constant: {
    type: ValueType.boolean,
    data: true
  }
})
