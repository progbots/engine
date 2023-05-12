import { ValueType } from '../index'
import { Undefined } from '../errors/index'
import { ArrayLike } from '../objects/Array'
import { State } from '../state/index'

export function * bind ({ operands, dictionaries }: State): Generator {
  const [proc] = operands.check(ValueType.proc)
  const procs: ArrayLike[] = [proc.data as unknown as ArrayLike]
  for (const procArray of procs) {
    for (let index = 0; index < procArray.ref.length; ++index) {
      const value = procArray.at(index)
      if (value.type === ValueType.call) {
        yield // bind cycle
        try {
          const resolvedValue = dictionaries.lookup(value.data as string)
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
  }
}
