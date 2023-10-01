import { IArray, Value, ValueType, checkIntegerValue, checkStringValue } from '@api'
import { CycleResult, IInternalState, InternalValue } from '@sdk'
import { RangeCheck, TypeCheck, Undefined } from '@errors'
import { ValueArray } from '@objects/ValueArray'

function checkIntegerIndex (index: InternalValue, max: number): number {
  try {
    checkIntegerValue(index)
  } catch (e) {
    throw new TypeCheck()
  }
  const { number } = index
  if (number < 0 || number >= max) {
    throw new RangeCheck()
  }
  return number
}

function arrayLikeImplementation (container: IArray, index: InternalValue): InternalValue {
  ValueArray.check(container)
  const result = container.at(checkIntegerIndex(index, container.length))
  if (result === null) {
    throw new RangeCheck()
  }
  return result
}

const implementations: { [type in ValueType]?: (container: Value<type>, index: InternalValue) => InternalValue } = {
  [ValueType.string]: ({ string }, index): InternalValue => {
    const pos = checkIntegerIndex(index, string.length)
    return {
      type: ValueType.integer,
      number: string.charCodeAt(pos)
    }
  },

  [ValueType.array]: ({ array }, index): InternalValue => arrayLikeImplementation(array, index),

  [ValueType.dictionary]: ({ dictionary }, index): InternalValue => {
    try {
      checkStringValue(index)
    } catch (e) {
      throw new TypeCheck()
    }
    const value = dictionary.lookup(index.string)
    if (value === null) {
      throw new Undefined()
    }
    return value
  },

  [ValueType.block]: ({ block }, index): InternalValue => arrayLikeImplementation(block, index)
}

export function get ({ operands }: IInternalState): CycleResult {
  const [index, container] = operands.check(null, null)
  const implementation = implementations[container.type]
  if (implementation === undefined) {
    throw new TypeCheck()
  }
  const value = implementation(container as never, index)
  operands.splice(2, value)
  return null
}
