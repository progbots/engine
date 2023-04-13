import { IDictionary, ValueType } from '../index'
import { RangeCheck, TypeCheck, Undefined } from '../errors/index'
import { InternalValue, State } from '../state/index'
import { checkOperands } from './operands'
import { ArrayLike } from '../objects/Array'
import { ShareableObject } from '../objects/ShareableObject'

function arrayLikeGetter (state: State): InternalValue {
  const [index, container] = state.operandsRef
  if (index.type !== ValueType.integer) {
    throw new TypeCheck()
  }
  const pos = index.data as number
  const array = container.data as ArrayLike
  return array.at(pos)
}

const getters: Record<string, (state: State) => InternalValue> = {
  [ValueType.string]: (state: State): InternalValue => {
    const [index, container] = state.operandsRef
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

  [ValueType.dict]: (state: State): InternalValue => {
    const [index, container] = state.operandsRef
    if (index.type !== ValueType.name) {
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

export function * get (state: State): Generator {
  const [, container] = checkOperands(state, null, null)
  const getter = getters[container.type]
  if (getter === undefined) {
    throw new TypeCheck()
  }
  ShareableObject.addRef(container)
  try {
    const value = getter(state)
    state.pop()
    state.pop()
    state.push(value)
  } finally {
    ShareableObject.release(container)
  }
}
