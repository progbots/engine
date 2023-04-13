import { State } from '../state/index'
import { ValueType } from '../index'

export function * trueOp (state: State): Generator {
  state.push({
    type: ValueType.boolean,
    data: true
  })
}

Object.defineProperty(trueOp, 'name', {
  value: 'true',
  writable: false
})
