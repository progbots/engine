import { State } from '../state'
import { ValueType } from '..'

export function * openArray (state: State): Generator {
  state.push({
    type: ValueType.mark,
    data: null
  })
}

Object.defineProperty(openArray, 'name', {
  value: '[',
  writable: false
})
