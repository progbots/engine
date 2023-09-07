import { ValueType } from '@api'
import { CycleResult } from '@sdk'
import { setOperatorAttributes } from '@operators/attributes'

export function trueOp (): CycleResult {
  return null
}

setOperatorAttributes(trueOp, {
  name: 'true',
  constant: {
    type: ValueType.boolean,
    isSet: true
  }
})
