import { ValueType } from '@api'
import { CycleResult } from '@sdk'
import { setOperatorAttributes } from '@operators/attributes'

export function falseOp (): CycleResult {
  return null
}

setOperatorAttributes(falseOp, {
  name: 'false',
  constant: {
    type: ValueType.boolean,
    isSet: false
  }
})
