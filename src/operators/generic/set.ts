import { Value, ValueType, checkIntegerValue, checkStringValue } from '@api'
import { CycleResult, InternalValue, IInternalState, scanIWritableDictionary } from '@sdk'
import { RangeCheck, TypeCheck } from '@errors'
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

const implementations: { [type in ValueType]?: (container: Value<type>, index: InternalValue, value: InternalValue) => InternalValue | undefined} = {
  [ValueType.string]: ({ string }, index, value) => {
    const pos = checkIntegerIndex(index, string.length)
    try {
      checkIntegerValue(value)
    } catch (e) {
      throw new TypeCheck()
    }
    return {
      type: ValueType.string,
      string: [
        string.substring(0, pos),
        String.fromCharCode(value.number),
        string.substring(pos + 1)
      ].join('')
    }
  },

  [ValueType.array]: ({ array }, index, value) => {
    ValueArray.check(array)
    array.set(checkIntegerIndex(index, array.length), value)
    return undefined
  },

  [ValueType.dictionary]: ({ dictionary }, index, value) => {
    try {
      checkStringValue(index)
    } catch (e) {
      throw new TypeCheck()
    }
    scanIWritableDictionary(dictionary)
    dictionary.def(index.string, value)
    return undefined
  }
}

export function set ({ operands }: IInternalState): CycleResult {
  const [value, index, container] = operands.check(null, null, null)
  const implementation = implementations[container.type]
  if (implementation === undefined) {
    throw new TypeCheck()
  }
  operands.splice(3, implementation(container as never, index, value) ?? container)
  return null
}
