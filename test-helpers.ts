import { IState, Value, ValueType } from './types'
import { State } from './state'
import { StackUnderflow } from './errors'

type StackItem = string | number | Value
interface StackInitializer {
  stack?: StackItem[]
}

export function createState ({
  stack
}: StackInitializer = {}): IState {
  const initialStack = (stack ?? []).map((item: StackItem): Value => {
    if (typeof item === 'string') {
      return {
        type: ValueType.string,
        data: item
      }
    }
    if (typeof item === 'number') {
      return {
        type: ValueType.number,
        data: item
      }
    }
    return item
  })
  return new State(initialStack)
}
