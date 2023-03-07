import { State, ValueType } from '../types'
import { Operator } from './Operator'

class Add extends Operator {
  evaluate (state: State): void {
    this.checkStack(state, ValueType.number, ValueType.number)
    const ops = state.stack.slice(0, 2)
  }
}
