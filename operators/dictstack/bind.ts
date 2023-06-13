import { ValueType } from '../../index'
import { TypeCheck, Undefined } from '../../errors/index'
import { ArrayLike } from '../../objects/Array'
import { State } from '../../state/index'

export function * bind ({ operands, dictionaries }: State): Generator {
  const [blockOrProc] = operands.check(null)
  if (![ValueType.block, ValueType.proc].includes(blockOrProc.type)) {
    throw new TypeCheck()
  }
  const blocks: ArrayLike[] = [blockOrProc.data as unknown as ArrayLike]
  for (const procArray of blocks) {
    for (let index = 0; index < procArray.ref.length; ++index) {
      const value = procArray.at(index)
      if (value.type === ValueType.call) {
        yield // bind cycle
        try {
          const resolvedValue = dictionaries.lookup(value.data)
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
      } else if (value.type === ValueType.block) {
        blocks.push(value.data as unknown as ArrayLike)
      }
    }
  }
}
