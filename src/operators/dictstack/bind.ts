import { BlockValue, ValueType, checkBlockValue } from '@api'
import { InternalValue, CycleResult, IInternalState, getDebugInfos, Internal } from '@sdk'
import { Undefined } from '@errors'
import { ValueArray } from '@objects/ValueArray'
import { setOperatorAttributes } from '@operators/attributes'

export function bind ({ calls }: IInternalState, block: Internal<BlockValue>): CycleResult {
  calls.pushParameter(block)
  calls.pushParameter({
    type: ValueType.integer,
    number: 0
  })
  return null
}

setOperatorAttributes(bind, {
  loop ({ calls, dictionaries }: IInternalState, parameters: readonly InternalValue[]): CycleResult | false {
    const indexValue = parameters.at(-1)
    if (indexValue === undefined || indexValue.type !== ValueType.integer) {
      return false
    }
    let index = indexValue.number
    const blockValue = parameters.at(-2)
    checkBlockValue(blockValue)
    ValueArray.check(blockValue.block)
    const { block } = blockValue
    const blockItem = block.at(index)
    if (blockItem !== null) {
      if (blockItem.type === ValueType.call) {
        try {
          const resolvedValue = dictionaries.lookup(blockItem.call)
          // TODO: some operators can be replaced with values (true, false, mark...)
          block.set(index, {
            ...resolvedValue,
            debug: getDebugInfos(blockItem)
          })
        } catch (e) {
          if (!(e instanceof Undefined)) {
            throw e
          }
        }
      } else if (blockItem.type === ValueType.block) {
        calls.pushParameter(blockItem)
        calls.pushParameter({
          type: ValueType.integer,
          number: 0
        })
        return null
      }
    }
    calls.popParameter()
    if (++index < block.length) {
      calls.pushParameter({
        type: ValueType.integer,
        number: index + 1
      })
    } else {
      calls.popParameter()
    }
    return null
  }
}, ValueType.block)
