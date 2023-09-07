import { ValueType } from '@api'
import { CycleResult } from '@sdk'
import { setOperatorAttributes } from '@operators/attributes'

export function mark (): CycleResult {
  return null
}

setOperatorAttributes(mark, {
  name: 'mark',
  constant: {
    type: ValueType.mark
  }
})
