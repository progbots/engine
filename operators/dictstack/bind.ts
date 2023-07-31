import { ValueType } from '../../index'
import { Undefined } from '../../errors/index'
import { ArrayLike } from '../../objects/Array'
import { InternalValue, CycleResult, State } from '../../state/index'
import { extractDebugInfos } from '../debug-infos'
import { setOperatorAttributes } from '../attributes'

export function bind (state: State, [block]: readonly InternalValue[]): CycleResult {
  state.pushStepParameter(block)
  state.pushStepParameter({
    type: ValueType.integer,
    data: 0
  })
  return null
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* because parameters contains :
 * - at least the block being processed
 * - for each stacked block an additional index
 */
setOperatorAttributes(bind, {
  typeCheck: [ValueType.block],
  loop (state: State, parameters: readonly InternalValue[]): CycleResult | false {
    const lastParameter = parameters.at(-1)
    if (lastParameter!.type !== ValueType.integer) {
      return false
    }
    let index = lastParameter!.data
    const block = parameters.at(-2)
    const blockArray = block!.data as ArrayLike
    const value = blockArray.at(index)
    if (value.type === ValueType.call) {
      try {
        const resolvedValue = state.dictionaries.lookup(value.data)
        // TODO: some operators can be replaced with values (true, false, mark...)
        blockArray.set(index, {
          ...extractDebugInfos(value),
          ...resolvedValue
        })
      } catch (e) {
        if (!(e instanceof Undefined)) {
          throw e
        }
      }
    } else if (value.type === ValueType.block) {
      state.pushStepParameter(value)
      state.pushStepParameter(value)
      return null
    }
    state.popStepParameter()
    if (++index < blockArray.length) {
      state.pushStepParameter({
        type: ValueType.integer,
        data: index + 1
      })
    } else {
      state.popStepParameter()
    }
    return null
  }
})
