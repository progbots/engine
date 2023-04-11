import { ValueType } from '..'
import { Undefined } from '../errors'
import { ArrayLike } from '../objects/Array'
import { State } from '../state'
import { checkOperands } from './operands'

export function * bind (state: State): Generator {
  const [proc] = checkOperands(state, ValueType.proc)
  const procs: ArrayLike[] = [proc.data as unknown as ArrayLike]
  let procIndex = 0
  while (procIndex < procs.length) {
    const procArray = procs[procIndex]
    for (let index = 0; index < procArray.ref.length; ++index) {
      const value = procArray.at(index)
      if (value.type === ValueType.call) {
        yield // bind cycle
        try {
          const resolvedValue = state.lookup(value.data as string)
          // TODO: some operators can be replaced with values (true, false, mark...)
          procArray.set(index, {
            ...value, // propagate debug infos
            ...resolvedValue
          })
        } catch (e) {
          if (!(e instanceof Undefined)) {
            throw e
          }
        }
      } else if (value.type === ValueType.proc) {
        procs.push(value.data as unknown as ArrayLike)
      }
    }
    ++procIndex
  }
}
