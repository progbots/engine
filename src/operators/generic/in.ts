import { IArray, Value, ValueType, checkStringValue, valueOf } from '@api'
import { CycleResult, InternalValue, IInternalState } from '@sdk'
import { TypeCheck } from '@errors'
import { ValueArray } from '@objects/ValueArray'

function arrayLikeImplementation (container: IArray, value: InternalValue): boolean {
  ValueArray.check(container)
  return container.some((item: InternalValue) => item.type === value.type && valueOf(item) === valueOf(value))
}

const implementations: { [type in ValueType]?: (container: Value<type>, value: InternalValue) => boolean } = {
  [ValueType.array]: ({ array }, value) => arrayLikeImplementation(array, value),

  [ValueType.dictionary]: ({ dictionary }, value): boolean => {
    try {
      checkStringValue(value)
    } catch (e) {
      throw new TypeCheck()
    }
    const { string } = value
    return dictionary.names.includes(string)
  },

  [ValueType.block]: ({ block }, value) => arrayLikeImplementation(block, value)
}

export function inOp ({ operands }: IInternalState): CycleResult {
  const [value, container] = operands.check(null, null)
  const implementation = implementations[container.type]
  if (implementation === undefined) {
    throw new TypeCheck()
  }
  operands.splice(2, {
    type: ValueType.boolean,
    isSet: implementation(container as never, value)
  })
  return null
}

Object.defineProperty(inOp, 'name', {
  value: 'in',
  writable: false
})
