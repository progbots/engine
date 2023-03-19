import { State } from '../state'
import { ValueType } from '../types'

export function openArray (state: State): void {
  state.push({
    type: ValueType.mark,
    data: null
  })
}

Object.defineProperty(openArray, 'name', {
  value: '[',
  writable: false
})
