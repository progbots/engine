import { ValueType } from '../../index'
import { setOperatorAttributes } from '../attributes'

export function mark (): void {}

setOperatorAttributes(mark, {
  name: 'mark',
  constant: {
    type: ValueType.mark,
    data: null
  }
})
