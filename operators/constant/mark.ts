import { ValueType } from '../../index'
import { AtomicResult } from '../../state/index'
import { setOperatorAttributes } from '../attributes'

export function mark (): AtomicResult {
  return null
}

setOperatorAttributes(mark, {
  name: 'mark',
  constant: {
    type: ValueType.mark,
    data: null
  }
})
