import { ValueType } from '../../index'
import { CycleResult } from '../../state/index'
import { setOperatorAttributes } from '../attributes'

export function falseOp (): CycleResult {
  return null
}

setOperatorAttributes(falseOp, {
  name: 'false',
  constant: {
    type: ValueType.boolean,
    data: false
  }
})
