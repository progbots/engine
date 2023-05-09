import { IDictionary, ValueType } from '../index'
import { TypeCheck } from '../errors/index'
import { InternalValue, State } from '../state/index'
import { ArrayLike } from '../objects/Array'
import { ShareableObject } from '../objects/ShareableObject'

function arrayLikeLength (container: InternalValue): number {
  const array = container.data as ArrayLike
  return array.length
}

const sizers: Record<string, (container: InternalValue) => number> = {
  [ValueType.string]: (container: InternalValue): number => {
    const string = container.data as string
    return string.length
  },

  [ValueType.array]: arrayLikeLength,

  [ValueType.dict]: (container: InternalValue): number => {
    const iDict = container.data as IDictionary
    return iDict.names.length
  },

  [ValueType.proc]: arrayLikeLength
}

export function * length ({ operands }: State): Generator {
  const [container] = operands.check(null)
  const sizer = sizers[container.type]
  if (sizer === undefined) {
    throw new TypeCheck()
  }
  ShareableObject.addRef(container)
  try {
    const length = sizer(container)
    operands.splice(1, {
      type: ValueType.integer,
      data: length
    })
  } finally {
    ShareableObject.release(container)
  }
}
