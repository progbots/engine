import { ValueType } from '../../index'
import { State } from '../../state/index'
import { $load } from '../signals'

export function * load (state: State): Generator {
  const { operands } = state
  const [name] = operands.check(ValueType.string).map(value => value.data as string)
  const sourceOrError = yield $load
  if (typeof sourceOrError === 'string') {
    operands.pop()
    state.callstack.push({
      type: ValueType.string,
      data: sourceOrError,
      untracked: true, // because external
      sourceFile: name,
      sourcePos: 0
    })
  } else {
    throw sourceOrError
  }
}
