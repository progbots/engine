import { IDictionary, ValueType } from '../index'
import { RangeCheck, TypeCheck, Undefined } from '../errors/index'
import { InternalValue, State } from '../state/index'
import { ArrayLike } from '../objects/Array'
import { ShareableObject } from '../objects/ShareableObject'

function arrayLikeGetter (container: InternalValue, index: InternalValue): InternalValue {
  if (index.type !== ValueType.integer) {
    throw new TypeCheck()
  }
  const pos = index.data as number
  const array = container.data as ArrayLike
  return array.at(pos)
}

const getters: Record<string, (container: InternalValue, index: InternalValue) => InternalValue> = {
  [ValueType.string]: (container: InternalValue, index: InternalValue): InternalValue => {
    if (index.type !== ValueType.integer) {
      throw new TypeCheck()
    }
    const pos = index.data as number
    const string = container.data as string
    if (pos < 0 || pos >= string.length) {
      throw new RangeCheck()
    }
    return {
      type: ValueType.integer,
      data: string.charCodeAt(pos)
    }
  },

  [ValueType.array]: arrayLikeGetter,

  [ValueType.dict]: (container: InternalValue, index: InternalValue): InternalValue => {
    if (index.type !== ValueType.string) {
      throw new TypeCheck()
    }
    const name = index.data as string
    const iDict = container.data as IDictionary
    const value = iDict.lookup(name)
    if (value === null) {
      throw new Undefined()
    }
    return value
  },

  [ValueType.proc]: arrayLikeGetter
}

export function * get ({ operands }: State): Generator {
  const [index, container] = operands.check(null, null)
  const getter = getters[container.type]
  if (getter === undefined) {
    throw new TypeCheck()
  }
  ShareableObject.addRef(container) // TODO: does not work for strings
  try {
    const value = getter(container, index)
    operands.splice(2, value)
  } finally {
    ShareableObject.release(container)
  }
}
