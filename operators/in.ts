import { IDictionary, ValueType } from '../index'
import { TypeCheck } from '../errors/index'
import { InternalValue, State } from '../state/index'
import { ArrayLike } from '../objects/Array'
import { ShareableObject } from '../objects/ShareableObject'

function arrayLikeImpl (container: InternalValue, value: InternalValue): boolean {
  const array = container.data as ArrayLike
  return array.some((item: InternalValue) => item.type === value.type && item.data === value.data)
}

const implementations: Record<string, (container: InternalValue, value: InternalValue) => boolean> = {
  [ValueType.array]: arrayLikeImpl,

  [ValueType.dict]: (container: InternalValue, index: InternalValue): boolean => {
    if (index.type !== ValueType.string) {
      throw new TypeCheck()
    }
    const name = index.data as string
    const iDict = container.data as IDictionary
    return iDict.names.includes(name)
  },

  [ValueType.proc]: arrayLikeImpl
}

export function * inOp ({ operands }: State): Generator {
  const [value, container] = operands.check(null, null)
  const impl = implementations[container.type]
  if (impl === undefined) {
    throw new TypeCheck()
  }
  ShareableObject.addRef(container)
  try {
    const data = impl(container, value)
    operands.splice(2, {
      type: ValueType.boolean,
      data
    })
  } finally {
    ShareableObject.release(container)
  }
}

Object.defineProperty(inOp, 'name', {
  value: 'in',
  writable: false
})
