import { ValueType } from '../../index'
import { CycleResult } from '../../state/index'
import { setOperatorAttributes } from '../attributes'

export function mark (): CycleResult {
  return null
}

setOperatorAttributes(mark, {
  name: 'mark',
  constant: {
    type: ValueType.mark,
    data: null
  }
})
