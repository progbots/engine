import { State } from '../state'
import { ValueType } from '..'

export function * falseOp (state: State): Generator {
  state.push({
    type: ValueType.boolean,
    data: false
  })
}

Object.defineProperty(falseOp, 'name', {
  value: 'false',
  writable: false
})
