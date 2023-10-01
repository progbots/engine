import { Value, ValueType } from '@api'
import { CycleResult, IInternalState } from '@sdk'
import { TypeCheck } from '@errors'

const implementations: { [type in ValueType]?: (container: Value<type>) => number } = {
  [ValueType.string]: ({ string }) => string.length,

  [ValueType.array]: ({ array }) => array.length,

  [ValueType.dictionary]: ({ dictionary }) => dictionary.names.length,

  [ValueType.block]: ({ block }) => block.length
}

export function length ({ operands }: IInternalState): CycleResult {
  const [container] = operands.check(null)
  const implementation = implementations[container.type]
  if (implementation === undefined) {
    throw new TypeCheck()
  }
  operands.splice(1, {
    type: ValueType.integer,
    number: implementation(container as never)
  })
  return null
}
