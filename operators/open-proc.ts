import { State } from '../state'
import { ValueType } from '..'

export function * openProc (state: State): Generator {
  state.push({
    type: ValueType.mark,
    data: null
  })
  state.preventCall()
}

Object.defineProperty(openProc, 'name', {
  value: '{',
  writable: false
})
