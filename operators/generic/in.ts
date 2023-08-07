import { ValueType } from '../../index'
import { TypeCheck } from '../../errors/index'
import { CycleResult, InternalValue, State, checkDictValue } from '../../state/index'
import { ArrayLike } from '../../objects/Array'

/* eslint-disable no-labels */

function arrayLikeImpl (container: InternalValue, value: InternalValue): boolean {
  assert: ArrayLike.check(container.data)
  return container.data.some((item: InternalValue) => item.type === value.type && item.data === value.data)
}

const implementations: Record<string, (container: InternalValue, value: InternalValue) => boolean> = {
  [ValueType.array]: arrayLikeImpl,

  [ValueType.dict]: (container: InternalValue, index: InternalValue): boolean => {
    assert: checkDictValue(container)
    if (index.type !== ValueType.string) {
      throw new TypeCheck()
    }
    const name = index.data
    return container.data.names.includes(name)
  },

  [ValueType.block]: arrayLikeImpl,

  [ValueType.proc]: arrayLikeImpl
}

export function inOp ({ operands }: State): CycleResult {
  const [value, container] = operands.check(null, null)
  const impl = implementations[container.type]
  if (impl === undefined) {
    throw new TypeCheck()
  }
  operands.splice(2, {
    type: ValueType.boolean,
    data: impl(container, value)
  })
  return null
}

Object.defineProperty(inOp, 'name', {
  value: 'in',
  writable: false
})
