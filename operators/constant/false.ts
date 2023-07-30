import { ValueType } from '../../index'
import { AtomicResult } from '../../state/index'
import { setOperatorAttributes } from '../attributes'

export function falseOp (): AtomicResult {
  return null
}

setOperatorAttributes(falseOp, {
  name: 'false',
  constant: {
    type: ValueType.boolean,
    data: false
  }
})
