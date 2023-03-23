import { State } from '../state'
import { ValueType } from '..'

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
