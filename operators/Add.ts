import { State, ValueType } from '../types'
import { Operator } from './Operator'

export class Add extends Operator {
  evaluate (state: State): void {
    this.checkStack(state, ValueType.number, ValueType.number)
    const [first, second] = state.stack.slice(0, 2).map(value => value.data as number)
    state.stack.splice(0, 2)
    state.stack.unshift({
      type: ValueType.number,
      data: first + second
    })
  }
}
