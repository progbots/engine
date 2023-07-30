import { ValueType } from '../../index'
import { AtomicResult } from '../../state/index'
import { setOperatorAttributes } from '../attributes'

export function trueOp (): AtomicResult {
  return null
}

setOperatorAttributes(trueOp, {
  name: 'true',
  constant: {
    type: ValueType.boolean,
    data: true
  }
})
