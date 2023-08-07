import { ValueType } from '../../index'
import { Internal, Undefined } from '../../errors/index'
import { ArrayLike } from '../../objects/Array'
import { InternalValue, CycleResult, State } from '../../state/index'
import { extractDebugInfos } from '../debug-infos'
import { setOperatorAttributes } from '../attributes'

/* eslint-disable no-labels */

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
    if (lastParameter === undefined || lastParameter.type !== ValueType.integer) {
      return false
    }
    let index = lastParameter.data
    const block = parameters.at(-2)
    assert: if (block === undefined) {
      throw new Internal('Invalid bind parameters')
    } else {
      ArrayLike.check(block.data)
    }
    const value = block.data.at(index)
    if (value.type === ValueType.call) {
      try {
        const resolvedValue = state.dictionaries.lookup(value.data)
        // TODO: some operators can be replaced with values (true, false, mark...)
        block.data.set(index, {
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
    if (++index < block.data.length) {
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
