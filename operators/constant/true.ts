import { ValueType } from '../../index'
import { CycleResult } from '../../state/index'
import { setOperatorAttributes } from '../attributes'

export function trueOp (): CycleResult {
  return null
}

setOperatorAttributes(trueOp, {
  name: 'true',
  constant: {
    type: ValueType.boolean,
    data: true
  }
})
